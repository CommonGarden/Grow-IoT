import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

// Work in progress.
// This BaseThing class will perhapse eventually implement common things
// Like setProperty, sendCommand, deleting a thing, etc.
export default class BaseThing extends Component {
  constructor(props) {
    super(props);
  }

  onlineSince () {
    const onlineSince = this.props.thing.onlineSince || false;

    if (!this.props.thing.onlineSince) {
      return <span>Offline</span>
    } else {
      return <span></span>
    }
  }

  sendCommand = (command, options) => {
    Meteor.call('Thing.sendCommand',
      this.props.thing.uuid,
      command,
      options,
      (error, documentId) => {
        if (error) {
          console.error("Error", error);
          return alert(`Error: ${error.reason || error}`);
        }
      }
    );
  }

  setProperty = (key, value) => {
    let command = 'setProperty';
    let options = {
      key: key,
      value: value
    };
    this.sendCommand(command, options);
  }
}



