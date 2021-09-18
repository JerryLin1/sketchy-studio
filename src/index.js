import React from "react";
import ReactDOM from "react-dom";

import './index.css'

import { BrowserRouter, Route, MemoryRouter, Switch } from "react-router-dom";
import Client from "./client";
import Paint from "./Components/Paint";

import Home from "./Components/Home";
import Lobby from "./Components/Lobby";
<<<<<<< HEAD
import RoundResults from "./Components/RoundResults";
import GameResults from "./Components/GameResults";

import 'bootstrap/dist/css/bootstrap.min.css';
import DrawingPromptsPhase from "./Components/DrawingPromptsPhase";
=======

import 'bootstrap/dist/css/bootstrap.min.css';
import DrawingPhase from "./Components/DrawingPhase";
import DescribingPhase from "./Components/DescribingPhase";

import RoundResultsPhase from "./Components/RoundResultsPhase";

import GameResultsPhase from "./Components/GameResultsPhase";

>>>>>>> 3a7da02291c8aeae019257e91708d15ac94fbbbd

class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client({
      match: props.match,
    });
    console.log(this.client)
    // this.paints = {
    //   //socket.id: Paint element
    // };
    this.client.socket.on("newClient", (socket) => { });
  }

  render() {
    return (
      <div>
        <Switch>
          {/* <Route>
            Hello World
            <Paint
              props={{
                id: this.client.socket.id,
                client: this.client,
                forDisplay: false,
              }}
            />
          </Route> */}
          <Route path="/:roomId?" exact render={(props) => (<DrawingPromptsPhase client={this.client} match={props.match} />)} />
          <Route path="/:roomId/lobby" exact render={(props) => (<Lobby client={this.client} match={props.match} />)} />
          <Route path="/:roomId/drawing" exact render={(props) => (<DrawingPhase client={this.client} match={props.match} />)} />
          <Route path="/:roomId/describing" exact render={(props) => (<DescribingPhase client={this.client} match={props.match} />)} />
          <Route path="/:roomId/round_results" exact render={(props) => (<RoundResultsPhase client={this.client} match={props.match} />)} />
          <Route path="/:roomId/game_results" exact render={(props) => (<GameResultsPhase client={this.client} match={props.match} />)} />
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Route render={(props) => <App match={props} />} />
  </BrowserRouter>,
  document.getElementById("root")
);