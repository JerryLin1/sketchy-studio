import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import AvatarDisplay from "./Avatar/AvatarDisplay";

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
<<<<<<< HEAD
      isHost: false,
    };
=======
      isDescriber: false
    }
>>>>>>> 894738b2f2bdd8931b1c90477bec8648bee8c41b

    this.socket.on("receiveDrawings", (drawings) => {
      this.setState({ drawings: drawings });
    });

<<<<<<< HEAD
    this.socket.on("receiveIsHost", (isHost) => {
      this.setState({ isHost: isHost });
    });
=======
    this.socket.on("receiveIsDescriber", isDescriber => {
      this.setState({ isDescriber: isDescriber });
    })
>>>>>>> 894738b2f2bdd8931b1c90477bec8648bee8c41b

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
        <h1 className="page-title" style={{ textAlign: "center" }}>
          Here are the round results!
        </h1>

        <Row>
          <Col style={{ textAlign: "center", margin: "auto" }}>
            <Button
              disabled={this.state.currentDrawing === 0}
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
              alt="Drawing"
            />
          </Col>
          <Col style={{ textAlign: "center", margin: "auto" }}>
            <Button
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
              !this.state.isHost ||
              this.state.currentDrawing === 0
            }
            onClick={() => {
              this.socket.emit("voteFor", this.state.drawings.id);
              this.setState({ voted: true });
            }}
            variant="outline-light"
          >
            Vote for this image
          </Button>
        </div>

        <Button disabled={this.state.voted || !this.state.isDescriber || this.state.currentDrawing === 0} onClick={
          () => {
            this.socket.emit("voteFor", this.state.drawings.id);
            this.setState({ voted: true })
          }}>Vote for this image</Button>


        {/* Go prev button */}
        <Button disabled={this.state.currentDrawing === 0} onClick={() => {
          if (this.state.currentDrawing > 0) {
            this.socket.emit("prevImage");
          }
        }}>

          Prev drawing
        </Button>

        {/* Go next button */}
        <Button onClick={() => {
          if (this.state.currentDrawing < this.state.drawings.length - 1) {
            this.socket.emit("nextImage");
          } else {
            // Go to next phase
            this.socket.emit("nextRound");
          }
        }}>

          {(this.state.currentDrawing < this.state.drawings.length - 1) ? "Next drawing" : "Next round"}
        </Button>




        {/* <div id="round-result-winner">
          <h2 id="winner-prompt">The winner of this round is...</h2>
          <h2 id="winner-name">{"Rosak"}!</h2>
          <div>Player icon here</div>
        </div> */}
      </div>
    );
  }
}
