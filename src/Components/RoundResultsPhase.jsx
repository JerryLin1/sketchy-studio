import React from "react";
import { Button } from "react-bootstrap";
import AvatarDisplay from "./Avatar/AvatarDisplay";


export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;
    this.state = {
      drawings: [{
        name: "among", drawing: "placeholder", avatar: {
          bodyNum: -1,
          eyesNum: -1,
          hairNum: -1,
          mouthNum: -1,
          shirtNum: -1
        }
      }],
      currentDrawing: 0,
      voted: false,
      isDescriber: false
    }

    this.socket.on("receiveDrawings", drawings => {
      this.setState({ drawings: drawings });
    })

    this.socket.on("receiveIsDescriber", isDescriber => {
      this.setState({ isDescriber: isDescriber });
    })

    this.socket.on("goNext", () => {
      this.setState({ currentDrawing: this.state.currentDrawing + 1 })
    })

    this.socket.on("goPrev", () => {
      this.setState({ currentDrawing: this.state.currentDrawing - 1 });
    })

  }

  render() {
    return (
      <div className="round-results">
        <center style={{ marginBottom: "2.5em" }}>
          <h1 className="page-title">Here are the round results!</h1>
        </center>

        <div id="drawing-container">
          <div id="artist-name">Here's {this.state.drawings[this.state.currentDrawing].name}'s drawing:</div>
          <img src={this.state.drawings[this.state.currentDrawing].drawing} alt="oops" />
          <AvatarDisplay
            avatar={{
              bodyNum: this.state.drawings[this.state.currentDrawing].bodyNum,
              eyesNum: this.state.drawings[this.state.currentDrawing].eyesNum,
              hairNum: this.state.drawings[this.state.currentDrawing].hairNum,
              mouthNum: this.state.drawings[this.state.currentDrawing].mouthNum,
              shirtNum: this.state.drawings[this.state.currentDrawing].shirtNum,
            }}
            size={1.5}
          />

        </div>

        <Button disabled={this.state.voted || !this.state.isDescriber || this.state.currentDrawing === 0} onClick={
          () => {
            this.socket.emit("voteFor", this.state.drawings.id);
            this.setState({ voted: true })
          }}>Vote for this image</Button>


        {/* Go prev button */}
        <Button disabled={this.state.currentDrawing === 0} onClick={() => {
          if (this.state.currentDrawing > 0) {
            this.socket.emit("prevImage");
          }
        }}>

          Prev drawing
        </Button>

        {/* Go next button */}
        <Button onClick={() => {
          if (this.state.currentDrawing < this.state.drawings.length - 1) {
            this.socket.emit("nextImage");
          } else {
            // Go to next phase
            this.socket.emit("nextRound");
          }
        }}>

          {(this.state.currentDrawing < this.state.drawings.length - 1) ? "Next drawing" : "Next round"}
        </Button>




        {/* <div id="round-result-winner">
          <h2 id="winner-prompt">The winner of this round is...</h2>
          <h2 id="winner-name">{"Rosak"}!</h2>
          <div>Player icon here</div>
        </div> */}
      </div>
    );
  }
}
