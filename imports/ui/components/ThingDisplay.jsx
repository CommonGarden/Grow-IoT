import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

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

    if (!this.props.thing.registeredAt) {
      return (
        <div>
          <Card style={thingStyle}>
            <CardTitle title={this.props.thing.name} />
            <CardText>
              <p>Connect a device using the following API crendentials or
                <br />
                create a test thing <span ref="loading"></span>
              </p>
              <p><b>UUID:</b></p> <p><span className="selectable">{this.props.thing.uuid}</span></p>
              <p><b>TOKEN:</b></p> <p><span className="selectable">{this.props.thing.token}</span></p>
            </CardText>
            <CardActions>
              <FlatButton label="Cancel" onTouchTap={this.handleOpen}/>
            </CardActions>
          </Card>
          <Dialog
            title="Are you sure?"
            actions={actions}
            modal={false}
            open={this.state.dltOpen}
            onRequestClose={this.handleClose}
          />
        </div>
      )
    } else {
      return (
        <div>
          <Card style={thingStyle}>
            <CardTitle title={this.props.thing.name} />
            <CardText>
              <this.props.thing.component uuid={this.props.thing.uuid} />
            </CardText>
            <CardActions>
              <FlatButton label="Delete" onTouchTap={this.handleOpen}/>
            </CardActions>
          </Card>
          <Dialog
            title="Are you sure?"
            actions={actions}
            modal={false}
            open={this.state.dltOpen}
            onRequestClose={this.handleClose}
          />
        </div>
      )
    }
  }
}
