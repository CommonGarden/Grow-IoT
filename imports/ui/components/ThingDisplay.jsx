import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';


export default class ThingDisplay extends Component {
  deleteThing = () => {
    const thing = this.props.thing;
    Meteor.call('Thing.delete',
      thing.uuid,
      (error, document) => {
        if (error) {
          throw error;
        }
      }
    );
  };
  render () {
    const thingStyle = {
      margin: '20px',
    }

    return (
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
          <FlatButton label="Cancel" onTouchTap={this.deleteThing}/>
        </CardActions>
      </Card>

    )
  }
}
