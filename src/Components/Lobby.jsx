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

      this.setState({
        lobbyList: (
          <div style={{ display: "flex", flexWrap: "wrap" ,justifyContent: "center"}}>
            {Object.values(clients).map((client, key) => {
              return (
                <div key={key} className="lobby-list-item">
                  <ConditionalWrapper
                    condition={client.nickname === this.nickname}
                    wrapper={(children) => <strong>{children}</strong>}
                  >
                    <div style={{ float: "left" }}>{client.nickname}</div>
                    <div style={{ float: "right" }}>
                      {client.isHost && (
                        <span style={{ color: "rgb(241, 207, 96)" }}>
                          {" "}
                          <strong>HOST</strong>
                        </span>
                      )}
                    </div>

                    <div style={{ clear: "both" }}></div>
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
                      size={1}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ),
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
          <strong className="noselect">Room Code: </strong>
          {this.roomURL}
        </div>

        <div>
          <div id="player-list" style={{marginTop: "3em"}}>
            <h1 style={{ fontWeight: 700, marginTop: "0em",  }} className="noselect">Players</h1>
            {this.state.lobbyList}
          </div>
        </div>
      </div>
    );
  }
}
