import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import { Meteor } from 'meteor/meteor';

import AccountsUI from './pages/AccountsUI.jsx';

const title = Meteor.settings.public.title || "Grow-IoT";
const logo = Meteor.settings.public.logo || "/img/white_flower.png";
const primary_color = Meteor.settings.public.primary_color || null;

export default class UnauthenticatedApp extends Component {
  render() {
    const rootUrl = this.props.match.url;
    return (
      <div className="layout vertical fit">
        <AppBar
          title={title}
          iconElementLeft={
            <img src={logo} style={{
              width: 25,
              height: 'auto',
              marginTop: 3
            }} />
          }
          style={{
            backgroundColor: primary_color
          }}
        />
        <div className="flex layout vertical">
          <Switch>
            <Redirect exact from={`${rootUrl}/`} to={`${rootUrl}/account`}/>
            <Route path={`${rootUrl}/account`} component={AccountsUI} />
          </Switch>
        </div>
      </div>
    );
  }
}
