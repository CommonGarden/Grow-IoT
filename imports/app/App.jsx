import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UnauthenticatedApp from './UnauthenticatedApp.jsx';
import AuthenticatedApp from './AuthenticatedApp.jsx';
import Theme from './Theme.jsx';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
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
