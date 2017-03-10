import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import App from '../../ui/App.jsx';
import AuthenticatedApp from '../../ui/AuthenticatedApp.jsx';
import AccountsUI from '../../ui/pages/AccountsUI.jsx';
import SignIn from '../../ui/pages/SignIn.jsx';
import SignUp from '../../ui/pages/SignUp.jsx'

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="/account" component={AccountsUI}>
            <IndexRoute component={SignIn} />
            <Route path="/account/create" component={SignUp} />
          </Route>
        </Route>
        <Route path="/app" component={AuthenticatedApp}>
        </Route>
      </Router>
    );
  }
};
