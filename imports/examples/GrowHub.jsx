import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  state = {
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
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];
    return (
      <div>
        {
          this.state.types.map((v, k) => {
              return <p key={k}>{v.title}: <strong>{this.getEventValue(v.type)}</strong> </p>
          })
        }
      </div>
    )
  }
}

GrowHub.propTypes = {
  ecEvent: React.PropTypes.object,
  phEvent: React.PropTypes.object,
  tempEvent: React.PropTypes.object,
  humidityEvent: React.PropTypes.object,
}

export default GrowHubContainer = createContainer(({ thing }) => {
  const phHandle = Meteor.subscribe('Thing.events', thing.uuid, 'ph', 1);
  const tempHandle = Meteor.subscribe('Thing.events', thing.uuid, 'temperature', 1);
  const ecHandle = Meteor.subscribe('Thing.events', thing.uuid, 'ec', 1);
  const humidityHandle = Meteor.subscribe('Thing.events', thing.uuid, 'humidity', 1);
  const loading = [ phHandle, tempHandle, ecHandle, humidityHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const phEvent = Events.findOne({'event.type': 'ph'});
  const ecEvent = Events.findOne({'event.type': 'ec'});
  const tempEvent = Events.findOne({'event.type': 'temperature'});
  const humidityEvent = Events.findOne({'event.type': 'humidity'});

  return {
    phEvent,
    ecEvent,
    tempEvent,
    humidityEvent,
    loading
  }
}, GrowHub);
