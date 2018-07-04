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

let GRAFANA_URL = Meteor.settings.public.GRAFANA_URL ? Meteor.settings.public.GRAFANA_URL: 'https://data.commongarden.org'

class GrowHub extends BaseThing {
  constructor(props) {
    super(props);
  }

  state = {
    settingsDialogOpen: false,
    expanded: false,
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

  handleToggleGrfanaDashboard = () => {
    let thing = this.props.thing
    let url = GRAFANA_URL + '/dashboard/script/thing.js?orgId=1&id=' + thing._id + '&types='+ encodeURIComponent(JSON.stringify(thing.properties.types));
    let win = window.open(url, '_blank');
    win.focus();
  }

  imageTap = () => {
    console.log('tapped')
  }

  onlineSince () {
    if (!this.props.thing.onlineSince) {
      return <div className='offline'><WarningIcon className='offline-warning-icon' />No Server Connection</div>
    } else {
      return null
    }
  }

  takePicture = () => {
    this.sendCommand('picture');
  }

  render() {
    const thing = this.props.thing;
    const properties = thing.properties;
    const alerts = thing.properties.alerts || {};
    const types = thing.properties.types;
    const growfile = thing.properties.growfile;

    let link;
    if (this.props.ready && this.props.image) {
      let image = this.props.image;
      link = Images.findOne({_id: image._id}).link();
    }

    return (
      <Card className='device'>
        {this.onlineSince()}
        <CardMedia
          onTouchTap={link? null:this.imageTap}
          /* overlayContentStyle={{backgroundColor:'#5db975'}}*/
          overlay={
            <Toolbar style={{backgroundColor:'transparent'}}>
              <ToolbarGroup firstChild={true} style={{marginLeft: 0}}>
                <ToolbarTitle text={thing.name ? thing.name:"Grow Controller"}
            onTouchTap={()=> {this.props.history.push('thing/' + this.props.thing.uuid)}}
                                   style={{color:'white', cursor:'pointer', fontFamily: 'FuturaBold'}}/>
              </ToolbarGroup>
              <ToolbarGroup>
                {
                  types && types.camera || types.cameras ? <IconButton onTouchTap={this.takePicture}
                                                                                  tooltip="Take picture"
                                                                                  style={styles.button}
                                                                                  iconStyle={{color:'white'}} ><CameraIcon /></IconButton>: null
                }
                {
                  GRAFANA_URL ? <IconButton
                                  tooltip="Show charts"
                                           tooltipPosition="top-center"
                                           onTouchTap={this.handleToggleGrfanaDashboard}
                                           iconStyle={{color:'white'}}>
                    <ChartIcon />
                  </IconButton>: null
                }
                <IconButton
                  tooltip="Options"
                           tooltipPosition="top-center"
                           onTouchTap={()=>{this.props.history.push('/app/device/settings/'+ thing.uuid)}}
                           iconStyle={{color:'white'}}
                >
                  <SettingsIcon />
                </IconButton>
              </ToolbarGroup>
            </Toolbar>

          }
        >
          { types && types.camera ? <img src={link ? link: "/img/Placeholder_Image.jpg"}
                                         alt="Add photo" />:<div style={{minHeight: 60}}></div>}
        </CardMedia>
        <CardText>
          <Row style={{margin: -20}}>
           <List style={{width:'100%', padding:0}}>
      {
        types && types.sensors ? <Subheader style={styles.subHeader}>Sensors</Subheader>: null
      }
              {
                types && types.sensors ? types.sensors.map((v, k) => {
                  const events = this.getEvents(v.type);
                  return this.getEventValue(v.type) !== 'NA' ? <ListItem
                                                                 key={k}
                                                                 style={styles.listItem}

                                                                 innerDivStyle={{lineHeight: '25px'}}
                                                                 primaryText={<span>{v.title}</span>}
                  onTouchTap={()=> {this.props.history.push('/app/detail/' + this.props.thing.uuid + '/' + v.type)}}
                                                                 leftAvatar={v.icon ? <i className={v.icon} style={styles.icon}></i>:<i className='wi wi-barometer'
                                                                                                                                                   style={styles.icon}></i>}
                                                                 rightIcon={<span className={ alerts[v.type] ? "right-icon-warning":"right-icon"}>
                                                                   {
                                                                     alerts[v.type] ? <WarningIcon className="warning-icon" />:null
                                                                   }
                                                                   <span style={styles.sensorReading} className={alerts[v.type] ? "warning": null}>
                                                                     {this.getEventValue(v.type)}
                                                                     {v.unit ? <i className={v.unit} style={styles.sensorIcon}></i>:null}
                                                                   </span>
                                                                   {v.comment ? <span style={styles.sensorIcon}>{v.comment}</span>: null}
                                                                 </span>}
                  />: null
                }): null
              }
            </List>
            {/* </Row>
                </CardText>
                <CardText>
                <Row> */}
              <List style={{width:'100%'}}>
                {
                  types && types.actuators ? <Subheader style={styles.subHeader}>Actuators</Subheader>: null
                }
                {
                  types && types.actuators ? types.actuators.map((value, key) => {
                    return <ListItem
                             key={key}
                             style={styles.listItem}
                             primaryText={value.title}
                             leftAvatar={value.icon ? <i className={value.icon} style={styles.icon}></i>:<PowerIcon style={styles.icon} />}
                             rightToggle={<Toggle data-device={value.role}
                                                              onTouchTap={this.handleTap}
                                                              style={styles.rightToggle} labelStyle={styles.toggleLabel}
                                                              label={this.props.thing.properties[value.role]}
                                                              toggled={thing.properties[value.role] === 'on'} />}
                    />}): null
                }
              </List>
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
                  <h2>Grow settings</h2>
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
                  <h2>Device credentials</h2>
                  <p>These credentials are unique to your device. Keep them secret.</p>
                  <p>UUID: {thing.uuid}</p>
                  <p>TOKEN: {thing.token}</p>
                  <h2>Reboot</h2>
                  <p>Rebooting the device will result in the device temporarilly going offline.</p>
                  <RaisedButton label="Reboot device" primary={true} onTouchTap={this.reboot}/>
                  <br/>
                  <h2>Delete</h2>
                  <p>WARNING, this will delete your device and all it's event history!</p>
                  {this.props.actions}
                </Dialog>
      </Card>
    )
  }
}

export default GrowHubContainer = createContainer(({ thing }) => {
  let eventsHandle = Meteor.subscribe('Thing.events', thing.uuid);
  let imagesHandle = Meteor.subscribe('Thing.images', thing.uuid, 1);
  let allEvents = {}

  allEvents.ready = [ eventsHandle, imagesHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  let types = thing.properties.types

  for (let i in types.sensors) {
    let eventType = types.sensors[i].type

    // TODO remove unneeded 'Events' string in BaseThing.jsx
    allEvents[eventType + 'Events'] =  Events.find({'event.type': eventType, 'thing._id': thing._id}, {
      sort: { insertedAt: -1 }
    }).fetch();
  }

  allEvents.alerts = Events.find({'event.type': 'alerts', 'thing._id': thing._id}).fetch()
  allEvents.image = Images.findOne({
    'meta.thing': thing._id,
  }, {
    'sort': {
      'meta.insertedAt': -1
    },
  });

  return allEvents;
 }, GrowHub);
