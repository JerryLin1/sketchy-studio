import React from "react";
import Client from "../client";

import Paint from "./Paint";

export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
  }

  sendDrawing = () => {
    // TODO: send lines

  }

  render() {
    return (
      <div className="game">
        <Paint
          props={{
            id: this.client.socket.id,
            client: this.client,
          }}
        />
      </div>
    );
  }
}
