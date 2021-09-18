import React from "react";
import { Button } from "react-bootstrap";


export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;
    this.state = { drawings: [{ name: "among", drawing: "placeholder" }], currentDrawing: 0, isHost: true }

    this.socket.on("receiveDrawings", (drawings, isHost) => {
      this.setState({ drawings: drawings });
      this.setState({ isHost: isHost });
    })

  }

  componentDidMount = () => {
    // let prompt = document.getElementById("winner-prompt");
    // let name = document.getElementById("winner-name");

    // setTimeout(() => {
    //   prompt.id = "winner-prompt-invisible";
    //   name.id = "winner-name-visible";
    // }, 2500);
  };

  render() {
    return (
      <div className="round-results">
        <center style={{ marginBottom: "2.5em" }}>
          <h1 className="page-title">Here are the round results!</h1>
        </center>

        <div id="drawing-container">
          <div id="artist-name">Here's {this.state.drawings[this.state.currentDrawing].name}'s drawing:</div>
          <img src={this.state.drawings[this.state.currentDrawing].drawing} alt="oops" />
        </div>


        {this.state.isHost && (<Button onClick={() => {
          if (this.state.currentDrawing < this.state.drawings.length-1) {
            this.setState({ currentDrawing: this.state.currentDrawing + 1 })
          } else {
            // Go to next phase
            this.socket.emit("nextRound");
          }

        }}>

          {(this.state.currentDrawing < this.state.drawings.length-1) ? "Next drawing" : "Next round"}
        </Button>)}


        {/* <div id="round-result-winner">
          <h2 id="winner-prompt">The winner of this round is...</h2>
          <h2 id="winner-name">{"Rosak"}!</h2>
          <div>Player icon here</div>
        </div> */}
      </div>
    );
  }
}
