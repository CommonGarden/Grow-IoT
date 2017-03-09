import React, { Component } from 'react';
import ReactGridLayout from 'react-grid-layout';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import BottomNavigation from '../components/BottomNavigation.jsx';

export default class SignIn extends Component {
  handleSubmit(e) {
    e.preventDefault();
  }
  render() {
    const cardStyle = {
      padding: '20px',
    };
    return (
      <div className="layout vertical flex">
        <div className="layout horizontal center-justified flex center">
          <form className="loginForm" onSubmit={this.handleSubmit}>
            <Paper zDepth={1} style={cardStyle}>
              <div className="layout vertical">
                <h2> Sign In </h2>
                <TextField
                  hintText="Email"/>
                <TextField
                  type="password"
                  hintText="Password"/>
                <div className="layout horizontal">
                  <div className="flex" />
                  <RaisedButton label="Submit" primary={true} />
                </div>
              </div>
            </Paper>
          </form>
        </div>
        <div>
          <BottomNavigation />
        </div>
      </div>
    );
  }
}
