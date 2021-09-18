import React from "react";

import { Award } from "react-bootstrap-icons";

import { Row, Col } from "react-bootstrap";

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

  render() {
    return (
      <div className="round-results">
        <center style={{ marginBottom: "2.5em" }}>
          <h1 className="page-title">Here are the round results!</h1>
        </center>

        <div id="round-result-leaderboard">

        </div>
      </div>
    );
  }
}