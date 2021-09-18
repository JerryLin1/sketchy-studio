import React from "react";
import { Row, Col, Button } from "react-bootstrap"

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.client = props.client;
  }

  render() {
    return (
      <div className="home">
        <div className="page-title">Sketchy Studio B^)</div>

        <Button
        onClick={() => {
   
          window.location.pathname.substring(1) === ""
            ? this.client.createRoom()
            : this.client.redirectURL(
                `${window.location.pathname.substring(1)}/lobby`
              );
        }}>
          join room
        </Button>
      </div>
    );
  }
}