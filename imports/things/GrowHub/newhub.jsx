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
import styles from './styles.js';
import Iframe from 'react-iframe';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import WebCam from '../Camera/WebCamComponent.jsx';
import {List, ListItem} from 'material-ui/List';
import MediaQuery from 'react-responsive';
import './styles.css';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';

let GRAFANA_URL = Meteor.settings.public.GRAFANA_URL ? Meteor.settings.public.GRAFANA_URL: 'https://data.commongarden.org'

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
    grafanaDashboardOpen: false,
    expanded: false,
    /* value: 3*/
  }

  handleToggleGrfanaDashboard = () => {
    this.setState({grafanaDashboardOpen: !this.state.grafanaDashboardOpen});
  }

  handleAutomationStartStop = (event) => {
    let enabled = event.currentTarget.dataset.enabled;
    this.setProperty('automation_enabled', !enabled);
  }

  // Rename sendCommand to send?
  // Add to BaseThing?
  reboot = () => {
    this.sendCommand('reboot');
  }

  render() {
    const thing = this.props.thing;
    const properties = thing.properties;
    const alerts = thing.properties.alerts || {};
    const types = thing.properties.types;
    const growfile = thing.properties.growfile;
    /*
       TODO add deviders between readings?
       TODO add labels for toggle switches
       TODO use react-images-upload for taking pictures with a cellphone
    */
    return (
      <Card className='device'>
    <CardMedia
      overlay={
  <Toolbar style={{backgroundColor:'transparent'}}>
    <ToolbarGroup firstChild={true} style={{marginLeft: 0}}>
      <ToolbarTitle text={thing.name ? thing.name:"Grow Controller"} style={{color:'white'}}/>
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
        onTouchTap={this.handleOpen}
        iconStyle={{color:'white'}}
        >
        <SettingsIcon />
      </IconButton>
    </ToolbarGroup>
  </Toolbar>

      }
    >
      <img src="/img/Placeholder_Image.jpg" alt="Add photo" />
    </CardMedia>
         {this.onlineSince()}
         { types && types.camera || types.cameras ? <WebCam thing={thing} />: null}
         <CardText>
      <Row style={{margin: -20}}>
            <List style={{width:'100%', padding: 10}}>
            <Subheader>Sensors</Subheader>
            {
              // TODO: collapsed view, should just display icons with values
              types && types.sensors ? types.sensors.map((v, k) => {
                const events = this.getEvents(v.type);
                return this.getEventValue(v.type) !== 'NA' ? <ListItem
                key={k}
                primaryText={v.title}
                leftAvatar={v.icon ? <i className={v.icon} style={{top:19}}></i>:<i className='wi wi-barometer'
                                                                                    style={{top:19}}></i>}
                rightIcon={<span>
                  {this.getEventValue(v.type)}
                  {v.unit ? <i className={v.unit} style={styles.sensorIcon}></i>:null}
                  {v.comment ? <span style={styles.sensorIcon}>{v.comment}</span>: null}
                  {
                    alerts[v.type] ? <span style={styles.smallFont}><IconButton
                    iconStyle={styles.smallIcon}
                    style={styles.smallIcon}>
                    <WarningIcon />
                  </IconButton> {alerts[v.type]}</span>: <span></span>
                  }
                </span>}
                />: null
              }): null
            }
      </List>
          </Row>
        </CardText>
        <CardText>
          <Row>
             <List style={{width:'100%', padding: 10}}>
             <Subheader>Actuators</Subheader>
                  {
                    types && types.actuators ? types.actuators.map((value, key) => {
                      return <ListItem
                        key={key}
                        primaryText={value.title}
                        leftAvatar={value.icon ? <i className={value.icon}></i>:<PowerIcon style={{top:16}}/>}
                        rightToggle={<Toggle data-device={value.role} onTouchTap={this.handleTap}
                                             label={this.props.thing.properties[value.role]} />}
                      />


                        {
                          {/* <Col xs={6} md={3} key={key}>
                              <div style={styles.actuator}>
                              <div style={styles.actionButton}>
                              <p>{value.title}</p>
                              <FloatingActionButton secondary={this.props.thing.properties[value.role] === 'on' ? true: false}
                              backgroundColor="rgb(208, 208, 208)"
                              data-device={value.role}
                              onTouchTap={this.handleTap}>
                              <PowerIcon />
                              </FloatingActionButton>
                              </div>
                              </div>
                              </Col> */}
                      }
                      }): null
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
            <h2>Reboot</h2>
            <p>Rebooting the device will result in the device temporarilly going offline.</p>
            <RaisedButton label="Reboot device" primary={true} onTouchTap={this.reboot}/>
            <br/>
            <h2>Delete</h2>
            <p>WARNING, this will delete your device and all it's event history!</p>
            {this.props.actions}
          </Dialog>
          <Dialog
            contentStyle={{width:'95%', maxWidth: '100%'}}
            bodyStyle={{backgroundColor: '#f8f8f8', padding: 0}}
            actions={<FlatButton
              label="Close"
              primary={true}
              onTouchTap={this.handleToggleGrfanaDashboard}
            />}
            modal={false}
            autoScrollBodyContent={true}
            onRequestClose={this.handleToggleGrfanaDashboard}
            open={this.state.grafanaDashboardOpen}>
            {
              // HACK: this is passing a lot of info through the url.
              GRAFANA_URL ? <div style={{overflow:'auto', WebkitOverflowScrolling:'touch'}}><Iframe url={
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
                                    allowFullScreen/></div>: null
            }
          </Dialog>
      </Card>
    )
  }
}

GrowHub.propTypes = {
  events: PropTypes.array,
  ecEvents: PropTypes.array,
  phEvents: PropTypes.array,
  temperatureEvents: PropTypes.array,
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

  let types = thing.properties.types
  let allEvents = {}
  for (let i in types.sensors) {
    let eventType = types.sensors[i].type

    // TODO remove unneeded 'Events' string in BaseThing.jsx
    allEvents[eventType + 'Events'] =  Events.find({'event.type': eventType, 'thing._id': thing._id}).fetch();
  }

  allEvents['alerts'] = Events.find({'event.type': 'alerts', 'thing._id': thing._id}).fetch()

  return allEvents;
 }, GrowHub);
