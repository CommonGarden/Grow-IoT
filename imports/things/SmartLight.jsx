import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import _ from 'underscore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SvgIcon from 'material-ui/SvgIcon';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class SmartLight extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = () => {
    const command = this.props.thing.properties.state === 'on' ? 'turn_off' : 'turn_on';
    this.sendCommand(command);
  };

  sendCommand = (command, options) => {
    const uuid = this.props.thing.uuid;
    Meteor.call('Thing.sendCommand',
      uuid,
      command,
      options,
      (error, documentId) => {
        if (error) {
          console.error("Error", error);
          return alert(`Error: ${error.reason || error}`);
        }
      }
    );
  };

  setProperty = (key, value) => {
    const command = 'setProperty';
    const options = {
      key: key,
      value: value
    };
    this.sendCommand(command, options);
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
  renderContent() {
    const thing = this.props.thing;
    const event = this.props.event;
    const events = this.props.data;

    const series = new TimeSeries(events);
    const width = 400;
    return (
      <div>
        <ChartContainer timeRange={series.range()} width={width}>
          <ChartRow height="150">
            <YAxis
              id="light"
              label="Light"
              min={series.min()} max={series.max()}
              width="60" />
            <Charts>
              <LineChart axis="light" series={series} />
            </Charts>
          </ChartRow>
        </ChartContainer>
        <h3>Light reading: {event ? event.event.value : '-'}</h3>

        <h4>Light: {thing.properties.state}</h4>
        <FloatingActionButton secondary={this.props.thing.properties.state === 'on' ? true: false}
          backgroundColor="rgb(208, 208, 208)"
          onTouchTap={this.handleTap}>
          <SvgIcon>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </SvgIcon>
        </FloatingActionButton>
        <br/>

        <TextField
          hintText="Light threshold"
          data-key="threshold"
          floatingLabelText="Light threshold"
          defaultValue={thing.properties.threshold}
          onChange={this.handleValueChange}
        />
        <br/>

        <TextField
          hintText="Day start"
          floatingLabelText="Day start"
          data-key="day"
          defaultValue={thing.properties.cycles.day.start}
          onChange={this.handleScheduleChange}
        />
        <br/>

        <TextField
          hintText="Night start"
          floatingLabelText="Night start"
          data-key="night"
          defaultValue={thing.properties.cycles.night.start}
          onChange={this.handleScheduleChange}
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
      </div>
    );
  }
  render () {
    const events = this.props.data;
    const cardStyle = {
      margin: '20px',
    }
    return (
      <Card style={cardStyle}>
        <CardText>
          {
            (this.props.loading || !!!events.points[0]) ? <div><CircularProgress /> Loading</div> : this.renderContent()
          }
        </CardText>
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
    )
  }
}

SmartLight.propTypes = {
  event: PropTypes.object,
  loading: PropTypes.bool,
  data: PropTypes.object,
}

export default SmartLightContainer = createContainer(({ thing }) => {
  const handle = Meteor.subscribe('Thing.events', thing.uuid, 'light');
  const loading = !handle.ready();
  // don't need multiple queries when one will do.
  const event = Events.findOne({
    'thing._id': thing._id
  }, {
    sort: { insertedAt: -1 }
  });
  
  const events = Events.find({
    'thing._id': thing._id
  }, {
    sort: { insertedAt: -1 }
  }).fetch();
  
  const data = {
    name: "light",
    columns: ["time", "value"],
    points: []
  };
  _.each(events, (value, key, list) => {
    data.points.unshift([value.event.timestamp.getTime(), value.event.message])
  });
  return {
    data,
    event,
    loading
  }
}, SmartLight);
