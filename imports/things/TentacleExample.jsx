import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import { Row, Col } from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import _ from 'underscore';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import CircularProgress from 'material-ui/CircularProgress';

class TentacleExample extends Component {
  constructor(props) {
    super(props);
  }

  handleOpen = (event) => {
    this.setState({settingsDialogOpen: true});
  };

  handleClose = (event) => {
    this.setState({settingsDialogOpen: false});
  };

  handleValueChange = (event, newValue) => {
    const uuid = this.props.thing.uuid;
    const key = event.target.dataset.key;
    this.setProperty(key, newValue);
  };

  handleScheduleChange = (event, newValue) => {
    let key = event.target.dataset.key;
    this.setProperty(key, newValue);
    this.sendCommand('restart');
  }

  state = {
    dltOpen: false,
    settingsDialogOpen: false,
    types: [
      {
        type: 'ph',
        title: 'pH',
        icon: 'wi wi-raindrop'
      },
      {
        type: 'ec',
        title: 'Conductivity (ec)',
        icon: 'wi wi-barometer',
      },
      {
        type: 'water_temperature',
        title: 'Temperature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius'
      }
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
    const e = this.props[`${type}Events`];
    return e[0] ? Number(e[0].event.message).toFixed(2) : 'NA';
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

  onlineSince () {
    const onlineSince = this.props.thing.onlineSince || false;

    if (!this.props.thing.onlineSince) {
      return <span>Offline</span>
    } else {
      return <span></span>
    }
  }

  render() {
    const styles = {
      oneHundred: {
        width: '100%'
      },
      options: {
        marginLeft: 200,
        position: 'relative',
        bottom: 100,
      },
      main: {
        margin: '20px',
      },
      sensorData: {
        padding: 10,
        fontSize: 16,
        width: 400
      },
      sensorIcon: {
        marginRight: 5
      },
      smallIcon: {
        height: 15,
        width: 15,
        padding: 0,
        marginLeft: 3,
      },
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
              {this.onlineSince()}
              <div style={styles.sensorData}>
                {
                  this.state.types.map((v, k) => {
                    const eValue = this.getEventValue(v.type);
                    const events = this.getEvents(v.type);
                    return <div key={k}>
                      <div style={styles.sensorData}>
                      <i className={v.icon} 
                        style={styles.sensorIcon}></i> {v.title}: <strong>{eValue}</strong>
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
                      </div>
                      {
                      !this.props.ready || !events ? <div><CircularProgress /> Loading</div> :
                      <Resizable>
                        <ChartContainer timeRange={events.range()}>
                          <ChartRow height="150">
                            <YAxis
                              id={v.type}
                              min={events.min()} max={events.max()}
                              width="30" />
                            <Charts>
                              <LineChart axis={v.type} series={events} />
                            </Charts>
                          </ChartRow>
                        </ChartContainer>
                      </Resizable>
                      }
                    </div>
                  })
                }
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

TentacleExample.propTypes = {
  ecEvents: PropTypes.array,
  phEvents: PropTypes.array,
  water_temperatureEvents: PropTypes.array,
  alerts: PropTypes.array,
  ready: PropTypes.bool,
}

export default TentacleExampleContainer = createContainer(({ thing }) => {
  const eventsHandle = Meteor.subscribe('Thing.events', thing.uuid);

  const ready = [ eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const alerts = Events.find({'event.type': 'alert'}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const phEvents = Events.find({'event.type': 'ph'}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const ecEvents = Events.find({'event.type': 'ec'}, {
    sort: { insertedAt: -1 }
  }).fetch();
  const water_temperatureEvents = Events.find({'event.type': 'water_temperature'}, {
    sort: { insertedAt: -1 }
  }).fetch();

  return {
    phEvents,
    ecEvents,
    water_temperatureEvents,
    alerts,
    ready
  }
}, TentacleExample);
