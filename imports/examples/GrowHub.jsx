import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// Not working currently... both ways should be valid for making components.
class GrowHub extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    open: false,
    temp: '50deg',
    ph: '6.4',
    humidity: '60%',
    ec: '100 mS/m',
  };

  handleOpen = () => {
    this.setState({open: true, thingName: ''});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = () => {
    const self = this;
    const name = this.state.thingName;
    Meteor.call('Thing.new', { name }, 
      (error, document) => {
        if (error) {
          throw error;
        } else {
          this.handleClose();
        }
      }
    );
  };
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
        <p>Room Temperature: <strong>{this.getEventValue('temp')}</strong></p>

        <p>Room Humidity: <strong>{this.getEventValue('humidity')}</strong></p>

        <p>Water ph: <strong>{this.getEventValue('ph')}</strong></p>

        <p>Water conductivity: <strong>{this.getEventValue('ec')}</strong></p>

        <IconButton
          onTouchTap={this.handleOpen}
          tooltip="Create Thing"
          tooltipPosition="bottom-left"
          iconStyle={{color: 'white'}}
        >
          <ContentAdd />
        </IconButton> 
        <Dialog
          title="Add New Thing"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="Name of the Thing"
            defaultValue={this.state.thingName}
            onChange={this.nameFieldChange}
          />
        </Dialog>
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
