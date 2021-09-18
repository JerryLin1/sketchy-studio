import React from "react";
import { Row, Button } from "react-bootstrap";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: ["Tom", "Jerry", "Roseak", "Christina"],
    };
  }

  renderPlayers = () => {
    let playersElements = this.state.players.map((player, key) => {
      return (
        <div className="player-card" id={`player-card-${key}`} key={key}>
          {key + 1}. {player}
        </div>
      );
    });
    return playersElements;
  };

  render() {
    return (
      <div className="lobby">
        <Row>
          <center>
            <Button variant="outline-light">Start game</Button>
          </center>
        </Row>
        <Row>
          <div id="player-list">
            <h1 style={{fontWeight: 700}}>Players</h1>
            {this.renderPlayers()}
          </div>
        </Row>
      </div>
    );
  }
}
