import React from "react";
import { Row, Button } from "react-bootstrap";
import ConditionalWrapper from "./ConditionalWrapper.jsx"
import "./Lobby.css";

import logo from "../Assets/Screen_Shot_2021-09-18_at_12.22.10_PM.png";
import AvatarDisplay from "./Avatar/AvatarDisplay.jsx";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.socket = this.client.socket;
    this.roomURL = window.location.host + "/" + this.props.match.params.roomId;
    this.state = {
      lobbyList: [],
    };

    if (props.match.params.roomId.length > 1) {
      this.client.joinRoom(props.match.params.roomId);
    }

    this.socket.on("updateClientList", (clients) => {
      this.name = clients[this.client.socket.id].name;
      this.room = clients;

      console.log(clients);

      this.setState({
        lobbyList: Object.values(clients).map((client, key) => {
          return (
            <div
              key={key}
              className="lobby-list-item"
              style={{
                boxShadow:
                  client.nickname === this.nickname
                    ? "0 0 10px #f2ff9e"
                    : "none",
                border:
                  client.nickname === this.nickname
                    ? "solid #e8ff52 3px"
                    : "none",
              }}
            >
              <ConditionalWrapper
                condition={client.nickname === this.nickname}
                wrapper={(children) => <strong>{children}</strong>}
              >
                {client.nickname}
              </ConditionalWrapper>
              {client.isHost && (
                <span style={{ color: "#b59700", float: "right" }}> HOST</span>
              )}
              <div
                style={{
                  borderRadius: "0 0 10px 10px",
                  boxSizing: "border-box",
                  backgroundColor: "#52aeff",
                }}
              >
                <AvatarDisplay
                  avatar={{
                    bodyNum: client.avatar.bodyNum,
                    eyesNum: client.avatar.eyesNum,
                    hairNum: client.avatar.hairNum,
                    mouthNum: client.avatar.mouthNum,
                    shirtNum: client.avatar.shirtNum,
                  }}
                  size={0.5}
                />
              </div>
            </div>
          );
        }),
      });
    });
  }

  render() {
    return (
      <div className="lobby">
        <img src={logo} style={{ transform: "scale(0.75)" }} />
        <Row>
          <center>
            <Button variant="outline-light"
              onClick={() => {
                this.socket.emit("startGame");
              }}>
              Start game
            </Button>
          </center>
          <div>{this.roomURL}</div>
        </Row>
        <Row>
          <div id="player-list">
            <h1 style={{ fontWeight: 700 }}>Players</h1>
            {this.state.lobbyList}
          </div>
        </Row>
      </div>
    );
  }
}
