import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="container layout vertical fit">
          <AppBar
            title="Grow-IoT"
            iconStyleLeft={{
              display: 'none'
            }}
          />
          <div className="flex layout vertical">
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
