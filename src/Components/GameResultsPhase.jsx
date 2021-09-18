import React from "react";

import ConfettiGenerator from "confetti-js"

import Client from "../client";

export default class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;

    let count = 0;
    setInterval(() => {
      if (count > 2) {
        clearInterval();
      } else {
        
        count++;
        
      }
    }, 2500);
  }

  render() {
    return (
      <div className="game-results">
        <center>
          <h1 className="page-title" style={{ marginBottom: "1em" }}>
            That's The Game!
          </h1>
        </center>
        <div id="game-winner-container">
          <h2 className="winner-prompt-visble">
            Your winner is...
          </h2>
          <h2 className="winner-prompt-invisible">
            With {"X"} points...
          </h2>
          <h2 className="winner-prompt-invisible">
            ROSAK! :D
          </h2>
        </div>
      </div>
    );
  }
}