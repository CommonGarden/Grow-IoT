import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UnauthenticatedApp from './UnauthenticatedApp.jsx';
import AuthenticatedApp from './AuthenticatedApp.jsx';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Switch>
            <Redirect exact from="/" to="/app"/>
            <Route path="/app" component={AuthenticatedApp} />
            <Route path="/public" component={UnauthenticatedApp} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}
