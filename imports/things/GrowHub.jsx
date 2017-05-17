import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import _ from 'underscore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import EnergyIcon from 'material-ui/svg-icons/image/flash-on';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import ImageOne from '../app/components/images/ImageOne';
import CameraComponent from './CameraComponent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import { Row, Col } from 'react-flexbox-grid';

// Should there be a base thing component that has methods like setProperty and sendcommand?
class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = (event) => {
    let device = event.currentTarget.dataset.device;
    let command = this.props.thing.properties[`${device}_state`] === 'on' ? `turn_${device}_off` : `turn_${device}_on`;
    this.sendCommand(command);
  };

  handleOpen = (event) => {
    this.setState({settingsDialogOpen: true});
  };

  handleClose = (event) => {
    this.setState({settingsDialogOpen: false});
  };

  handleValueChange = (event, newValue) => {
    const key = event.target.dataset.key;
    this.setProperty(key, newValue);
  };

  handleScheduleChange = (event, newValue) => {
    this.sendCommand('stop');
    let key = event.target.dataset.key;
    this.setProperty(key, newValue);
    this.sendCommand('start');
  }

  state = {
    settingsDialogOpen: false,
    types: [
      {
        type: 'temp',
        title: 'Room Temparature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius'
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
        icon: 'wi wi-barometer',
      },
      {
        type: 'water_temperature',
        title: 'Resevoir temperature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius'
      },
      // {
      //   type: 'lux',
      //   title: 'Lux',
      //   icon: 'wi wi-day-sunny'
      // },
    ]
  };

  sendCommand (method, options) {
    Meteor.call('Thing.sendCommand',
      this.props.thing.uuid,
      method,
      options,
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

  updateGrowfile = () => {
    try {
      let growfile = JSON.parse(document.getElementById('Growfile').value);
      this.setProperty('growfile', growfile);
      this.sendCommand('restart');
    } catch (err) {
      alert(err);
    }
  }

  getEventValue(type) {
    const e = this.props[`${type}Event`];
    return e ? Number(e.event.value).toFixed(2) : 'NA';
  }

  render() {
    const styles = {
      right: {
        float: 'right'
      },
      oneHundred: {
        width: '100%'
      },
      options: {
        marginLeft: 200,
        position: 'relative',
        bottom: 100,
      },
      actuator: {
        padding: 10,
        float: 'left',
        marginRight: 20
      },
      actionButton: {
        marginRight: 20,
        marginleft: 20
      },
      main: {
        margin: '20px',
      },
      sensorData: {
        paddingLeft: 10,
        paddingRight: 10,
      },
      powerData: {
        position: 'relative',
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
      smallIcon: {
        height: 15,
        width: 15,
        padding: 0,
        marginLeft: 3,
      },
      image: {
        maxWidth: 400,
        minWidth: 300,
        minHeight: 300,
        position: 'relative',
        marginLeft: 300,
        marginTop: -300,
        top: 7,
        left: 16,
        marginBottom: 14,
      }
    }

    const thing = this.props.thing;
    const alerts = this.props.thing.properties.alerts || {};

    return (
      <Card style={styles.main}>
        <CardText>
          <Row>
            <Col xs={12} md={6}>
              <div>
                <h2>Grow Hub
                  <IconButton
                    tooltip="Options"
                    tooltipPosition="top-center"
                    onTouchTap={this.handleOpen}>
                    <SettingsIcon />
                  </IconButton>
                </h2>
              </div>
              <div style={styles.sensorData}>
                {
                  this.state.types.map((v, k) => {
                    return <h3 key={k}>
                      <i className={v.icon} 
                        style={styles.sensorIcon}></i> {v.title}: <strong>{this.getEventValue(v.type)}</strong>
                      {v.unit ? <i className={v.unit} style={styles.sensorIcon}></i>: null}
                      {v.comment ? <span style={styles.sensorIcon}>{v.comment}</span>: null}
                      {
                        alerts[v.type] ? <IconButton
                          tooltip={alerts[v.type]}
                          tooltipPosition="top-center"
                          iconStyle={styles.smallIcon}
                          style={styles.smallIcon}>
                          <WarningIcon />
                        </IconButton>: <span></span>
                      }
                    </h3>
                  })
                }
              </div>

            </Col>
            <Col xs={12} md={6}>
              <CameraComponent thing={this.props.thing}/>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={12} md={4}>
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
                    Current: {this.getEventValue('light_power_current')}<br/>
                    Voltage: {this.getEventValue('light_power_voltage')}<br/>
                    Power: {this.getEventValue('light_power_power')}<br/>
                    Total: {this.getEventValue('light_power_total')}<br/>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4}>
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
                    Current: {this.getEventValue('fan_power_current')}<br/>
                    Voltage: {this.getEventValue('fan_power_voltage')}<br/>
                    Power: {this.getEventValue('fan_power_power')}<br/>
                    Total: {this.getEventValue('fan_power_total')}<br/>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4}>
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
                    Current: {this.getEventValue('pump_power_current')}<br/>
                    Voltage: {this.getEventValue('pump_power_voltage')}<br/>
                    Power: {this.getEventValue('pump_power_power')}<br/>
                    Total: {this.getEventValue('pump_power_total')}<br/>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Dialog
            title="Settings"
            actions={<FlatButton
              label="Close"
              primary={true}
              onTouchTap={this.handleClose}
            />}
            modal={false}
            autoScrollBodyContent={true}
            onRequestClose={this.handleClose}
            open={this.state.settingsDialogOpen}>
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
              multiLine={true}
              style={styles.oneHundred}
              rows={10}
            />
            <br/>
            <RaisedButton label="Update Growfile" primary={true} onTouchTap={this.updateGrowfile}/>
            <br/>
            <br/>
            <br/>
            <Divider />
            <p>Auth credentials:</p>
            <p>uuid: {thing.uuid}</p>
            <p>token: {thing.token}</p>
            <RaisedButton label="Delete Grow Hub" secondary={true} />
          </Dialog>
          <br/>
        </CardText>
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
    )
  }
}

// Hack, let's make this a little more elegant...
GrowHub.propTypes = {
  ecEvent: PropTypes.object,
  phEvent: PropTypes.object,
  tempEvent: PropTypes.object,
  water_temperatureEvent: PropTypes.object,
  humidityEvent: PropTypes.object,
  luxEvent: PropTypes.object,
  fan_power_powerEvent: PropTypes.object,
  light_power_powerEvent: PropTypes.object,
  pump_power_powerEvent: PropTypes.object,
  fan_power_voltageEvent: PropTypes.object,
  pump_power_voltageEvent: PropTypes.object,
  light_power_voltageEvent: PropTypes.object,
  fan_power_currentEvent: PropTypes.object,
  pump_power_currentEvent: PropTypes.object,
  light_power_currentEvent: PropTypes.object,
  fan_power_totalEvent: PropTypes.object,
  pump_power_totalEvent: PropTypes.object,
  light_power_totalEvent: PropTypes.object,
  ready: PropTypes.bool,
  alerts: PropTypes.array,
}

export default GrowHubContainer = createContainer(({ thing }) => {
  const eventsHandle = Meteor.subscribe('Thing.events', thing.uuid);

  const ready = [ eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const alerts = Events.find({'event.type': 'alert'}).fetch();
  const phEvent = Events.findOne({'event.type': 'ph'});
  const ecEvent = Events.findOne({'event.type': 'ec'});
  const luxEvent = Events.findOne({'event.type': 'lux'});
  const tempEvent = Events.findOne({'event.type': 'temperature'});
  const water_temperatureEvent = Events.findOne({'event.type': 'water_temperature'});
  const humidityEvent = Events.findOne({'event.type': 'humidity'});

  const fan_power_powerEvent = Events.findOne({'event.type': 'fan_power_power'});
  const pump_power_powerEvent = Events.findOne({'event.type': 'pump_power_power'});
  const light_power_powerEvent = Events.findOne({'event.type': 'light_power_power'});

  const fan_power_voltageEvent = Events.findOne({'event.type': 'fan_power_voltage'});
  const pump_power_voltageEvent = Events.findOne({'event.type': 'pump_power_voltage'});
  const light_power_voltageEvent = Events.findOne({'event.type': 'light_power_voltage'});

  const fan_power_currentEvent = Events.findOne({'event.type': 'fan_power_current'});
  const pump_power_currentEvent = Events.findOne({'event.type': 'pump_power_current'});
  const light_power_currentEvent = Events.findOne({'event.type': 'light_power_current'});

  const fan_power_totalEvent = Events.findOne({'event.type': 'fan_power_total'});
  const pump_power_totalEvent = Events.findOne({'event.type': 'pump_power_total'});
  const light_power_totalEvent = Events.findOne({'event.type': 'light_power_total'});

  return {
    phEvent,
    ecEvent,
    tempEvent,
    water_temperatureEvent,
    humidityEvent,
    luxEvent,
    fan_power_powerEvent,
    light_power_powerEvent,
    pump_power_powerEvent,
    fan_power_voltageEvent,
    pump_power_voltageEvent,
    light_power_voltageEvent,
    fan_power_currentEvent,
    pump_power_currentEvent,
    light_power_currentEvent,
    fan_power_totalEvent,
    pump_power_totalEvent,
    light_power_totalEvent,
    alerts,
    ready
  }
}, GrowHub);
