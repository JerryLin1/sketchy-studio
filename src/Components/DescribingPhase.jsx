import React from "react";
import Client from "../client";
import Countdown from "./Countdown";
import noDrawing from "../Assets/NoDrawing.png";

import Paint from "./Paint";

export default class DescribingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;

    this.state = { drawing: "", artist: "" };

    this.socket.on("describer", data => {
      this.setState({ drawing: data.drawing });
      this.setState({ artist: data.artist });
      console.log(data.artist);
    })
  }



  render() {
    return (
      <div className="game">
        <div style={{
          color: "white",
          textShadow: "black 0 0 3px",
          fontWeight: "1000",
          textAlign: "center",
          fontSize: "3em"

        }}>Describe this drawing to everyone else!</div>
        <div style={{
          color: "white",
          textShadow: "black 0 0 3px",
          fontWeight: "1000",
          textAlign: "center",
          marginBottom: "3em"

        }}>Original Artist: {this.state.artist}</div>
        <Countdown time = {120} after = "left to describe the drawing!"/>
        <img src={this.state.drawing === "NoDrawing" ? noDrawing : this.state.drawing} alt="OOPS" />
      </div>
    );
  }
}
