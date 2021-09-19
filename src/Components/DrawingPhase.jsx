import React from "react";
import Client from "../client";
import Countdown from "./Countdown";
import Canvas from "../Components/Canvas";
import AvatarDisplay from "./Avatar/AvatarDisplay";

import Paint from "./Paint";

export default class DrawingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;

    this.state = { gameState: "DRAWING", countdown: <Countdown time={120} after="left to finish drawing!" /> }
    this.socket.on("newState", (newState) => {
      this.setState({ gameState: newState });
      this.setState({ countdown: undefined });
      this.setState({ countdown: <Countdown time={120} after="left to finish drawing!" /> })
    })

  }

  sendDrawing = () => {
    // TODO: send lines
  };

  render() {
    return (
      <div className="game">
        <div
          style={{
            color: "white",
            textShadow: "black 0 0 3px",
            fontWeight: "1000",
            textAlign: "center",

            fontSize: "3em",
          }}
        >
          {this.state.gameState === "DESCRIBE" ? "Description" : "Drawing"}{" "}
          Phase!
        </div>
        {this.state.gameState === "DESCRIBE" && (
          <div
            style={{
              color: "white",
              textShadow: "black 0 0 3px",
              fontWeight: "1000",
              textAlign: "center",
              marginBottom: "3em",
            }}
          >
            Listen carefully to how the speaker describes the drawing. Try your
            best to follow their instructions!
          </div>
        )}
        {this.state.countdown}

        <Canvas
          props={{
            client: this.client,
          }}
        />
      </div>
    );
  }
}
