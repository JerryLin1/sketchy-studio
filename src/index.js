import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, MemoryRouter, Switch } from "react-router-dom";
import Client from "./client";
import Paint from "./Components/Paint";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client({
      match: props.match,
    });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route>
            Hello World
            <Paint
              props={{
                client: this.client,
              }}
            />
          </Route>
          {/* <Route path="/:roomId?" exact render={(props) => (<Home client={this.client} match={props.match} />)} />
          <Route path="/:roomId/lobby" exact render={(props) => (<Lobby client={this.client} match={props.match} />)} /> */}
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <MemoryRouter>
    <Route render={(props) => <App match={props} />} />
  </MemoryRouter>,
  document.getElementById("root")
);
