import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ComponentIcon from 'material-ui/svg-icons/av/web';
import DevicesIcon from 'material-ui/svg-icons/hardware/router'
import EnvironmentIcon from 'material-ui/svg-icons/image/nature-people';
import OrganismIcon from 'material-ui/svg-icons/image/filter-vintage';
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

let components = [];
_.each(Components, (value, key)=> {
  components.push({name:key});
});

export default class CreateThing extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    open_device: false,
    open_environment: false,
    open_organism: false,
    open_component: false,
    newThingSnackOpen: false,
    uuid: '',
    token: '',
    thingName: '',
    components: components,
    value: 0,
  };

  generateAPIKeys = () => {
    console.log('Creating API keys');
    return Meteor.call('Thing.generateAPIKeys',
      (error, document) => {
        if (error) {
          throw error;
        } else {
          this.setState({
            'uuid': document.uuid,
            'token': document.token
          });
          return document;
        }
      }
    );
  }

  handleNewEnvironment = () => {
    this.setState({open_environment: true});
  }

  handleNewOrganism = () => {
    this.setState({open_organism: true});
  }

  handleNewComponent = () => {
    this.setState({open_component: true});
    this.generateAPIKeys();
  }

  handleNewDevice = () => {
    this.setState({open_device: true});
    this.generateAPIKeys();
  }

  handleCreate = () => {
    Meteor.call('Thing.new',
      null,
      {
        uuid: this.state.uuid,
        token: this.state.token
      },
      (error, document) => {
        if (error) {
          throw error;
        } else {
          this.setState({ open_device: false, newThingSnackOpen:true});
        }
      }
    );
  }

  handleClose = () => {
    this.setState({open_device: false});
  };

  handleCloseEnvironment = () => {
    this.setState({open_environment: false});
  }

  handleCloseOrgansim = () => {
    this.setState({open_organism: false});
  }

  handleCloseComponent = () => {
    this.setState({open_component: false});
  }

  handleCancel = () => {
    this.handleClose();
    this.handleCloseComponent();
    this.handleCloseOrgansim();
    this.handleCloseEnvironment();
    Meteor.call('Thing.delete',
      this.state.uuid,
      (error, document) => {
        if (error) {
          throw error;
        }
      }
    );
  }

  nameChange = (e, newValue) => {
    this.setState({uuid: newValue})
  }

  tokenChange = (e, newValue) => {
    this.setState({token: newValue});
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
    console.log(this.state);

    const uuid = this.state.uuid;
    const token = this.state.token;
     Meteor.call('Thing.new',
      null,
      {
        uuid: this.state.uuid,
        token: this.state.token
      },
      (error, document) => {
        if (error) {
          throw error;
        }
      }
     );

    const component = this.state.components[this.state.value];
    if (component) {
      Meteor.call('Thing.register',
        { uuid: this.state.uuid, token: this.state.token },
        {
          component: component.name,
          onlineSince: true,
        },
        (error, document) => {
          if (error) {
            console.error("New deviceerror", error);
            return alert(`New deviceerror: ${error.reason || error}`);
          }
          this.setState({ open_component: false, newThingSnackOpen:true});
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
          iconButtonElement={<IconButton className={this.props.highlight ? 'pulse' : ''} iconStyle={{color: 'white'}}><ContentAdd /></IconButton>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <Subheader>Create new:</Subheader>
          <MenuItem primaryText="Device" leftIcon={<DevicesIcon />} onTouchTap={this.handleNewDevice} />
          {
          // <MenuItem primaryText="Environment" leftIcon={<EnvironmentIcon />} onTouchTap={this.handleNewEnvironment} />
          // <MenuItem primaryText="Organism" leftIcon={<OrganismIcon />} onTouchTap={this.handleNewOrganism} />
          }
          <MenuItem primaryText="Component" leftIcon={<ComponentIcon />} onTouchTap={this.handleNewComponent} />
        </IconMenu>

        <Dialog
          title="New device"
          actions={actions}
          modal={true}
          open={this.state.open_device}
          onRequestClose={this.handleClose}
        >
          <div>
          <p>If you purchased a device enter its credentials here:</p>
          <TextField
            hintText="uuid"
            onChange={this.nameChange}
            defaultValue={this.state.uuid}
            floatingLabelText="uuid"
            style={thingStyle}
          />
          <br/>
          <TextField
            ref="password"
            defaultValue={this.state.token}
            onChange={this.tokenChange}
            hintText="token"
            floatingLabelText="token"
            style={thingStyle}
          />
        </div>
        </Dialog>

        <Dialog
          title="New environment"
          actions={
            [
              <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCancel}
              />,
              <FlatButton
                label="Create"
                primary={true}
                onTouchTap={this.handleSubmit}
              />
            ]
          }
          modal={true}
          open={this.state.open_environment}
          onRequestClose={this.handleCloseEnvironment}
        >
          <div>
          <TextField
            hintText="Name"
            onChange={this.nameFieldChange}
            defaultValue={this.state.thingName}
            floatingLabelText="Name"
            style={thingStyle}
          />
          </div>
        </Dialog>

        <Dialog
          title="New organsim"
          actions={actions}
          modal={true}
          open={this.state.open_organism}
          onRequestClose={this.handleCloseOrgansim}
        >
          <div>
          <TextField
            hintText="Name"
            onChange={this.nameFieldChange}
            defaultValue={this.state.thingName}
            floatingLabelText="Name"
            style={thingStyle}
          />
          </div>
        </Dialog>

        <Dialog
          title="New component"
          actions={
            [
              <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCancel}
              />,
              <FlatButton
                label="Create"
                primary={true}
                onTouchTap={this.handleSubmit}
              />
            ]
          }
          modal={true}
          open={this.state.open_component}
          onRequestClose={this.handleCloseComponent}
        >
          <div>
           <SelectField
            floatingLabelText="Component Type"
            value={this.state.value}
            onChange={this.handleChange}
          >
             {componentItems}
          </SelectField>
          </div>
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
