import BaseThing from '../BaseThing/BaseThing';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ChartIcon from 'material-ui/svg-icons/editor/show-chart';
import Subheader from 'material-ui/Subheader';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import { Row, Col } from 'react-flexbox-grid';
import styles from './styles.js';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import './styles.css';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';
import LeftChevron from 'material-ui/svg-icons/navigation/chevron-left';

let GRAFANA_URL = Meteor.settings.public.GRAFANA_URL ? Meteor.settings.public.GRAFANA_URL: 'https://data.commongarden.org'

class DeviceSettings extends BaseThing {
  constructor(props) {
    super(props);
  }

  state = {
    settingsDialogOpen: false,
    expanded: false,
  }

  back = () => {
    this.props.history.goBack();
  }

  handleAutomationStartStop = (event) => {
    let enabled = event.currentTarget.dataset.enabled;
    this.setProperty('automation_enabled', !enabled);
  }

  handleNameChange = (event, newValue) => {
    if (!Things.update(this.props.thing._id, {
      $set: {name: newValue}
    })) { throw new Meteor.Error('internal-error', 'Internal error.'); }
  }

  handleTap = (event) => {
    let device = event.currentTarget.dataset.device;
    let command = this.props.thing.properties[`${device}`] === 'on' ? `${device}_off` : `${device}_on`;
    this.sendCommand(command);
  }

  onlineSince () {
    if (!this.props.thing.onlineSince) {
      return <div className='offline'><WarningIcon className='offline-warning-icon' />No Server Connection</div>
    } else {
      return null
    }
  }

  render() {
    if (this.props.ready) {
      const thing = this.props.thing;
      const properties = thing.properties;
      const alerts = thing.properties.alerts || {};
      const types = thing.properties.types;
      const growfile = thing.properties.growfile;

      return (
        <Card>
          <AppBar
            title={thing.name}
            titleStyle={{
              textAlign: 'center',
              fontSize: 16,
              color: 'black'
            }}
            style={{
              color: 'black',
              backgroundColor: 'transparent',
              boxShadow: 'none'
            }}
            iconElementLeft={
              <IconButton
                onTouchTap={this.back}
                           style={{
                             height: 30,
                             width: 'auto',
                             position: 'absolute',
                             left: 10,
                             zIndex: 10
                           }}
                           iconStyle={{
                             color: 'black',
                             fill: 'black'
                           }}>
                <LeftChevron />
              </IconButton>
            }
          />
          {this.onlineSince()}
          <CardText>
            <h2>Settings</h2>
            <TextField
              hintText="Device name"
              floatingLabelText="Device name"
              data-key="name"
              defaultValue={thing.name ? thing.name: "Grow Controller"}
              onChange={this.handleNameChange}
            />
            <br/>
            <TextField
              hintText="Log data every (milliseconds)"
              floatingLabelText="Log data every (milliseconds)"
              data-key="interval"
              defaultValue={thing.properties.interval}
              onChange={this.handleScheduleChange}
            />
            <br/>
            <TextField
              hintText="Insert valid Growfile JSON"
              errorText="This field is required."
              floatingLabelText="Growfile"
              id="Growfile"
              ref="Growfile"
              defaultValue={JSON.stringify(thing.properties.growfile, null, 2)}
              onChange = {this.handleGrowfileChange}
              multiLine={true}
              style={styles.oneHundred}
              rows={10}
            />
            <RaisedButton label="Update Growfile" primary={true} onTouchTap={this.updateGrowfile}/>
            {
              properties.automation_enabled ? <Col xs={12} md={6}>
                <div style={{padding:40}}>
                  <Toggle
                    label="Automation"
                    toggled={properties.automation_enabled}
                    data-enabled={properties.automation_enabled}
                    onTouchTap={this.handleAutomationStartStop}
                  />
                </div>
              </Col>: null
            }
            <h3>Device credentials</h3>
            <p>These credentials are unique to your device. Keep them secret.</p>
            <p>UUID: {thing.uuid}</p>
            <p>TOKEN: {thing.token}</p>
            <h3>Reboot</h3>
            <p>Rebooting the device will result in the device temporarilly going offline.</p>
            <RaisedButton label="Reboot device" primary={true} onTouchTap={this.reboot}/>
            <br/>
            {/* <h2>Delete</h2>
                <p>WARNING, this will delete your device and all it's event history!</p>
                {this.props.actions} */}
          </CardText>
        </Card>
      )
    } else {
      return <CircularProgress />
    }

  }
}

export default DeviceSettingsContainer = createContainer(({ user, match }) => {
  let thingHandle = Meteor.subscribe('Things.one', match.params.uuid);
  let thing = Things.findOne({ uuid: match.params.uuid });
  let ready = [ thingHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  return {
    thing,
    ready
  };
}, DeviceSettings);
