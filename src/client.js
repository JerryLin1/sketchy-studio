import React from "react";
import io from "socket.io-client";
import $ from "jquery";

export default class Client extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.nickname = "";

    // Redirect URL when client joins/creates room
    this.socket.on("redirect", (id) => {
      this.roomId = id;
      this.pushURL(id);
    });

    this.socket.on("startDrawingPhase", () => {
      this.redirectURL(this.roomId +"/drawing");

    })

    this.socket.on("startDescribingPhase", () => {
      this.redirectURL(this.roomId +"/describing");

    })

    this.socket.on("startRoundResultsPhase", () => {
      this.redirectURL(this.roomId +"/round_results");

    })

    this.socket.on("startGameResultsPhase", () => {
      this.redirectURL(this.roomId +"/game_results");

    })
    this.socket.on("draw", (src)=> {
      let t = $.parseHTML(`<img src=${src}>`)[0]
      // document.body.appendChild(t)

      // React would be
      // this.setState({image: <img src={src}/>})    
    })

    this.state = {
      clientsInRoom: {
        // TODO: This should just be server.room.clients
      },
    };
  }

  pushURL = (id) => {
    this.props.match.history.push("/" + id);
  }

  redirectURL = (id) => {
    this.props.match.history.replace("/" + id);
  }

  createRoom = () => {
    this.socket.emit("createRoom");
  }

  joinRoom = (roomId) => {
    // TODO: Add avatar and default nickname

    let nickname = localStorage.getItem("nickname");
    console.log(nickname);
    let avatar = JSON.parse(localStorage.getItem("avatar"));
    // let defaultNickname = localStorage.getItem("defaultNickname")
    this.roomId = roomId;
    this.socket.emit("joinRoom", {
      roomId: roomId,
      nickname: nickname,
      avatar: avatar,
      // defaultNickname: defaultNickname,
    });
  };
}
