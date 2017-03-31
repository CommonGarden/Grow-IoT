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
import Divider from 'material-ui/Divider';

class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = () => {
    const command = this.props.thing.properties.state === 'on' ? 'turn_off' : 'turn_on';
    console.log(command);
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

  getEventValue(type) {
    const e = this.props[`${type}Event`];
    return e ? e.event.value.toFixed(1) : 'NA';
  }

  render() {
    // console.log(this.props.alerts);
  
    const styles = {
      left: {
        float: 'left'
      },
      right: {
        float: 'right'
      },
      actuator: {
        float: 'left',
        padding: 10,
      },
      actionButton: {
        float: 'left',
        marginRight: 20,
        marginleft: 20
      },
      sensorData: {
        paddingLeft: 10,
        paddingRight: 10
      },
      sensorIcon: {
        marginRight: 5
      }
    }

    /*
      Todo:
      -[ ] show power usage data on the plugs.
      Data format:
      { current: 1.0805,
        voltage: 120.438369,
        power: 128.792394,
        total: 0.041,
        err_code: 0 }
      -[ ] Add camera icon and teaser todo dialog. : )
      -[ ] Show uuid and token in settings
    */
    return (
      <div>
        <div>
          <h2 style={styles.left}>Grow Hub</h2>
          <IconButton
            tooltip="Take image"
            tooltipPosition="top-center"
            iconStyle={styles.right}>
            <CameraIcon />
          </IconButton>
          <IconButton
            tooltip="Advanced Options"
            tooltipPosition="top-center"
            onTouchTap={this.handleOpen}
            data-dialog="settingsDialogOpen"
            iconStyle={styles.right}>
            <SettingsIcon />
          </IconButton>
        </div>
        
        <div style={styles.sensorData}>
        {
          this.state.types.map((v, k) => {
              return <p key={k}><i className={v.icon} style={styles.sensorIcon}></i> {v.title}: <strong>{this.getEventValue(v.type)}</strong> </p>
          })
        }
        </div>

        <Divider />

        <div style={styles.actuator}>
          <div style={styles.actionButton}>
            <h3>Light</h3>
            <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                  backgroundColor="rgb(208, 208, 208)"
                                  onTouchTap={this.handleTap}>
              <PowerIcon />
            </FloatingActionButton>
          </div>
          <div style={styles.right}>
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
            <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                  backgroundColor="rgb(208, 208, 208)"
                                  onTouchTap={this.handleTap}>
              <PowerIcon />
            </FloatingActionButton>
          </div>
          <div style={styles.right}>
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

        <div style={styles.actuator}>
          <div style={styles.actionButton}>
            <h3>Watering</h3>
            <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                  backgroundColor="rgb(208, 208, 208)"
                                  onTouchTap={this.handleTap}
                                  style={styles.left}>
              <PowerIcon />
            </FloatingActionButton>
          </div>
          <div style={styles.right}>
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

        <Dialog
          title="Are you sure?"
          actions={
            <FlatButton
              label="No"
              primary={true}
              data-dialog="dltOpen"
              onTouchTap={this.handleClose}
            />,
            <FlatButton
              label="Yes"
              primary={true}
              onTouchTap={this.deleteThing}
            />
          }
          modal={false}
          open={this.state.dltOpen}
          onRequestClose={this.handleClose}
        />
      </div>
    )
  }
}

GrowHub.propTypes = {
  ecEvent: React.PropTypes.object,
  phEvent: React.PropTypes.object,
  tempEvent: React.PropTypes.object,
  humidityEvent: React.PropTypes.object,
  events: React.PropTypes.array,
}

export default GrowHubContainer = createContainer(({ thing }) => {
  const phHandle = Meteor.subscribe('Thing.events', thing.uuid, 'ph', 1);
  const tempHandle = Meteor.subscribe('Thing.events', thing.uuid, 'temperature', 1);
  const ecHandle = Meteor.subscribe('Thing.events', thing.uuid, 'ec', 1);
  const humidityHandle = Meteor.subscribe('Thing.events', thing.uuid, 'humidity', 1);
  const eventsHandle = Meteor.subscribe('Thing.events', thing.uuid);
  const alertsHandle = Meteor.subscribe('Thing.events', thing.uuid, 'alert', 10);
  const loading = [ phHandle, tempHandle, ecHandle, humidityHandle, eventsHandle, alertsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const alerts = Events.find({'event.type': 'alert'}).fetch();
  const phEvent = Events.findOne({'event.type': 'ph'});
  const ecEvent = Events.findOne({'event.type': 'ec'});
  const tempEvent = Events.findOne({'event.type': 'temperature'});
  const humidityEvent = Events.findOne({'event.type': 'humidity'});

  return {
    phEvent,
    ecEvent,
    tempEvent,
    humidityEvent,
    alerts,
    loading
  }
}, GrowHub);
