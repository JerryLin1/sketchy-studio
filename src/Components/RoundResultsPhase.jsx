import React from "react";
import Client from "../client";

import Paint from "./Paint";

export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    let prompt = document.getElementById("winner-prompt");
    let name = document.getElementById("winner-name");

    setTimeout(() => {
      prompt.id = "winner-prompt-invisible";
      name.id = "winner-name-visible";
    }, 2500);
  };

  render() {
    return (
      <div className="round-results">
        <center style={{ marginBottom: "2.5em" }}>
          <h1 className="page-title">Here are the round results!</h1>
        </center>

        <div id="round-result-winner">
          <h2 id="winner-prompt">The winner of this round is...</h2>
          <h2 id="winner-name">{"Rosak"}!</h2>
          <div>Player icon here</div>
        </div>
      </div>
    );
  }
}
