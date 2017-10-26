import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import BottomNavigation from '../components/BottomNavigation.jsx';

const noError = {
  message: '',
};

export default class SignIn extends Component {
  state = {
    password: '',
    email: '',
    error: noError,
    sbOpen: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    Meteor.loginWithPassword({ email }, password, this.signInCallback);
  };
  handleSnackbarClose = (e) => {
    this.setState({ error: noError, sbOpen: false });
  };
  signInCallback = (error) => {
    if (error === undefined) {
      this.setState({ error: noError, sbOpen: false });
      // Navigate to the authenticated app since the sign in was successful
      this.props.history.push(`/`);
    } else {
      this.setState({ error, sbOpen: true });
    }
  };
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
      <div>
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
        <Snackbar
          open={this.state.sbOpen}
          message={this.state.error.message}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose}
        />
      </div>
    );
  }
}
