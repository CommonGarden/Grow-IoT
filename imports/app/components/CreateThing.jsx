import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ComponentIcon from 'material-ui/svg-icons/av/web';
import DevicesIcon from 'material-ui/svg-icons/hardware/router'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';


export default class CreateThing extends Component {
  state = {
    open: false,
    newThingSnackOpen: false,
    uuid: '',
    token: '',
    thingName: '',
    components: [
      {
        name: 'test-device',
      },
      {
        name: 'smart-light',
      },
      {
        name: 'grow-hub',
      },
    ],
    value: 0,
  };

  // Modify to create a new thing.
  handleOpen = () => {
    this.setState({open: true});
    this.handleNewDevice();
  };

  handleNewDevice = () => {
    const self = this;
    Meteor.call('Thing.new', 
      (error, document) => {
        if (error) {
          throw error;
        } else {
          if (!self.state.open) {
            self.setState({newThingSnackOpen:true});
          }
          self.setState({
            'uuid': document.uuid,
            'token': document.token
          });
          self.props.afterCreate();
        }
      }
    );
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleCancel = () => {
    this.handleClose();
    // Meteor.call('Thing.delete',
      // this.state.uuid,
      // (error, document) => {
        // if (error) {
          // throw error;
        // }
      // }
    // );
  }

  nameFieldChange = (e, newValue) => {
    this.setState({ thingName: newValue });
  };

  handleRequestClose = () => {
    this.setState({
      newThingSnackOpen: false,
    });
  };

  handleChange = (event, index, value) => this.setState({value});

  handleSubmit = () => {
    const uuid = this.state.uuid;
    const token = this.state.token;
    const component = this.state.components[this.state.value];
    const self = this;
    if (component) {
      Meteor.call('Thing.register',
        { uuid, token },
        {
          component: component.name,
          onlineSince: true,
          properties: {
            state: 'off'
          }
        },
        (error, document) => {
          if (error) {
            console.error("New deviceerror", error);
            return alert(`New deviceerror: ${error.reason || error}`);
          }
          self.setState({open: false, newThingSnackOpen:true});
          self.props.afterCreate();
        }
      );
    }
  };

  render() {
    const actions = [
      <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Create component"
        primary={true}
        onTouchTap={this.handleSubmit}
      />
    ];

    const componentItems = this.state.components.map((v, k) => {
      return <MenuItem value={k} primaryText={v.name} key={k} disabled={v.disabled}/>
    });

    return (
      <span>
        <IconMenu
          iconButtonElement={<IconButton iconStyle={{color: 'white'}}><ContentAdd /></IconButton>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <Subheader>Create new:</Subheader>
          <MenuItem primaryText="Device" leftIcon={<DevicesIcon />} onTouchTap={this.handleNewDevice} />
          <MenuItem primaryText="Component" leftIcon={<ComponentIcon />} onTouchTap={this.handleOpen} />
        </IconMenu>
        <Dialog
          title="Create new component"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="Name of the thing (optional)"
            defaultValue={this.state.thingName}
            onChange={this.nameFieldChange}
          />
          <br/>
          <SelectField
            floatingLabelText="Component Type"
            value={this.state.value}
            onChange={this.handleChange}
          >
            {componentItems}
          </SelectField>
        </Dialog>
        <Snackbar
          open={this.state.newThingSnackOpen}
          message="Thing created"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </span>
    )
  }
}
