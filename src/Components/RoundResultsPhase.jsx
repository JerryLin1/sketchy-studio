import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import AvatarDisplay from "./Avatar/AvatarDisplay";

import logo from "../Assets/Logo.png";

import "./RoundResultsPhase.css";

export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;
    this.state = {
      drawings: [
        {
          name: "among",
          drawing: "placeholder",
          avatar: {
            bodyNum: -1,
            eyesNum: -1,
            hairNum: -1,
            mouthNum: -1,
            shirtNum: -1,
          },
        },
      ],
      currentDrawing: 0,
      voted: false,
      isDescriber: false,
    };

    this.socket.on("receiveDrawings", (drawings) => {
      this.setState({ drawings: drawings });
    });

    this.socket.on("receiveIsDescriber", (isDescriber) => {
      this.setState({ isDescriber: isDescriber });
    });

    this.socket.on("goNext", () => {
      this.setState({ currentDrawing: this.state.currentDrawing + 1 });
    });

    this.socket.on("goPrev", () => {
      this.setState({ currentDrawing: this.state.currentDrawing - 1 });
    });
  }

  render() {
    return (
      <div className="round-results">
        <Row id="top-bar">
          <Col xs={4}>
            <img id="logo" src={logo} />
          </Col>
          <Col xs={4}>
            <div
              style={{
                color: "white",
                textShadow:
                  "-2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000, 2px 0 0 #000, 2px 2px 0 #000, 0 2px 0 #000, -2px 2px 0 #000, -2px 0 0 #000, 5px 0px 0 #000",
                fontWeight: "1000",
                textAlign: "center",
                fontSize: "3em",
              }}
              className="noselect dropshadow"
            >
              This round's results
            </div>
          </Col>
        </Row>

        <Row>
          <Col style={{ textAlign: "center", margin: "auto" }}>
            <Button
              disabled={this.state.currentDrawing === 0 || !this.state.isDescriber}
              onClick={() => {
                if (this.state.currentDrawing > 0) {
                  this.socket.emit("prevImage");
                }
              }}
              variant="outline-light"
            >
              Previous drawing
            </Button>
          </Col>
          <Col style={{ textAlign: "center", margin: "auto" }}>

            <div id="drawing-container">
              <div id="artist-name">
                Here's {this.state.drawings[this.state.currentDrawing].name}'s
                drawing:
              </div>
            </div>
            <img
              src={this.state.drawings[this.state.currentDrawing].drawing}
              alt="No drawing submitted"
            />
          </Col>
          <Col style={{ textAlign: "center", margin: "auto" }}>
            <Button
              disabled={!this.state.isDescriber}
              onClick={() => {
                if (
                  this.state.currentDrawing <
                  this.state.drawings.length - 1
                ) {
                  this.socket.emit("nextImage");
                } else {
                  // Go to next phase
                  this.socket.emit("nextRound");
                }
              }}
              variant="outline-light"
            >
              {this.state.currentDrawing < this.state.drawings.length - 1
                ? "Next drawing"
                : "Next round"}
            </Button>
          </Col>
        </Row>

        <div style={{ width: "fit-content", margin: "1em auto 2em auto" }}>
          <Button
            disabled={
              this.state.voted ||
              !this.state.isDescriber ||
              this.state.currentDrawing === 0
            }
            onClick={() => {
              this.socket.emit(
                "voteFor",
                this.state.drawings[this.state.currentDrawing].id
              );
              this.setState({ voted: true });
            }}
            variant="outline-light"
          >
            Vote for this image
          </Button>
        </div>
      </div>
    );
  }
}
