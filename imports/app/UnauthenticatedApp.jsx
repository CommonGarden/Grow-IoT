import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';

import AccountsUI from './pages/AccountsUI.jsx';

export default class UnauthenticatedApp extends Component {
  render() {
    const rootUrl = this.props.match.url;
    return (
      <div className="layout vertical fit">
        <AppBar
          title="Grow-IoT"
          iconElementLeft={
            <img src="/img/white_flower.png" style={{
              width: 25,
              height: 'auto',
              marginTop: 3
            }} />
          }
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
