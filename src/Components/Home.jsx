import React from "react";
import {Row, Col} from "react-bootstrap"

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="page-title">Sketchy Studio B^)</div>
        
        <button id="join-room-btn">Join a room!</button>
      </div>
    );
  }
}