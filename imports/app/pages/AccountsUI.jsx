import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
// import BottomNavigation from '../components/BottomNavigation.jsx';

import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';

export default class AccountsUI extends Component {
  handleSubmit(e) {
    e.preventDefault();
  }

  handleTabChange = (i) => {
    const paths = { 0: 'signin', 1: 'signup' };
    this.props.history.push(`/public/account/${paths[i]}`);
  }

  render() {
    const rootUrl = this.props.match.url;
    return (
      <div className="layout vertical center-justified flex">
        <div className="card">
          <Switch>
            <Redirect exact from={`${rootUrl}/`} to={`${rootUrl}/signin`} />
            <Route path={`${rootUrl}/signin`} component={SignIn} />
            <Route path={`${rootUrl}/signup`} component={SignUp} />
          </Switch>
        </div>
        <div>
          {
            // <BottomNavigation onTabChange={this.handleTabChange} />
          }
        </div>
      </div>
    );
  }
}
