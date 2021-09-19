import React from "react";

import $ from "jquery";
import Confetti from "react-confetti";

export default class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;

    this.socket.on("receiveWinner", winner => {
      this.setState({winnerPoints: winner.points});
      this.setState({winnerName: winner.name});
      console.log(winner);
      
    });

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
    

    this.state = {
      confetti: null,
      winnerName: "palceholder",
      winnerPoints: 0,
    };



    let count = 0;
    
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
          <h2 className="winner-prompt invisible">With {this.state.winnerPoints} point{this.state.winnerPoints === 1 ? "" : "s"}...</h2>
          <h2 className="winner-prompt invisible">{this.state.winnerName}!</h2>
        </div>
      </div>
    );
  }
}