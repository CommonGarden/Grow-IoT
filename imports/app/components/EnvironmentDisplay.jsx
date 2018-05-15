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
import { Row, Col } from 'react-flexbox-grid';
import SvgIcon from 'material-ui/SvgIcon';
import CircularProgress from 'material-ui/CircularProgress';


export default class EnvironmentDisplay extends Component {
  state = {
    dltOpen: false,
  };

  deleteEnvironment = () => {
    const environment = this.props.environment;
    this.handleClose();
    Meteor.call('Environment.delete',
      environment.uuid,
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
    const environmentStyle = {
      // margin: '20px',
      // minWidth: '350px'
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
        onTouchTap={this.deleteEnvironment}
      />,
    ];

    const registered = this.props.registeredAt;
    const deleteButton = <FlatButton label="Delete" onTouchTap={this.handleOpen} key={1}/> ;
    const unregisteredText = <Card style={environmentStyle}>
      <CardText>
        <div>
          <h3>Waiting for environment to connect</h3>
          <br/>
          <CircularProgress />
          <p>uuid: <span className="selectable">{this.props.environment.uuid}</span></p>
          <p>token: <span className="selectable">{this.props.environment.token}</span></p>
        </div>
      </CardText>
      <CardActions>
        <FlatButton label="Cancel" onTouchTap={this.handleOpen} />
      </CardActions>
    </Card>;

    return (
      <Col xs={12} style={{flexBasis: 'initial'}}>
        {
          registered ? <RegisteredText environment={this.props.environment} actions={
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
