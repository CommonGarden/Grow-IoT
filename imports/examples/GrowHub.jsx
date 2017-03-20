import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// Not working currently... both ways should be valid for making components.
export default class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    open: false,
    temp: '50deg',
    ph: '6.4',
    humidity: '60%',
    ec: '100 mS/m',
  };

  handleOpen = () => {
    this.setState({open: true, thingName: ''});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = () => {
    const self = this;
    const name = this.state.thingName;
    Meteor.call('Thing.new', { name }, 
      (error, document) => {
        if (error) {
          throw error;
        } else {
          this.handleClose();
        }
      }
    );
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <p>Room Temperature: <strong>{this.state.temp}</strong></p>

        <p>Room Humidity: <strong>{this.state.humidity}</strong></p>

        <p>Water ph: <strong>{this.state.ph}</strong></p>

        <p>Water conductivity: <strong>{this.state.ec}</strong></p>

        <IconButton
          onTouchTap={this.handleOpen}
          tooltip="Create Thing"
          tooltipPosition="bottom-left"
          iconStyle={{color: 'white'}}
        >
          <ContentAdd />
        </IconButton> 
        <Dialog
          title="Add New Thing"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="Name of the Thing"
            defaultValue={this.state.thingName}
            onChange={this.nameFieldChange}
          />
        </Dialog>
      </div>
    )
  }
}
