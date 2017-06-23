import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import CameraAlt from 'material-ui/svg-icons/image/camera-alt';
import Visible from 'material-ui/svg-icons/action/visibility';
import NotVisible from 'material-ui/svg-icons/action/visibility-off';
import _ from 'underscore';
// import CreateComponent from './CreateComponent.jsx';
import Components from '../../things/';
import { Row, Col } from 'react-flexbox-grid';
import SvgIcon from 'material-ui/SvgIcon';

export default class ThingDisplay extends Component {
  state = {
    dltOpen: false,
  };

  deleteThing = () => {
    const thing = this.props.thing;
    this.handleClose();
    Meteor.call('Thing.delete',
      thing.uuid,
      (error, document) => {
        if (error) {
          throw error;
        }
      }
    );
  };

  handleOpen = () => {
    this.setState({ dltOpen: true });
  };

  handleClose = () => {
    this.setState({ dltOpen: false });
  };

  render () {
    const thingStyle = {
      // margin: '20px',
      minWidth: '350px'
    }

    const visibilityStyle = {
      padding: 10,
    }

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

    const registered = this.props.thing.registeredAt;
    const unregisteredText = <Card style={thingStyle}>
      <CardText>
        <div>
          <h3>Create a new thing</h3>
          <p>If you purchased a device enter its UUID and Token here, otherwise use these API credentials when you connect your device.</p>
          <TextField
            hintText="Name"
            // errorText="This field is required"
            defaultValue={this.props.thing.uuid}
            floatingLabelText="Name"
            style={thingStyle}
          />
          <br/>
          <TextField
            ref="password"
            // type="password"
            defaultValue={this.props.thing.token}
            onChange={this.passwordChange}
            hintText="Secret"
            style={thingStyle}
            // errorText="This field is required"
            // floatingLabelText={
            //   <em>Secret<Visible/></em>
            // }
          />
        </div>
      </CardText>
      <CardActions>
        <FlatButton label="Submit" onTouchTap={this.handleOpen} />
        <FlatButton label="Cancel" onTouchTap={this.handleOpen} />
      </CardActions>
    </Card>;

    const RegisteredText = Components[this.props.thing.component];
    return (
      <Col xs={12} style={{flexBasis: 'initial'}}>
        {
          registered ? <RegisteredText thing={this.props.thing} actions={
            [ deleteButton ]
          }>
        </RegisteredText>
          : unregisteredText
        }

        <Dialog
          title="Are you sure?"
          actions={actions}
          modal={false}
          open={this.state.dltOpen}
          onRequestClose={this.handleClose}
        />
      </Col>
    )
  }
}
