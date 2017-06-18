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
import CreateComponent from './CreateComponent.jsx';
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


  // QrIcon = (props) => (
  //   <SvgIcon {...props}>
  //       <path d="M3,3 h8 v8 h-8 v-8 z M6,7 h2"/>
  //       <path d="M18,3 h-3 v4 h2 v4 h-2 v3" />
  //       <path d="M2,15 h2 m2,0 h4 m6,0 h2 m2,0 h4 m4,0 h2"/>
  //       <path d="M4,17 h2 m2,0 h8 m6,0 h2 m2,0 h4" />
  //       <path d="M14,19 h2 m2,0 h2 m6,0 h2" />
  //       <path d="M16,21 h2 m2,0 h8"/> 
  //       <path d="M14,23 h2 m2,0 h2 m4,0 h2 m2,0 h2" />
  //       <path d="M14,25 h4 m2,0 h2 m2, 0 h4" />
  //       <path d="M14,27 h2 m6,0 h2 m4,0 h2" />
  //       <path d="M16,29 h8 m2,0 h2"/>
  //   </SvgIcon>
  // );

  render () {
    const thingStyle = {
      margin: '20px',
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
    const submitButton =  <FlatButton label="Submit" onTouchTap={this.handleOpen} key={1}/> ;
    const deleteButton =  <FlatButton label="Cancel" onTouchTap={this.handleOpen} key={1}/> ;
    const unregisteredText = <Card style={thingStyle}>
      <CardText>
        <div>
          <h3>Create a new thing</h3>
          <p><a href="#">Scan QR code</a></p>
          <TextField
            hintText="Name"
            errorText="This field is required"
            floatingLabelText="Name"
          />
          <br/>
          <TextField
            ref="password"
            type="password"
            defaultValue={this.props.thing.token}
            onChange={this.passwordChange}
            hintText="Secret"
            // errorText="This field is required"
            floatingLabelText={
              <em>Secret<Visible/></em>
            }
          />
        </div>
      </CardText>
      <CardActions>
        <CreateComponent uuid={this.props.thing.uuid} token={this.props.thing.token} /> 
        {
          submitButton,
          deleteButton
        }
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
