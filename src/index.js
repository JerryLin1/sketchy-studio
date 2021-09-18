import React from "react";
import ReactDOM from "react-dom";

import './index.css'

import { BrowserRouter, Route, MemoryRouter, Switch } from "react-router-dom";
import Client from "./client.js";

import Home from "./Components/Home.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client({
      switchState: this.switchState,
      match: props.match,
    });
  }

  render() {
    return (
      <div>
        <Switch>
          {/* <Route path="/:roomId?" exact render={(props) => (<Home client={this.client} match={props.match} />)} />
          <Route path="/:roomId/lobby" exact render={(props) => (<Lobby client={this.client} match={props.match} />)} /> */}
          
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <MemoryRouter>
    <Route render={(props) => <Home/>} />
  </MemoryRouter>,
  document.getElementById("root")
);