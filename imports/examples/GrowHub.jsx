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


class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = () => {
    const command = this.props.thing.properties.state === 'on' ? 'turn_off' : 'turn_on';
    this.sendCommand(command);
  };

  handleOpen = () => {
    this.setState({ dltOpen: true });
  };

  handleClose = () => {
    this.setState({ dltOpen: false });
  };

  handleValueChange = (event, newValue) => {
    const uuid = this.props.thing.uuid;
    const key = event.target.dataset.key;
    console.log(key);
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
    types: [
      {
        type: 'temp',
        title: 'Room Temparature',
      },
      {
        type: 'humidity',
        title: 'Room Humidity',
      },
      {
        type: 'ph',
        title: 'Water PH',
      },
      {
        type: 'ec',
        title: 'Water Conductivity',
      },
    ]
  };

  style = {
    'marginRight': '20px',
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
      width: '1200px'
    };

    const actions = [
      <FlatButton
        label="No"
        primary={true}
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
    _.each(this.props.events, (value, key, list) => {
      // console.log(value);
      // needs timestamp...
      if (!_.isUndefined(value.event.timestamp)) {
        data.points.unshift([value.event.timestamp.getTime(), value.event.value])
      }
    });

    // console.log(data);

    /*
      Todo:
      - give light, heater, and fan their own options dialog.
      - get iconset for the above.
      - 

    */
    return (
      <div style={style}>
        {
          this.state.types.map((v, k) => {
              return <p key={k}>{v.title}: <strong>{this.getEventValue(v.type)}</strong> </p>
          })
        }

        <div>Light
          <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                backgroundColor="rgb(208, 208, 208)"
                                onTouchTap={this.handleTap}
                                style={this.style}>
            <SvgIcon>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </SvgIcon>
          </FloatingActionButton>
        </div>

        <div>Heater
          <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                backgroundColor="rgb(208, 208, 208)"
                                onTouchTap={this.handleTap}
                                style={this.style}>
            <SvgIcon>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </SvgIcon>
          </FloatingActionButton>
        </div>

        <div>Pump
          <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
                                backgroundColor="rgb(208, 208, 208)"
                                onTouchTap={this.handleTap}
                                style={this.style}>
            <SvgIcon>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </SvgIcon>
          </FloatingActionButton>
        </div>
        <br/>

        <TextField
          hintText="Light threshold"
          data-key="threshold"
          floatingLabelText="Light threshold"
          defaultValue={this.props.thing.properties.threshold}
          onChange={this.handleValueChange}
        />
        <br/>

        <TextField
          hintText="Day start"
          floatingLabelText="Day start"
          data-key="day"
          defaultValue={this.props.thing.properties.cycles.day.start}
          onChange={this.handleScheduleChange}
        />
        <br/>

        <TextField
          hintText="Night start"
          floatingLabelText="Night start"
          data-key="night"
          defaultValue={this.props.thing.properties.cycles.night.start}
          onChange={this.handleScheduleChange}
        />
        <br/>

        <TextField
          hintText="Log data every (milliseconds)"
          floatingLabelText="Log data every (milliseconds)"
          data-key="interval"
          defaultValue={this.props.thing.properties.interval}
          onChange={this.handleScheduleChange}
        />
        <br/>

        <Dialog
          title="Are you sure?"
          actions={actions}
          modal={false}
          open={this.state.dltOpen}
          onRequestClose={this.handleClose}
        />
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
