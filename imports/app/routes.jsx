import React, { Component } from 'react';
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router'
import App from './App.jsx';
import UnauthenticatedApp from './UnauthenticatedApp.jsx';
import AuthenticatedApp from './AuthenticatedApp.jsx';
import ThingsList from './pages/ThingsList.jsx';
import AllNotifications from './pages/AllNotifications.jsx';
import AccountsUI from './pages/AccountsUI.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx'

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="/app"/>
          <Route path="/app" component={AuthenticatedApp}>
            <IndexRedirect to="/things"/>
            <Route path="/things" component={ThingsList} />
            <Route path="/notifications" component={AllNotifications} />
          </Route>
          <Route path="/" component={UnauthenticatedApp}>
            <Route path="/account" component={AccountsUI}>
              <IndexRoute component={SignIn} />
              <Route path="/account/create" component={SignUp} />
            </Route>
          </Route>
        </Route>
      </Router>
    );
  }
};
