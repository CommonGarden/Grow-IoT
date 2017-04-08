import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import _ from 'underscore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import EnergyIcon from 'material-ui/svg-icons/image/flash-on';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import ImageOne from '../app/components/images/ImageOne';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = (event) => {
    let device = event.currentTarget.dataset.device;
    const command = this.props.thing.properties[`${device}_state`] === 'on' ? `turn_${device}_off` : `turn_${device}_on`;
    this.sendCommand(command);
  };

  handleOpen = (event) => {
    let dialog = event.currentTarget.dataset.dialog;
    switch (dialog) {
      case 'dltOpen':
        this.setState({ dltOpen: true });
        break;
      case 'settingsDialogOpen':
        this.setState({settingsDialogOpen: true});
        break;
    }
  };

  handleClose = (event) => {
    let dialog = event.currentTarget.dataset.dialog;
    switch (dialog) {
      case 'dltOpen':
        this.setState({ dltOpen: false });
        break;
      case 'settingsDialogOpen':
        this.setState({settingsDialogOpen: false});
        break;
    }
  };

  handleValueChange = (event, newValue) => {
    const uuid = this.props.thing.uuid;
    const key = event.target.dataset.key;
    this.setProperty(key, newValue);
  };

  handleScheduleChange = (event, newValue) => {
    this.sendCommand('stop');
    let key = event.target.dataset.key;
    let cycles = this.props.thing.properties.cycles;

    if (key === 'day') {
      key = 'cycles';
      cycles['day'].start = newValue;
      this.setProperty(key, cycles);

    } else if (key === 'night') {
      key = 'cycles';
      cycles['night'].start = newValue;
      this.setProperty(key, cycles);

    } else {
      this.setProperty(key, newValue);
    }
    this.sendCommand('start');
  }

  state = {
    dltOpen: false,
    settingsDialogOpen: false,
    types: [
      {
        type: 'temp',
        title: 'Room Temparature',
        icon: 'wi wi-thermometer'
      },
      {
        type: 'humidity',
        title: 'Room Humidity',
        icon: 'wi wi-humidity'
      },
      {
        type: 'ph',
        title: 'Water PH',
        icon: 'wi wi-raindrop'
      },
      {
        type: 'ec',
        title: 'Water Conductivity',
        icon: 'wi wi-barometer'
      },
      {
        type: 'temp',
        title: 'Resevoir temperature',
        icon: 'wi wi-thermometer'
      },
      {
        type: 'lux',
        title: 'Lux',
        icon: 'wi wi-day-sunny'
      },
    ]
  };

  sendCommand (method, duration) {
    Meteor.call('Thing.sendCommand',
      this.props.thing.uuid,
      method,
      duration,
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

  getEventValue(type) {
    const e = this.props[`${type}Event`];
    return e ? e.event.value.toFixed(1) : 'NA';
  }

  render() {
    const lightPower = this.props.lightPowerEvent ? this.props.lightPowerEvent.event.value: {current:0, voltage: 0, power: 0, total: 0};
    const fanPower = this.props.fanPowerEvent ? this.props.fanPowerEvent.event.value: {current:0, voltage: 0, power: 0, total: 0};
    const pumpPower = this.props.pumpPowerEvent ? this.props.pumpPowerEvent.event.value: {current:0, voltage: 0, power: 0, total: 0};

    const styles = {
      left: {
        // float: 'left'
      },
      right: {
        float: 'right'
      },
      options: {
        marginLeft: 100,
        position: 'relative',
        bottom: 100,
      },
      actuator: {
        padding: 10,
        marginBottom: -50,
      },
      actionButton: {
        marginRight: 20,
        marginleft: 20
      },
      main: {
        marginTop: -25
      },
      sensorData: {
        paddingLeft: 10,
        paddingRight: 10,
      },
      powerData: {
        position: 'relative',
        marginBottom: -58,
        fontSize: 10,
        padding: 10,
        top: 9,
      },
      sensorIcon: {
        marginRight: 5
      },
      energyIcon: {
        height: 14,
        width: 14,
        position: 'relative',
        left: 2
      },
      powerStats: {
        marginLeft: -22,
        fontSize: 13
      },
      image: {
        maxWidth: 400,
        position: 'relative',
        marginLeft: 300,
        marginTop: -300,
        top: 7,
        left: 16,
        marginBottom: 14,
      }
    }

    return (
      <div style={styles.main}>
        <div>
          <h2>Grow Hub
            <CameraIcon style={{marginLeft: 12}}/>
            <IconButton
              tooltip="Options"
              tooltipPosition="top-center"
              onTouchTap={this.handleOpen}
              data-dialog="settingsDialogOpen">
              <SettingsIcon />
            </IconButton>
          </h2>
        </div>
        
        <div style={styles.sensorData}>
          {
            this.state.types.map((v, k) => {
              return <h3 key={k}><i className={v.icon} style={styles.sensorIcon}></i> {v.title}: <strong>{this.getEventValue(v.type)}</strong> </h3>
            })
          }
        </div>

        <div style={styles.image}>
          <ImageOne />
        </div>

        <Divider />

        <div style={styles.actuator}>
          <div style={styles.actionButton}>
            <h3>Light</h3>
            <FloatingActionButton secondary={this.props.thing.properties.light_state === 'on' ? true: false}
                                  backgroundColor="rgb(208, 208, 208)"
                                  data-device="light"
                                  onTouchTap={this.handleTap}>
              <PowerIcon />
            </FloatingActionButton>
            <br/>
            <div style={styles.powerData}>
              <span style={styles.powerStats}><EnergyIcon style={styles.energyIcon} /> Power stats:</span><br/>
              Current: {lightPower.current.toFixed(2)}<br/>
              Voltage: {lightPower.voltage.toFixed(2)}<br/>
              Power: {lightPower.power.toFixed(2)}<br/>
              Total: {lightPower.total.toFixed(2)}<br/>
            </div>
          </div>
          <div style={styles.options}>
            <TextField
              hintText="Day start"
              floatingLabelText="Day start"
              data-key="day"
              defaultValue="after 7:00am"
              onChange={this.handleScheduleChange}
            />
            <br/>

            <TextField
              hintText="Night start"
              floatingLabelText="Night start"
              data-key="night"
              defaultValue="after 7:00pm"
              onChange={this.handleScheduleChange}
            />
          </div>
        </div>

        <div style={styles.actuator}>
          <div style={styles.actionButton}>
            <h3>Fan</h3>
            <FloatingActionButton secondary={this.props.thing.properties.fan_state === 'on' ? true: false}
                                  backgroundColor="rgb(208, 208, 208)"
                                  data-device="fan"
                                  onTouchTap={this.handleTap}>
              <PowerIcon />
            </FloatingActionButton>
            <br/>
            <div style={styles.powerData}>
              <span style={styles.powerStats}><EnergyIcon style={styles.energyIcon} /> Power stats:</span><br/>
              Current: {fanPower.current.toFixed(2)}<br/>
              Voltage: {fanPower.voltage.toFixed(2)}<br/>
              Power: {fanPower.power.toFixed(2)}<br/>
              Total: {fanPower.total.toFixed(2)}<br/>
            </div>
            <div style={styles.options}>
            <TextField
              hintText="Target day temperature"
              data-key="day_temp"
              floatingLabelText="Target day temperature"
              defaultValue="21"
              onChange={this.handleValueChange}
            />
            <br/>

            <TextField
              hintText="Target night temperature"
              floatingLabelText="Target night temperature"
              data-key="night_temp"
              defaultValue="18"
              onChange={this.handleScheduleChange}
            />
            <br/>
            </div>
          </div>
        </div>

        <div style={styles.actuator}>
          <div style={styles.actionButton}>
            <h3>Watering pump</h3>
            <FloatingActionButton secondary={this.props.thing.properties.pump_state === 'on' ? true: false}
                                  backgroundColor="rgb(208, 208, 208)"
                                  data-device="pump"
                                  onTouchTap={this.handleTap}
                                  style={styles.left}>
              <PowerIcon />
            </FloatingActionButton>
            <br/>
            <div style={styles.powerData}>
              <span style={styles.powerStats}><EnergyIcon style={styles.energyIcon} /> Power stats:</span><br/>
              Current: {pumpPower.current.toFixed(2)}<br/>
              Voltage: {pumpPower.voltage.toFixed(2)}<br/>
              Power: {pumpPower.power.toFixed(2)}<br/>
              Total: {pumpPower.total.toFixed(2)}<br/>
            </div>
          </div>
          <div style={styles.options}>
            <TextField
              hintText="Schedule"
              data-key="water_schedule"
              floatingLabelText="Schedule"
              defaultValue="every 2 hours"
              onChange={this.handleValueChange}
            />
            <br/>
            <TextField
              hintText="Duration"
              floatingLabelText="Duration (milliseconds)"
              data-key="water_duration"
              defaultValue="20000"
              onChange={this.handleScheduleChange}
            />
          </div>
        </div>

        <Dialog
          title="Settings"
          actions={<FlatButton
            label="Close"
            primary={true}
            data-dialog="settingsDialogOpen"
            onTouchTap={this.handleClose}
          />}
          modal={false}
          open={this.state.settingsDialogOpen}
          onRequestClose={this.handleClose}>
          <TextField
            hintText="Log data every (milliseconds)"
            floatingLabelText="Log data every (milliseconds)"
            data-key="interval"
            defaultValue="2000"
            onChange={this.handleScheduleChange}
          />
          <br/>
          <p>UUID: {this.props.thing.uuid}</p>
          <p>Token: {this.props.thing.token}</p>
        </Dialog>
        <br/>
      </div>
    )
  }
}

// Hack, let's make this a little more elegant...

GrowHub.propTypes = {
  ecEvent: React.PropTypes.object,
  phEvent: React.PropTypes.object,
  tempEvent: React.PropTypes.object,
  waterTempEvent: React.PropTypes.object,
  humidityEvent: React.PropTypes.object,
  luxEvent: React.PropTypes.object,
  pumpPowerEvent: React.PropTypes.object,
  fanPowerEvent: React.PropTypes.object,
  lightPowerEvent: React.PropTypes.object,
  ready: React.PropTypes.bool,
  events: React.PropTypes.array,
  alerts: React.PropTypes.array,
}

export default GrowHubContainer = createContainer(({ thing }) => {
  // _.mapObject(thing, (value, key) => {
  //   console.log(key);
  //   console.log(value);
  // })

  // TODO: clean this up.
  const phHandle = Meteor.subscribe('Thing.events', thing.uuid, 'ph', 1);
  const tempHandle = Meteor.subscribe('Thing.events', thing.uuid, 'temperature', 1);
  const waterTempHandle = Meteor.subscribe('Thing.events', thing.uuid, 'water_temperature', 1);
  const ecHandle = Meteor.subscribe('Thing.events', thing.uuid, 'ec', 1);
  const humidityHandle = Meteor.subscribe('Thing.events', thing.uuid, 'humidity', 1);
  const luxHandle = Meteor.subscribe('Thing.events', thing.uuid, 'lux', 1);
  const fanPowerHandle = Meteor.subscribe('Thing.events', thing.uuid, 'fan_power', 1);
  const lightPowerHandle = Meteor.subscribe('Thing.events', thing.uuid, 'light_power', 1);
  const pumpPowerHandle = Meteor.subscribe('Thing.events', thing.uuid, 'pump_power', 1);
  const eventsHandle = Meteor.subscribe('Thing.events', thing.uuid);
  const alertsHandle = Meteor.subscribe('Thing.events', thing.uuid, 'alert', 10);
  
  const ready = [ phHandle,
                    tempHandle,
                    ecHandle,
                    humidityHandle,
                    waterTempHandle,
                    luxHandle,
                    fanPowerHandle,
                    lightPowerHandle,
                    pumpPowerHandle,
                    eventsHandle,
                    alertsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const events = Events.find({}).fetch();
  const alerts = Events.find({'event.type': 'alert'}).fetch();
  const phEvent = Events.findOne({'event.type': 'ph'});
  const ecEvent = Events.findOne({'event.type': 'ec'});
  const luxEvent = Events.findOne({'event.type': 'lux'});
  const tempEvent = Events.findOne({'event.type': 'temperature'});
  const waterTempEvent = Events.findOne({'event.type': 'water_temperature'});
  const humidityEvent = Events.findOne({'event.type': 'humidity'});
  const fanPowerEvent = Events.findOne({'event.type': 'fan_power'});
  const pumpPowerEvent = Events.findOne({'event.type': 'pump_power'});
  const lightPowerEvent = Events.findOne({'event.type': 'light_power'});

  return {
    phEvent,
    ecEvent,
    tempEvent,
    waterTempEvent,
    humidityEvent,
    luxEvent,
    fanPowerEvent,
    lightPowerEvent,
    pumpPowerEvent,
    events,
    alerts,
    ready
  }
}, GrowHub);
