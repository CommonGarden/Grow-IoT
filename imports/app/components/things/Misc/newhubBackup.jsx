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
import Iframe from 'react-iframe';
import Toggle from 'material-ui/Toggle';

// Ummmm, there is no process variable in the browser... should we use SSR?
let GRAFANA_URL = GRAFANA_URL = process.env.GRAFANA_URL ? process.env.GRAFANA_URL: (
    Meteor.settings.public.GRAFANA_URL ? Meteor.settings.public.GRAFANA_URL: 'http://localhost:3333'
);

console.log('Grafana URL: ' + GRAFANA_URL);

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
    expanded: false,
  }

  render() {
    const thing = this.props.thing;
    const properties = thing.properties;
    const alerts = thing.properties.alerts || {};
    const types = thing.properties.types;
    const growfile = thing.properties.growfile;

    return (
      <Card expanded={this.state.expanded}
            onExpandChange={this.handleExpandChange}
            style={{backgroundColor: '#f8f8f8'}}>
         <CardHeader
          title={thing.properties.growfile.name ? thing.properties.growfile.name: 'Grow Controller'}
          subtitle={thing.properties.growfile.batch}
          actAsExpander={true}
          showExpandableButton={false}
          children={
            <IconButton
              tooltip="Options"
              tooltipPosition="top-center"
              onTouchTap={this.handleOpen}
              style={styles.settings}>
              <SettingsIcon />
            </IconButton>
          }
         />
         {this.onlineSince()}
         {
           GRAFANA_URL ? <Iframe url={
             GRAFANA_URL +
                                      '/dashboard/script/thing.js?orgId=1&id=' +
                                      thing._id + '&types='+
                                      encodeURIComponent(JSON.stringify(types))
           }
                                 width="100%"
                                 height="800px"
                                 id="myId"
                                 className="myClassname"
                                 display="initial"
                                 position="relative"
                                 allowFullScreen/>: null
         }
         <CardText expandable={true}>
          <Row style={{margin: -20}}>
            {
              /*
              // TODO: collapsed view
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
                  </div>
                </Col>:null
              }): null
              */
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
                  defaultValue={thing.properties.interval}
                  onChange={this.handleScheduleChange}
                />
                <br/>
                <Toggle
                  label="Automation"
                  toggled={false}
                />
                {
                  thing.properties.growfile ? Object.keys(thing.properties.growfile).map((v, k) => {
                      console.log(value, key);
                  }):null
                }
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

            <h2>Reboot</h2>
            <p>Rebooting the device will result in the device temporarilly going offline.</p>
            <RaisedButton label="Reboot device" primary={true} onTouchTap={this.updateGrowfile}/>
            <br/>

            <h2>Grow settings</h2>
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
            <h2>Delete</h2>
            <p>WARNING, this will delete your device and all it's event history!</p>
            {this.props.actions}
         </Dialog>
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
