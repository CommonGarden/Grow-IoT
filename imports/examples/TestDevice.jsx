import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { createContainer } from 'meteor/react-meteor-data';

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class TestDevice extends Component {
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
    return (
      <div>
        <h2>Test Device</h2>
        <p>State: {thing.properties.state}</p>
        <p>Temperature: {event ? event.event.value : '-'}</p>
        <RaisedButton onTouchTap={this.handleTap}>
          {this.props.thing.properties.state === 'on' ? 'Off': 'On'}
        </RaisedButton>
      </div>
    )
  }
}
TestDevice.propTypes = {
  event: React.PropTypes.object,
  loading: React.PropTypes.bool,
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
