import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import CameraAlt from 'material-ui/svg-icons/image/camera-alt';
import _ from 'underscore';
import CreateComponent from './CreateComponent.jsx';
import Components from '../../things/';
import { Row, Col } from 'react-flexbox-grid';

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
      margin: '20px',
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
    const deleteButton =  <FlatButton label="Delete" onTouchTap={this.handleOpen} key={1}/> ;
    const unregisteredText = <Card style={thingStyle}>
      <CardText>
        <div>
          <p>Connect a device using the following API crendentials or create a component instead.</p>
          <p><b>UUID:</b></p> <p><span className="selectable">
            {this.props.thing.uuid}
          </span></p>
          <p><b>TOKEN:</b></p> <p><span className="selectable">{this.props.thing.token}</span></p>
        </div>
      </CardText>
      <CardActions>
        <CreateComponent uuid={this.props.thing.uuid} token={this.props.thing.token} /> 
        {
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
