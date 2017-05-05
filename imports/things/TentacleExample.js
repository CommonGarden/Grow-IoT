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
    const cycleKeys = ['day', 'night'];
    if (cycleKeys.indexOf(key) > -1) {
      cycles[key].start = newValue;
      this.setProperty('cycle', cycles);
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

  // TODO...
  updateGrowfile () {
    try {
      let growfile = JSON.parse(document.getElementById('Growfile').value);
      this.setProperty('growfile', growfile);
    } catch (err) {
      alert(err);
    }
  }

  getEventValue(type) {
    const e = this.props[`${type}Events`];
    return e[0] ? Number(e[0].event.value).toFixed(2) : 'NA';
  }

  getEvents(type) {
    const e = this.props[`${type}Events`];

    let data = {
      name: type,
      columns: ["time", "value"],
      points: []
    };
    _.each(e, (value, key, list) => {
      data.points.unshift([value.event.timestamp.getTime(), value.event.value])
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
                    onTouchTap={this.handleOpen}
                    data-dialog="settingsDialogOpen">
                    <SettingsIcon />
                  </IconButton>
                </h2>
              </div>
              {this.onlineSince()}
              <div style={styles.sensorData}>
                {
                  this.state.types.map((v, k) => {
                    return <div key={k}>
                      <div style={styles.sensorData}>
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
                      </div>
                      {
                      !this.props.ready ? <div><CircularProgress /> Loading</div> :
                      <Resizable>
                        <ChartContainer timeRange={this.getEvents(v.type).range()}>
                          <ChartRow height="150">
                            <YAxis
                              id={v.type}
                              min={this.getEvents(v.type).min()} max={this.getEvents(v.type).max()}
                              width="30" />
                            <Charts>
                              <LineChart axis={v.type} series={this.getEvents(v.type)} />
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
              data-dialog="settingsDialogOpen"
              onTouchTap={this.handleClose}
            />}
            modal={false}
            autoScrollBodyContent={true}
            open={this.state.settingsDialogOpen}
            onRequestClose={this.handleClose}>
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
