import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { createContainer } from 'meteor/react-meteor-data';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

class TestDevice extends Component {
  constructor(props) {
    super(props);
  }

  handleTap = () => {
    const command = this.props.thing.properties.state === 'on' ? 'turn_off' : 'turn_on';
    const uuid = this.props.thing.uuid;
    Meteor.call('Thing.sendCommand',
      uuid,
      command,
      null,
      (error, documentId) => {
        if (error) {
          console.error("Error", error);
          return alert(`Error: ${error.reason || error}`);
        }
      });
  };

  render () {
    const thing = this.props.thing;
    const event = this.props.event;
    const cardStyle = {
      margin: '20px',
    }
    return (
      <Card style={cardStyle}>
        <CardText>

          <h2>Test Device</h2>
          <p>State: {thing.properties.state}</p>
          <p>Temperature: {event ? event.event.message : '-'}</p>
          <RaisedButton onTouchTap={this.handleTap}>
            {this.props.thing.properties.state === 'on' ? 'Off': 'On'}
          </RaisedButton>
        </CardText>
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
    )
  }
}

TestDevice.propTypes = {
  event: PropTypes.object,
  loading: PropTypes.bool,
}

export default TestDeviceContainer = createContainer(({ thing }) => {
  const handle = Meteor.subscribe('Thing.events', thing.uuid, 'temperature');
  const loading = !handle.ready();
  const event = Events.findOne({
    'thing._id': thing._id
  }, {
    sort: { insertedAt: -1 }
  });
  return {
    event,
    loading
  }
}, TestDevice);
