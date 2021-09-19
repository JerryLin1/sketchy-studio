import React from "react";
import { Row, Button } from "react-bootstrap";
import ConditionalWrapper from "./ConditionalWrapper.jsx";
import "./Lobby.css";

import logo from "../Assets/Logo.png";
import AvatarDisplay from "./Avatar/AvatarDisplay.jsx";
import Canvas from "./Canvas.jsx";

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
            <div key={key} className="lobby-list-item">
              <ConditionalWrapper
                condition={client.nickname === this.nickname}
                wrapper={(children) => <strong>{children}</strong>}
              >
                {client.nickname}
                {client.isHost && (
                  <span style={{ color: "#b59700" }}>
                    {" "}
                    <strong>HOST</strong>
                  </span>
                )}
              </ConditionalWrapper>
              <div id="player-list-avatar-display">
                <AvatarDisplay
                  avatar={{
                    bodyNum: client.avatar.bodyNum,
                    eyesNum: client.avatar.eyesNum,
                    hairNum: client.avatar.hairNum,
                    mouthNum: client.avatar.mouthNum,
                    shirtNum: client.avatar.shirtNum,
                  }}
                  size={1.5}
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
        <img id="logo" src={logo} />
        <Button
          variant="outline-light"
          onClick={() => {
            this.socket.emit("startGame");
          }}
          style={{
            position: "absolute",
            left: "50%",
            transform: "scale(1.75) translateX(-50%)",
            verticalAlign: "text-top",
          }}
        >
          Start game
        </Button>
        <div id="url">
          <u>
            <strong>Room Code:</strong>
          </u>{" "}
          {this.roomURL}
        </div>

        <div>
          <div id="player-list">
            <h1 style={{ fontWeight: 700, marginTop: "1em" }}>Players</h1>
            {this.state.lobbyList}
          </div>
        </div>
      </div>
    );
  }
}
