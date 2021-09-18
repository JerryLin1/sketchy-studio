import React from "react";
import io from "socket.io-client";

export default class Client extends React.Component {
  constructor(props) {
    this.socket = io();
  }
}
