import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import BottomNavigation from '../components/BottomNavigation.jsx';

const noError = {
  message: '',
};
export default class SignIn extends Component {
  state = {
    password: '',
    email: '',
    rPassword: '',
    rpError: '',
    emailError: '',
    error: noError,
    sbOpen: false,
  };

  handleSubmit = (e)  => {
    e.preventDefault();
    if(!this.validateEmail(this.state.email)) {
      this.openSnackbar('Invalid Email');
    } else if(this.state.password !== this.state.rPassword) {
      this.openSnackbar('Passwords do not match');
    } else {
      let self = this;
      Accounts.createUser({
        email: this.state.email,
        password: this.state.password
      },function(e){
        self.signUpCallback(e);
      });
    }
  };
  handleSnackbarClose = (e) => {
    this.setState({ error: noError, sbOpen: false });
  };
  signUpCallback = (error) => {
    if (error === undefined) {
      this.handleSnackbarClose();
      // Navigate to the authenticated app since the sign in was successful
      this.props.history.push(`/`);
    } else {
      this.openSnackbar(error.message);
    }
  };
  openSnackbar(message) {
      this.setState({ error: { message }, sbOpen: true });
  }
  componentWillMount() {
    document.title = "Sign Up";
  }

  emailChange = (e, n) => {
    this.setState({ email: n });
    const emailError = this.validateEmail(n) ? '' : 'Invalid email address';
    this.setState({ emailError })
  };
  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  passwordChange = (e, n) => {
    this.setState({ password: n });
  };
  rPasswordChange = (e, n) => {
    const rpError = n !== this.state.password ? 'Passwords do not match' : '';
    this.setState({ rpError, rPassword: n })
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
              <h2> Sign Up </h2>
              <TextField
                onChange={this.emailChange}
                errorText={this.state.emailError}
                hintText="Email"/>
              <TextField
                type="password"
                onChange={this.passwordChange}
                hintText="Password"/>
              <TextField
                type="password"
                onChange={this.rPasswordChange}
                errorText={this.state.rpError}
                hintText="Repeat Password"/>
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
