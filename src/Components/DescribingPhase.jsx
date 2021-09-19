import React from "react";
import { Col, Row } from "react-bootstrap";
import Client from "../client";
import Countdown from "./Countdown";

import logo from "../Assets/Logo.png";

import Paint from "./Paint";

export default class DescribingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;

    this.state = { drawing: "", artist: "" };

    this.socket.on("describer", (data) => {
      this.setState({ drawing: data.drawing });
      this.setState({ artist: data.artist });
      console.log(data.artist);
    });
  }

  render() {
    return (
      <div className="game">
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
                fontSize: "auto",
              }}
              className="noselect dropshadow"
            >
              Describe this drawing to everyone else!
            </div>
          </Col>
        </Row>
        <div
          style={{
            color: "white",
            textShadow: "black 0 0 3px",
            fontWeight: "1000",
            textAlign: "center",
            marginBottom: "3em",
          }}
        >
          Original Artist: {this.state.artist}
        </div>
        <Countdown time={120} after="left to describe the drawing!" />
        <img src={this.state.drawing} alt="OOPS" />
      </div>
    );
  }
}
