import BaseThing from '../BaseThing/BaseThing';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
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
import GrowFile from '../../app/components/GrowFile';
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
import CircularProgress from 'material-ui/CircularProgress';
import Gauge from 'react-svg-gauge';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import moment from 'moment';
import { Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import AutoComplete from 'material-ui/AutoComplete';

class GrowHub extends BaseThing {
  constructor(props) {
    super(props);
  }

  handleTap = (event) => {
    let command;
    let device = event.currentTarget.dataset.device;
    let doser_mapping = {
      acid: 'relay1',
      base: 'relay2',
      nutrient_a: 'relay3',
      nutrient_b: 'relay4'
    }
    if (_.contains(['fan', 'heater', 'humidifier', 'light'], device)) {
      command = this.props.thing.properties[`${device}`] === 'on' ? `${device}_off` : `${device}_on`;
    } else {
      let doser_mapping = {
        relay1: 'acid',
        relay2: 'base',
        relay3: 'nutrient_a',
        relay4: 'nutrient_b'
      }
      command = this.props.thing.properties[doser_mapping[`${device}`]] === 'on' ? `${device}_off` : `${device}_on`;
    }
    console.log(command);
    this.sendCommand(command);
  }

  handleOpen = (event) => {
    this.setState({settingsDialogOpen: true});
  }

  handleClose = (event) => {
    this.setState({settingsDialogOpen: false});
  }

  handleValueChange = (event, newValue) => {
    const key = event.target.dataset.key;
    this.setProperty(key, newValue);
  }

  handleScheduleChange = (event, newValue) => {
    this.sendCommand('stop');
    let key = event.target.dataset.key;
    this.setProperty(key, newValue);
    this.sendCommand('start');
  }

  handleGrowfileChange = (event, newValue) => {
    // console.log(newValue);
    let growfile = JSON.parse(newValue);
    // console.log(growfile);
    this.setState({growfile : growfile});
  }

  updateGrowfile = () => {
    try {
      let growfile = this.state.growfile;
      this.setProperty('growfile', growfile);
      this.sendCommand('restart');
    } catch (err) {
      alert(err);
    }
  }

  state = {
    settingsDialogOpen: false,
    expanded: true,
    dataSource: ['heater', 'fan', 'light', 'humidifier', 'ac', 'acid', 'base', 'nutrient_a', 'nutrient_b', 'dehumidifier', 'pump', 'valve', 'vent'],
    types: [
      {
        type: 'temp',
        title: 'Air Temperature',
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
        type: 'pressure',
        title: 'Atmospheric pressure',
        icon: 'wi wi-barometer',
        max: 2000
      },
      {
        type: 'orp',
        title: 'ORP',
        icon: 'wi wi-raindrop',
        min: -2000,
        max: 2000
      },
      {
        type: 'lux',
        title: 'Lux',
        icon: 'wi wi-day-sunny',
        max: 10000
      },
      {
        type: 'dissolved_oxygen',
        title: 'Dissolved Oxygen',
        icon: 'wi wi-raindrop',
        max: 36,
      },
      {
        type: 'ph',
        title: 'pH',
        icon: 'wi wi-raindrop',
        max: 14,
      },
      {
        type: 'ec',
        title: 'Conductivity (ppm)',
        icon: 'wi wi-barometer',
        max: 2000,
      },
      {
        type: 'water_temperature',
        title: 'Water temperature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius',
        max: 40,
      },
      {
        type: 'water_level',
        title: 'Water level',
        max: 100,
      },
      {
        type: 'co2',
        title: 'Carbon Dioxide',
        max: 5000,
      },
      {
        type: 'moisture_1',
        title: 'Moisture sensor #1',
        max: 100
      },
      {
        type: 'moisture_2',
        title: 'Moisture sensor #2',
        max: 100
      }
    ]
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
        // minWidth: 800,
      },
      padding: {
        padding: 30
      },
      sensorData: {
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

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        {
        <CardHeader
          contenteditable="true"
          title={thing.properties.growfile.name}
          subtitle={thing.properties.growfile.batch}
          actAsExpander={false}
          showExpandableButton={false}
          // children={
          //   <IconButton
          //     tooltip="Options"
          //     tooltipPosition="top-center"
          //     onTouchTap={this.handleOpen}
          //     style={styles.settings}>
          //     <SettingsIcon />
          //   </IconButton>
          // }
        />
        }
        <CardText>
          <Row style={{margin: -20}}>
            {
              this.state.types.map((v, k) => {
                const events = this.getEvents(v.type);
                return this.getEventValue(v.type) !== 'NA' ? <Col xs={6} md={3} key={k}>
                  <div style={styles.sensorData}>
                    <h3 style={{position: 'relative', bottom: -25}}>
                      <i className={v.icon} style={styles.sensorIcon}></i>
                      {v.title} {this.getEventValue(v.type)}
                      {v.unit ? <i className={v.unit} style={styles.sensorIcon}></i>: null}
                      {v.comment ? <span style={styles.sensorIcon}>{v.comment}</span>: null}
                      {
                        alerts[v.type] ? <span style={styles.smallFont}><IconButton
                          iconStyle={styles.smallIcon}
                          style={styles.smallIcon}>
                          <WarningIcon />
                        </IconButton> {alerts[v.type]}</span>: <span></span>
                      }
                    </h3>
                    <Gauge value={this.getEventValue(v.type)}
                           width={175}
                           height={125}
                           max={v.max}
                           label={null}
                           valueLabelStyle={styles.values}
                           color={alerts[v.type] ? 'red': 'green'} />
                  </div>
                </Col>: null;
              })
            }
          </Row>
        </CardText>
        <CardText>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Fan</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.fan === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="fan"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Heater</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.heater === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="heater"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Humidifier</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.humidifier === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="humidifier"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Light</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.light === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="light"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Acid</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.acid === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="relay1"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Base</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.base === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="relay2"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Nutrient-A</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.nutrient_a === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="relay3"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div style={styles.actuator}>
                    <div style={styles.actionButton}>
                      <h4>Nutrient-B</h4>
                      <FloatingActionButton secondary={this.props.thing.properties.nutrient_b === 'on' ? true: false}
                        backgroundColor="rgb(208, 208, 208)"
                        data-device="relay4"
                        onTouchTap={this.handleTap}>
                        <PowerIcon />
                      </FloatingActionButton>
                    </div>
                  </div>
                </Col>
              </Row>
              </Col>
              <Col xs={12} md={6}>
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
                </Col>
            </Row>
          </CardText>
          <CardText>
          <Row>
            <Col xs={12} md={12} style={styles.padding}>
              <h3>Event History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn>Type</TableHeaderColumn>
                    <TableHeaderColumn>Message</TableHeaderColumn>
                    <TableHeaderColumn>Timestamp</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {
                  this.props.events.map((v, k) => {
                    return <TableRow key={k}>
                      <TableRowColumn>{v.event.type}</TableRowColumn>
                      <TableRowColumn>{typeof v.event.message === 'string' ? v.event.message: ""}</TableRowColumn>
                      <TableRowColumn>{moment(v.event.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</TableRowColumn>
                    </TableRow>
                  })
                }
                </TableBody>
              </Table>
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

GrowHub.propTypes = {
  events: PropTypes.array,
  ecEvents: PropTypes.array,
  phEvents: PropTypes.array,
  tempEvents: PropTypes.array,
  humidityEvents: PropTypes.array,
  luxEvents: PropTypes.array,
  dissolved_oxygenEvents: PropTypes.array,
  water_temperatureEvents: PropTypes.array,
  water_levelEvents: PropTypes.array,
  orpEvents: PropTypes.array,
  co2Events: PropTypes.array,
  moisture_1Events: PropTypes.array,
  moisture_2Events: PropTypes.array,
  pressureEvents: PropTypes.array,
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

  const events = Events.find({'thing._id': thing._id, 'event.type': {'$nin': [ 'temperature', 'humidity', 'water_temperature', 'orp', 'ph', 'dissolved_oxygen', 'lux', 'ec', 'pressure', 'correction', 'moisture_1', 'moisture_2', 'co2'] }}, {limit: 20, sort: { insertedAt: -1 }}).fetch();

  const alerts = Events.find({'event.type': 'alert',
    'thing._id': thing._id}).fetch();

  const phEvents = Events.find({'event.type': 'ph',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();

  const co2Events = Events.find({'event.type': 'co2',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();

  const moisture_1Events = Events.find({'event.type': 'moisture_1',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();

  const moisture_2Events = Events.find({'event.type': 'moisture_2',
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

  const water_levelEvents = Events.find({
    'event.type': 'water_level',
    'thing._id': thing._id
  }, {
    sort: { insertedAt: -1 }
  }).fetch();

  const dissolved_oxygenEvents = Events.find({
    'event.type': 'dissolved_oxygen',
    'thing._id': thing._id
  }, {
    sort: { insertedAt: -1 }
  }).fetch();

  const orpEvents = Events.find({'event.type': 'orp',
    'thing._id': thing._id}, {
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

  const pressureEvents = Events.find({'event.type': 'pressure',
    'thing._id': thing._id}, {
    sort: { insertedAt: -1 }
  }).fetch();

  return {
    events,
    phEvents,
    ecEvents,
    orpEvents,
    tempEvents,
    humidityEvents,
    dissolved_oxygenEvents,
    luxEvents,
    co2Events,
    moisture_1Events,
    moisture_2Events,
    alerts,
    water_temperatureEvents,
    water_levelEvents,
    pressureEvents,
    ready
  }
}, GrowHub);
