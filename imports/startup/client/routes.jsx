import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'
import App from '../../ui/App.jsx';
import AuthenticatedApp from '../../ui/AuthenticatedApp.jsx';
import SignIn from '../../ui/pages/SignIn.jsx';

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="signin" component={SignIn}/>
        </Route>
        <Route path="/app" component={AuthenticatedApp}>
        </Route>
      </Router>
    );
  }
};
