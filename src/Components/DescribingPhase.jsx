import React from "react";
import Client from "../client";

import Paint from "./Paint";

export default class DescribingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;

    this.state = {drawing: "", artist: ""};

    this.socket.on("describer", data => {
      this.setState({drawing: data.drawing});
      this.setState({artist: data.artist});
      console.log(data.artist);
    })
  }

  

  render() {
    return (
      <div className="game">
        <div>{this.state.artist}</div>
        <img src = {this.state.drawing} alt = "OOPS"/>
      </div>
    );
  }
}
