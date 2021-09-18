import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap"
import logo from "../Assets/Logo.png";

import AvatarCustomizer from "./Avatar/AvatarCustomizer";
import "./Home.css";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.client = props.client;
  }

  setNick = (nickname) => {
    localStorage.setItem("nickname", nickname);
  }

  render() {
    return (
      <div className="home">
        <img src={logo} style={{ transform: "scale(0.55)", display: "block", margin: "auto" }} />


        <Button
        onClick={() => {
   
          window.location.pathname.substring(1) === ""
            ? this.client.createRoom()
            : this.client.redirectURL(
                `${window.location.pathname.substring(1)}/lobby`
              );
        }}>
          {window.location.pathname.substring(1) === ""
            ? "Create room" : "Join room"}
        </Button>

        <div id = "customization-header">
          Choose your nickname and avatar!
        </div>

        <Form id = "customization-form">
          <Row id="customization-row">
            <Col xs="auto">
              <Form.Control
                placeholder={localStorage.getItem("nickname")}
                id="input-nick"
                autoComplete="off"
                maxLength="12"
                onChange={() => {
                  let input = document.getElementById('input-nick');
                  this.setNick(input.value);
                }}
              />
            </Col>
          </Row>
        </Form>

        <div>
          <AvatarCustomizer />
        </div>
      </div>
    );
  }
}
