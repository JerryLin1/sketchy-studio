import React from "react";
import Client from "../client";

import Paint from "./Paint";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client({
      match: props.match,
    });
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
