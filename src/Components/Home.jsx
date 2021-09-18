import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap"

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

        <Form>
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
      </div>
    );
  }
}