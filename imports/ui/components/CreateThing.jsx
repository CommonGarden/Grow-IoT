import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class CreateThing extends Component {
  state = {
    open: false,
    thingName: ''
  };
  handleOpen = () => {
    this.setState({open: true, thingName: ''});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  nameFieldChange = (e, newValue) => {
    this.setState({ thingName: newValue });
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
      <span>
        <IconButton
          onTouchTap={this.handleOpen}
          tooltip="Create Thing"
          tooltipPosition="bottom-left"
          iconStyle={{color: 'white'}}>
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
    </span>
    )
  }
}
