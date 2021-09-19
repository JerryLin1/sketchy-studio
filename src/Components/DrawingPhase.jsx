import React from "react";
import Client from "../client";
import Canvas from "../Components/Canvas";
import AvatarDisplay from "./Avatar/AvatarDisplay";

import Paint from "./Paint";

export default class DrawingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;

    this.state = { gameState: "DRAWING" };
    this.socket.on("newState", (newState) => {
      this.setState({ gameState: newState });
    });
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
        <Canvas
          props={{
            isDescriber: true,
            client: this.client,
          }}
        />
        <div style={{ border: "4px black solid", display: "inline-block" }}>
          <AvatarDisplay
            flipped={true}
            avatar={{
              bodyNum: this.client.clientsInRoom[this.socket.id].avatar.bodyNum,
              eyesNum: this.client.clientsInRoom[this.socket.id].avatar.eyesNum,
              hairNum: this.client.clientsInRoom[this.socket.id].avatar.hairNum,
              mouthNum:
                this.client.clientsInRoom[this.socket.id].avatar.mouthNum,
              shirtNum:
                this.client.clientsInRoom[this.socket.id].avatar.shirtNum,
            }}
          />
        </div>
      </div>
    );
  }
}
