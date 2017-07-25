import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import _ from 'underscore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import EmptyIcon from 'material-ui/svg-icons/action/opacity';
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
import CircularProgress from 'material-ui/CircularProgress';
import Gauge from 'react-svg-gauge';

// Should there be a base thing component that has methods like setProperty and sendcommand?
class PlusFarm extends Component {
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
        title: 'Temparature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius',
        max: 40
      },
      {
        type: 'humidity',
        title: 'Humidity',
        icon: 'wi wi-humidity',
        max: 100
      },
      {
        type: 'lux',
        title: 'lux',
        icon: 'wi wi-day-sunny',
        max: 1000,
      },
      {
        type: 'ph',
        title: 'pH',
        icon: 'wi wi-raindrop',
        max: 14,
      },
      {
        type: 'ec',
        title: 'Conductivity (ec)',
        icon: 'wi wi-barometer',
        max: 2000,
      },
      {
        type: 'water_temperature',
        title: 'Resevoir temperature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius',
        max: 40,
      },
    ]
  };

  getEvents(type) {
    const e = this.props[`${type}Events`];

    let data = {
      name: type,
      columns: ["time", "value"],
      points: []
    };
    _.each(e, (value, key, list) => {
      data.points.unshift([value.event.timestamp.getTime(), value.event.message])
    });
    if (data.points[0]) return new TimeSeries(data);
  }

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

  takePicture = () => {
    this.sendCommand('picture');
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
    const e = this.props[`${type}Events`];
    if (e) {
      return e[0] ? Number(e[0].event.message).toFixed(2) : 'NA';
    }
  }

  getEvents(type) {
    const e = this.props[`${type}Events`];

    let data = {
      name: type,
      columns: ["time", "value"],
      points: []
    };
    _.each(e, (value, key, list) => {
      data.points.unshift([value.event.timestamp.getTime(), value.event.message])
    });
    if (data.points[0]) return new TimeSeries(data);
  }

  render() {
    const styles = {
      oneHundred: {
        width: '100%'
      },
      actuator: {
        padding: 10,
        float: 'left',
        margin: 20
      },
      actionButton: {
        marginRight: 20,
        marginleft: 20
      },
      values: {
        fontSize: 25
      },
      main: {
        margin: '20px',
        minWidth: 800,
      },
      sensorData: {
        position: 'relative',
        top: 25,
        textAlign: 'center',
      },
      sensorIcon: {
        marginRight: 5
      },
      settings: {
        float: 'right'
      },
      smallIcon: {
        height: 15,
        width: 15,
        padding: 0,
        marginLeft: 3,
      },
      smallFont: {
        fontSize: 11
      }
    }

    const thing = this.props.thing;
    const properties = this.props.thing.properties;
    const alerts = this.props.thing.properties.alerts || {};
    const width = 400;

    return (
      <Card style={styles.main}>
        <CardText>
          <div>
              <img src="/img/plusfarm.png"
                   style={{
                    maxWidth:100
                   }}/>
              <IconButton
                tooltip="Options"
                tooltipPosition="top-center"
                onTouchTap={this.handleOpen}
                style={styles.settings}>
                <SettingsIcon />
              </IconButton>
          </div>
          <Row>
              {
                this.state.types.map((v, k) => {
                  const events = this.getEvents(v.type);
                  return <Col xs={4} md={4} key={k}>
                    <div style={styles.sensorData}>
                      <h2>
                        <i className={v.icon} style={styles.sensorIcon}></i>
                        {v.title}
                        {v.unit ? <i className={v.unit} style={styles.sensorIcon}></i>: null}
                        {v.comment ? <span style={styles.sensorIcon}>{v.comment}</span>: null}
                        {
                          alerts[v.type] ? <span style={styles.smallFont}><IconButton
                            iconStyle={styles.smallIcon}
                            style={styles.smallIcon}>
                            <WarningIcon />
                          </IconButton> {alerts[v.type]}</span>: <span></span>
                        }
                      </h2>
                    </div>
                    <Gauge value={this.getEventValue(v.type)}
                           width={300}
                           height={200}
                           max={v.max}
                           label={null}
                           valueLabelStyle={styles.values}
                           color={alerts[v.type] ? 'red': 'green'} />
                  </Col>
                })
              }
          </Row>
          <Row>
            <Col xs={4} md={4}>
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
                {
                  // <TextField
                  //   hintText="Day start"
                  //   floatingLabelText="Day start"
                  //   data-key="interval"
                  //   defaultValue={thing.properties.growfile.night.schedule}
                  //   onChange={this.handleScheduleChange}
                  // />
                  // <br/>
                  // <TextField
                  //   hintText="Night start"
                  //   floatingLabelText="Night start"
                  //   data-key="interval"
                  //   defaultValue={thing.properties.growfile.night.schedule}
                  //   onChange={this.handleScheduleChange}
                  // />
                }
                </div>
              </div>
            </Col>
            <Col xs={4} md={4}>
              <div style={styles.actuator}>
                <div style={styles.actionButton}>
                  <h3>Pump</h3>
                  <FloatingActionButton secondary={this.props.thing.properties.pump_state === 'on' ? true: false}
                    backgroundColor="rgb(208, 208, 208)"
                    data-device="pump"
                    onTouchTap={this.handleTap}>
                    <PowerIcon />
                  </FloatingActionButton>
                </div>
              </div>
            </Col>
            <Col xs={4} md={4}>
              <div style={styles.actuator}>
                <div style={styles.actionButton}>
                  <h3>Water level</h3>
                  <FloatingActionButton secondary={this.props.thing.properties.water_level_state === 'on' ? true: false}
                    backgroundColor="red"
                    data-device="pump"
                    secondaryColor="green"
                    onTouchTap={this.handleTap}>
                    <EmptyIcon />
                  </FloatingActionButton>
                  <span style={{margin: 10}}>low</span>
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

PlusFarm.propTypes = {
  ecEvents: PropTypes.array,
  phEvents: PropTypes.array,
  tempEvents: PropTypes.array,
  humidityEvents: PropTypes.array,
  luxEvents: PropTypes.array,
  ready: PropTypes.bool,
  alerts: PropTypes.array,
}

export default PlusFarmContainer = createContainer(({ thing }) => {
  const eventsHandle = Meteor.subscribe('Thing.events', thing.uuid);

  const ready = [ eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const alerts = Events.find({'event.type': 'alert',
    'thing._id': thing._id}).fetch();
  const phEvents = Events.find({'event.type': 'ph',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const ecEvents = Events.find({'event.type': 'ec',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const luxEvents = Events.find({
  	'event.type': 'lux',
    'thing._id': thing._id
  }, {
    sort: { insertedAt: -1 }
  }).fetch();
  const tempEvents = Events.find({'event.type': 'temperature',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const humidityEvents = Events.find({'event.type': 'humidity',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const water_temperatureEvents = Events.find({'event.type': 'water_temperature',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();

  return {
    phEvents,
    ecEvents,
    tempEvents,
    humidityEvents,
    luxEvents,
    alerts,
    water_temperatureEvents,
    ready
  }
}, PlusFarm);
