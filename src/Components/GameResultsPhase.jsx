import React from "react";

import $ from "jquery";
import Confetti from "react-confetti";

export default class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;

    this.state = {
      confetti: null,
    };

    let count = 0;
    setInterval(() => {
      if (count > 2) {
        clearInterval();
      } else {
        $(".winner-prompt.visible")
          .eq(0)
          .attr("class", "winner-prompt invisible");
        $(".winner-prompt.invisible")
          .eq(count)
          .attr("class", "winner-prompt visible");
        count++;
        if (count > 2) {
          this.setState({
            confetti: (
              <Confetti
                width={`${window.innerWidth}`}
                height={`${window.innerHeight}`}
              />
            ),
          });
        }
      }
    }, 2500);
  }

  render() {
    return (
      <div className="game-results">
        {this.state.confetti}
        <center>
          <h1 className="page-title" style={{ marginBottom: "1em" }}>
            That's The Game!
          </h1>
        </center>
        <div id="game-winner-container">
          <h2 className="winner-prompt visible">Your winner is...</h2>
          <h2 className="winner-prompt invisible">With {"X"} points...</h2>
          <h2 className="winner-prompt invisible">{"ROSAK!"}</h2>
        </div>
      </div>
    );
  }
}
