import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation.jsx';

import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx'

export default class AccountsUI extends Component {
  handleSubmit(e) {
    e.preventDefault();
  }

  handleTabChange(i) {
    const paths = { 0: 'signin', 1: 'signup' };
    this.props.history.push(`/public/account/${paths[i]}`);
  }

  render() {
    const cardStyle = {
      padding: '20px',
    };
    const rootUrl = this.props.match.url;
    return (
      <div className="layout vertical flex">
        <div className="layout horizontal center-justified flex center">
          <Switch>
            <Redirect exact from={`${rootUrl}/`} to={`${rootUrl}/signin`}/>
            <Route path={`${rootUrl}/signin`} component={SignIn} />
            <Route path={`${rootUrl}/signup`} component={SignUp} />
          </Switch>
        </div>
        <div>
          <BottomNavigation onTabChange={this.handleTabChange} />
        </div>
      </div>
    );
  }
}
