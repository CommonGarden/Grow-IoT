import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

export default class UnauthenticatedApp extends Component {
  render() {
    return (
      <div className="container layout vertical fit">
        <AppBar
          title="Grow-IoT"
          iconElementLeft={
            <img src="img/white_flower.png" style={{
              width: 25,
              height: 'auto',
              marginTop: 3
            }} />
          }
        />
        <div className="flex layout vertical">
          {this.props.children}
        </div>
      </div>
    );
  }
}
