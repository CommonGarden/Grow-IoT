import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import UnauthenticatedApp from './UnauthenticatedApp.jsx';
import AuthenticatedApp from './AuthenticatedApp.jsx';
// import Theme from './Theme.jsx';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Redirect exact from="/" to="/app"/>
          <Route path="/app" component={AuthenticatedApp} />
          <Route path="/public" component={UnauthenticatedApp} />
        </Switch>
      </div>
    );
  }
}
