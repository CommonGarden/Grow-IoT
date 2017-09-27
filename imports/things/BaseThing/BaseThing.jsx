import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { TimeSeries, TimeRange, Event } from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable } from "react-timeseries-charts";
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


// Work in progress. This class contains useful methods for making things.
export default class BaseThing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

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

  getEventValue(type) {
    const e = this.props[`${type}Events`];
    if (e) {
      return e[0] ? Number(e[0].event.message).toFixed(2) : 'NA';
    }
  }

  onlineSince () {
    const onlineSince = this.props.thing.onlineSince || false;

    if (!this.props.thing.onlineSince) {
      return <span>Offline</span>
    } else {
      return <span></span>
    }
  }

  sendCommand = (command, options) => {
    Meteor.call('Thing.sendCommand',
      this.props.thing.uuid,
      command,
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

  updateGrowfile = (file) => {
    try {
      let growfile = file || JSON.parse(document.getElementById('Growfile').value);
      this.setProperty('growfile', growfile);
      this.sendCommand('restart');
    } catch (err) {
      alert(err);
    }
  }
}



