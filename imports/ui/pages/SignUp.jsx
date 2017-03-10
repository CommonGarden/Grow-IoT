import React, { Component } from 'react';
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
      <form className="loginForm" onSubmit={this.handleSubmit}>
        <Paper zDepth={1} style={cardStyle}>
          <div className="layout vertical">
            <h2> Sign Up </h2>
            <TextField
              hintText="Email"/>
            <TextField
              type="password"
              hintText="Password"/>
            <TextField
              type="password"
              hintText="Repeat Password"/>
            <div className="layout horizontal">
              <div className="flex" />
              <RaisedButton label="Submit" primary={true} type="submit"/>
            </div>
          </div>
        </Paper>
      </form>
    );
  }
}
