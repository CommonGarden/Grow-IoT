import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import BottomNavigation from '../components/BottomNavigation.jsx';

export default class SignIn extends Component {
  state = {
    password: '',
    email: '',
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    Meteor.loginWithPassword({ email }, password, this.signInCallback);
  };
  signInCallback(error) {
    if (error === undefined) {
      // Navigate to the authenticated app since the sign in was successful
      browserHistory.push(`/app`);
    }
  }
  componentWillMount() {
    document.title = "Sign In";
  }
  emailChange = (e, n) => {
    this.setState({ email: n });
  };
  passwordChange = (e, n) => {
    this.setState({ password: n });
  }
  render() {
    const cardStyle = {
      padding: '20px',
    };
    return (
      <form className="loginForm" onSubmit={this.handleSubmit}>
        <Paper zDepth={1} style={cardStyle}>
          <div className="layout vertical">
            <h2> Sign In </h2>
            <TextField
              ref="email"
              onChange={this.emailChange}
              hintText="Email"/>
            <TextField
              ref="password"
              type="password"
              onChange={this.passwordChange}
              hintText="Password"/>
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
