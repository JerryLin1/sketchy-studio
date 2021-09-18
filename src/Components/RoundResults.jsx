import React from "react";

export default class RoundResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scores: [
        { name: "Tom", score: 1 },
        { name: "Yerry", score: 2 },
        { name: "Roseak", score: 3 },
        { name: "Christina", score: 4 },
      ],
    };
  }

  componentDidMount = () => {
    
  }

  render() {
    return (
      <div className="round-results">
        <center style={{ marginBottom: "2.5em" }}>
          <h1 className="page-title">Here are the round results!</h1>
        </center>

        <div id="round-result-leaderboard">
          <h2 id="winner-prompt">The winner of this round is...</h2>
          <h2 id="winner-name">Rosak!</h2>
        </div>
      </div>
    );
  }
}