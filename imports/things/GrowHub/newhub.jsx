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
import styles from './styles.js';
import DropDownMenu from 'material-ui/DropDownMenu';
import AutoComplete from 'material-ui/AutoComplete';

class GrowHub extends BaseThing {
  constructor(props) {
    super(props);
  }

  handleTap = (event) => {
    let device = event.currentTarget.dataset.device;
    let command = this.props.thing.properties[`${device}`] === 'on' ? `${device}_off` : `${device}_on`;
    this.sendCommand(command);
  }

  state = {
    settingsDialogOpen: false,
    expanded: true,
    dataSource: ['heater', 'fan', 'light', 'humidifier', 'dehumidifier'],
  }

  render() {
    const thing = this.props.thing;
    const properties = thing.properties;
    const alerts = thing.properties.alerts || {};
    const types = thing.properties.types;

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={thing.properties.growfile.name}
          subtitle={thing.properties.growfile.batch}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          <Row style={{margin: -20}}>
            {
              types && types.sensors ? types.sensors.map((v, k) => {
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
                </Col>:null
              }): null
            }
          </Row>
        </CardText>
        <CardText>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                  {
                      types && types.actuators ? types.actuators.map((value, key) => {
                          return <Col xs={6} md={3} key={key}>
                              <div style={styles.actuator}>
                                  <div style={styles.actionButton}>
                                      <p>{value.role}</p>
                                      <FloatingActionButton secondary={this.props.thing.properties[value.role] === 'on' ? true: false}
                                                            backgroundColor="rgb(208, 208, 208)"
                                                            data-device={value.role}
                                                            onTouchTap={this.handleTap}>
                                          <PowerIcon />
                                      </FloatingActionButton>
                                  </div>
                              </div>
                          </Col>
                      }): null
                  }
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
