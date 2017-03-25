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
import SvgIcon from 'material-ui/SvgIcon';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = () => {
    const command = this.props.thing.properties.state === 'on' ? 'turn_off' : 'turn_on';
    this.sendCommand(command);
  };

  handleOpen = (event) => {
    let dialog = event.target.dataset.dialog;
    switch (dialog) {
      case 'dltOpen':
        this.setState({ dltOpen: true });
        break;
      case 'showLightOptionsDialog':
        this.setState({showLightOptionsDialog: true});
        break;
      case 'showHeaterOptionsDialog':
        this.setState({showHeaterOptionsDialog: true});
        break;
      case 'showWaterPumpOptionsDialog':
        this.setState({showWaterPumpOptionsDialog: true});
        break;
    }
  };

  handleClose = (event) => {
    let dialog = event.target.dataset.dialog;
    switch (dialog) {
      case 'dltOpen':
        this.setState({ dltOpen: false });
        break;
      case 'showLightOptionsDialog':
        this.setState({showLightOptionsDialog: false});
        break;
      case 'showHeaterOptionsDialog':
        this.setState({showHeaterOptionsDialog: false});
        break;
      case 'showWaterPumpOptionsDialog':
        this.setState({showWaterPumpOptionsDialog: false});
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
    showWaterPumpOptionsDialog: false,
    showHeaterOptionsDialog: false,
    showLightOptionsDialog: false,
    types: [
      {
        type: 'temp',
        title: 'Room Temparature',
        icon: 'wi wi-night-sleet'
      },
      {
        type: 'humidity',
        title: 'Room Humidity',
        icon: 'wi wi-humidity'
      },
      {
        type: 'ph',
        title: 'Water PH',
        icon: ''
      },
      {
        type: 'ec',
        title: 'Water Conductivity',
        icon: ''
      },
      {
        type: 'temp',
        title: 'Resevoir temperature',
        icon: ''
      },
      {
        type: 'lux',
        title: 'Lux',
        icon: ''
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
    return e ? e.event.value : 'NA';
  }

  render() {
    const style = {
      width: '100%'
    };

    const styles = {
      smallIcon: {
        width: 20,
        height: 20,
      },
    }

    const actions = [
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
      />,
    ];

    var data = {
      name: "light",
      columns: ["time", "value"],
      points: []
    };

    console.log(this.props.events);
    _.each(this.props.events, (value, key, list) => {
      if (!_.isUndefined(value.event.timestamp)) {
        data.points.unshift([value.event.timestamp.getTime(), value.event.value])
      }
    });

    const actionsStyle = {
      width: '100%'
    }

    const left = {
      float: 'left'
    }

    /*
      Todo:
      -[x] give light, heater, and fan their own options dialog.
      -[ ] get iconset for the above.
      -[x] add lux sensor.
      -[ ] show power usage data on the plugs.
      -[ ] show / hide event history.
      -[ ] Round data to 2 decimal places.
    */
    return (
      <div style={style}>
        {
          this.state.types.map((v, k) => {
              return <p key={k}><i className={v.icon}></i>{v.title}: <strong>{this.getEventValue(v.type)}</strong> </p>
          })
        }

        <div className="buttons">
        <div style={left}>
          <h4>Light
            <IconButton
              tooltip="Light options"
              tooltipPosition="top-center"
              onTouchTap={this.handleOpen}
              iconStyle={styles.smallIcon}
              data-dialog="showLightOptionsDialog"
            >
              <SettingsIcon />
            </IconButton>
          </h4>
          <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                backgroundColor="rgb(208, 208, 208)"
                                onTouchTap={this.handleTap}
                                style={this.style}>
            <SvgIcon>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </SvgIcon>
          </FloatingActionButton>
          <Dialog
            title="Light options"
            actions={[
              <FlatButton
                label="Close"
                primary={true}
                data-dialog="showLightOptionsDialog"
                onTouchTap={this.handleClose}
              />
            ]}
            modal={false}
            open={this.state.showLightOptionsDialog}
            data-dialog="showLightOptionsDialog"
            onRequestClose={this.handleClose}>
            <TextField
              hintText="Light threshold"
              data-key="threshold"
              floatingLabelText="Light threshold"
              defaultValue="300"
              onChange={this.handleValueChange}
            />
            <br/>

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
          </Dialog>
        </div>

        <div style={left}>
          <h4>Heater
            <IconButton
              tooltip="Heater options"
              tooltipPosition="top-center"
              onTouchTap={this.handleOpen}
              iconStyle={styles.smallIcon}
              data-dialog="showHeaterOptionsDialog"
            >
              <SettingsIcon />
            </IconButton>
          </h4>
          <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                backgroundColor="rgb(208, 208, 208)"
                                onTouchTap={this.handleTap}
                                style={this.style}>
            <SvgIcon>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </SvgIcon>
          </FloatingActionButton>

          <Dialog
            title="Heater options"
            actions={[
              <FlatButton
                label="Close"
                primary={true}
                data-dialog="showHeaterOptionsDialog"
                onTouchTap={this.handleClose}
              />
            ]}
            modal={false}
            open={this.state.showHeaterOptionsDialog}
            data-dialog="showHeaterOptionsDialog"
            onRequestClose={this.handleClose}>
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
          </Dialog>
        </div>

        <div style={left}>
          <h4>Pump
            <IconButton
              tooltip="Water pump options"
              tooltipPosition="top-center"
              onTouchTap={this.handleOpen}
              data-dialog="showWaterPumpOptionsDialog"
              iconStyle={styles.smallIcon}
            >
              <SettingsIcon />
            </IconButton>
          </h4>
          <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                backgroundColor="rgb(208, 208, 208)"
                                onTouchTap={this.handleTap}
                                style={this.style}>
            <SvgIcon>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </SvgIcon>
          </FloatingActionButton>

          <Dialog
            title="Water pump options"
            actions={[
              <FlatButton
                label="Close"
                primary={true}
                data-dialog="showWaterPumpOptionsDialog"
                onTouchTap={this.handleClose}
              />
            ]}
            modal={false}
            open={this.state.showWaterPumpOptionsDialog}
            data-dialog="showWaterPumpOptionsDialog"
            onRequestClose={this.handleClose}>
            <div>
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
          </Dialog>
        </div>
        </div>

        <Dialog
          title="Are you sure?"
          actions={actions}
          modal={false}
          open={this.state.dltOpen}
          onRequestClose={this.handleClose}
        />
        <br/>
        <div>
          <h4>Event history</h4>
          { 
            this.props.events.map((v, k) => {
              return <p key={k}>{v.event.type}</p>
            })
          }
        </div>
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
  const loading = [ phHandle, tempHandle, ecHandle, humidityHandle, eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const events = Events.find({}).fetch();
  const phEvent = Events.findOne({'event.type': 'ph'});
  const ecEvent = Events.findOne({'event.type': 'ec'});
  const tempEvent = Events.findOne({'event.type': 'temperature'});
  const humidityEvent = Events.findOne({'event.type': 'humidity'});

  return {
    phEvent,
    ecEvent,
    tempEvent,
    humidityEvent,
    events,
    loading
  }
}, GrowHub);
