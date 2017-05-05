import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import BottomNavigation from '../components/BottomNavigation.jsx';

export default class AccountsUI extends Component {
  handleSubmit(e) {
    e.preventDefault();
  }

  handleTabChange(i) {
    const paths = { 0: '', 1: 'create' };
    browserHistory.push(`/account/${paths[i]}`);
  }

  render() {
    const cardStyle = {
      padding: '20px',
    };
    return (
      <div className="layout vertical flex">
        <div className="layout horizontal center-justified flex center">
          {this.props.children}
        </div>
        <div>
          <BottomNavigation onTabChange={this.handleTabChange} />
        </div>
      </div>
    );
  }
}
