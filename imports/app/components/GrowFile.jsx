import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import PropTypes from 'prop-types';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Subheader from 'material-ui/Subheader';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import StartIcon from 'material-ui/svg-icons/av/play-arrow';
import StopIcon from 'material-ui/svg-icons/av/stop';
import SkipIcon from 'material-ui/svg-icons/av/skip-next';
import PreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class GrowFile extends Component {
  constructor(props) {
    super(props);
  }

  handleOpen = (event) => {
    this.setState({settingsDialogOpen: true});
  }

  handleClose = (event) => {
    this.setState({settingsDialogOpen: false});
  }

  state = {
    settingsDialogOpen: false,
  };

  render() {
    return <div>
      <div>
        <IconButton
          tooltip="Options"
          tooltipPosition="top-center"
          onTouchTap={this.handleOpen}>
          <PreviousIcon />
        </IconButton>
        <IconButton
          tooltip="Start Growfile"
          tooltipPosition="top-center"
          onTouchTap={this.handleOpen}>
          <StartIcon />
        </IconButton>
        <IconButton
          tooltip="Next phase"
          tooltipPosition="top-center"
          onTouchTap={this.handleOpen}>
          <SkipIcon />
        </IconButton>
      </div>
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
              hintText="Insert valid Growfile JSON"
              errorText="This field is required."
              floatingLabelText="Growfile"
              id="Growfile"
              ref="Growfile"
              defaultValue={JSON.stringify(this.props.growfile, null, 2)}
              onChange = {this.handleGrowfileChange}
              multiLine={true}
              style={{width: '100%'}}
              rows={10}
            />
            <RaisedButton label="Update Growfile" primary={true} onTouchTap={this.updateGrowfile}/>
          </Dialog>
    </div>
  }
};

GrowFile.propTypes = {
   growfile: PropTypes.object,
   ready: PropTypes.bool,
}
