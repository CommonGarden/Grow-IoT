import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    width: 150,
  },
};

export default class CreateComponent extends Component {
  state = {
    open: false,
    value: 0,
    components: [
          "test-device",
          "test-thing",
          "dr-dose",
          "weather-widget",
          "smart-light",
          "smart-pot",
          "fish-tank",
    ]
  };

  handleOpen = () => {
    this.setState({open: true, value: 0});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = (event, index, value) => this.setState({value});

  handleSubmit = () => {
    const uuid = this.props.uuid;
    const token = this.props.token;
    const component = this.state.components[this.state.value];
    Meteor.call('Thing.register',
      { uuid, token },
      {
        component,
        onlineSince: true,
        properties: {
          state: "on"
        }
      },
      (error, document) => {
        if (error) {
          console.error("New deviceerror", error);
          return alert(`New deviceerror: ${error.reason || error}`);
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
    const componentItems = this.state.components.map((v, k) => {
      return <MenuItem value={k} primaryText={v} key={k}/>
    });
    return (
      <span>
        <FlatButton
          onTouchTap={this.handleOpen}
          label="Create Component"
        >
        </FlatButton>
        <Dialog
          title="Add New Thing"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
      <SelectField
        floatingLabelText="Component Type"
          value={this.state.value}
          onChange={this.handleChange}
        >
          {componentItems}
      </SelectField>
      </Dialog>
      </span>
    )
  }
}
