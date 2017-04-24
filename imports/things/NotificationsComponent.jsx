import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// This component is for testing notifications.
class NotificationsComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleValueChange = (event, newValue) => {
    this.setState({value: newValue});
  }

  state = {
    value: ''
  }

  newNotification = (event) => {
    let notification = event.currentTarget.dataset.value;
    Meteor.call('Notifications.new',
      notification,
      (error, documentId) => {
        if (error) {
          console.error("Error", error);
          return alert(`Error: ${error.reason || error}`);
        }
        this.setState({ value: '' });
      }
    );
  }

  render() {
    return (
      <div>
        <TextField
          hintText="New notification"
          floatingLabelText="New notification"
          value={this.state.value}
          onChange={this.handleValueChange}
        />
        <RaisedButton label="Send" primary={true} data-value={this.state.value} onTouchTap={this.newNotification} />
      </div>
    );
  }
}

export default NotificationsComponent;
