import React from "react";
import { Row, Button } from "react-bootstrap";

export default class Lobby extends React.Component {
  renderPlayers = () => {
    return <div>Map Something</div>;
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
              {this.renderPlayers()}
          </div>
        </Row>
      </div>
    );
  }
}
