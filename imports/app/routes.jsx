import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import App from './App.jsx';
import AuthenticatedApp from './AuthenticatedApp.jsx';
import AccountsUI from './pages/AccountsUI.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx'

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={AuthenticatedApp}>
        </Route>
        <Route path="/" component={App}>
          <Route path="/account" component={AccountsUI}>
            <IndexRoute component={SignIn} />
            <Route path="/account/create" component={SignUp} />
          </Route>
        </Route>
      </Router>
    );
  }
};
