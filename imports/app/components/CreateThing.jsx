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
import Components from '../../things/';
import _ from 'underscore';

let components = []
_.each(Components, (value, key)=> {
  components.push({name:key});
});

export default class CreateThing extends Component {
  state = {
    open: false,
    newThingSnackOpen: false,
    uuid: '',
    token: '',
    thingName: '',
    components: components,
    value: 0,
  };

  // Modify to create a new thing.
  handleOpen = () => {
    this.setState({open: true});
    this.handleNewDevice();
  };

  handleNewDevice = () => {
    Meteor.call('Thing.generateAPIKeys', 
      (error, document) => {
        if (error) {
          throw error;
        } else {
          if (!this.state.open) {
            this.setState({newThingSnackOpen:true});
          }
          this.setState({
            'uuid': document.uuid,
            'token': document.token
          });
        }
      }
    );
  }

  handleCreate = () => {
    Meteor.call('Thing.new',
      {
        uuid: this.state.uuid,
        token: this.state.token
      },
      (error, document) => {
        if (error) {
          throw error;
        } else {
          this.setState({ open: false, newThingSnackOpen:true});

        }
      }
    );
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleCancel = () => {
    this.handleClose();
    Meteor.call('Thing.delete',
      this.state.uuid,
      (error, document) => {
        if (error) {
          throw error;
        }
      }
    );
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
          this.setState({ open: false, newThingSnackOpen:true});
        }
      );
    }
  };

  render() {
    const thingStyle = {
      minWidth: '350px'
    }

    const actions = [
      <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Create"
        primary={true}
        onTouchTap={this.handleCreate}
      />
    ];

    const componentItems = this.state.components.map((v, k) => {
      return <MenuItem value={k} primaryText={v.name} key={k} disabled={v.disabled}/>
    });

    return (
      <span>
        <IconMenu
          iconButtonElement={<IconButton className={this.props.highlight ? 'pulse' : ''}
            iconStyle={{color: 'white'}}><ContentAdd /></IconButton>}
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
          <div>
          <p>If you purchased a device enter its UUID and Token here, otherwise use these API credentials when you connect your device.</p>
          <TextField
            hintText="Name"
            // errorText="This field is required"
            defaultValue={this.state.uuid}
            floatingLabelText="Name"
            style={thingStyle}
          />
          <br/>
          <TextField
            ref="password"
            defaultValue={this.state.token}
            // onChange={this.passwordChange}
            hintText="Secret"
            style={thingStyle}
            // errorText="This field is required"
            // floatingLabelText={
            //   <em>Secret<Visible/></em>
            // }
          />
        </div>
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
