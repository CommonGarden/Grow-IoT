import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import { Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';

class Log extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    message: ''
  }

  handleChange = (event, value) => {
    this.setState({message:value});
  }

  log = () => {
    Meteor.call('Thing.emit',
      {
        uuid: this.props.thing.uuid,
        token: this.props.thing.token
      },
      this.state.message,
      (error, document) => {
        if (error) {
          throw error;
        } else {
          console.log('Success');
        }
      }
    );
  }

  render () {
    return (
      <Card style={{padding:10}}>
        <h1>Logs</h1>
        <TextField
          hintText="Log message"
          floatingLabelText="Log message"
          data-key="interval"
          onChange={this.handleChange}
        />
        <RaisedButton label="Log" primary={true} onTouchTap={this.log}/>
        {
          this.props.ready ? this.props.events.map((v, k) => {
            return <TableRow key={k}>
              <TableRowColumn>{typeof v.event === 'string' ? v.event: ""}</TableRowColumn>
              <TableRowColumn>{moment(v.event.insertedAt).format('MMMM Do YYYY, h:mm:ss a')}</TableRowColumn>
            </TableRow>
          }): <CircularProgress />
        }
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
    )
  }
}

Log.propTypes = {
    events: PropTypes.array,
    ready: PropTypes.bool
}

export default LogContainer= createContainer((props) => {
  const uuid = props.thing.uuid;
  const thing = Things.findOne({ uuid: uuid });
  console.log(thing);
  const eventsHandle = Meteor.subscribe('Thing.events', uuid);
  const ready = [ eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const events = Events.find({}, {limit: 20, sort: { insertedAt: -1 }}).fetch();

  return {
    events: events,
    ready: ready
  }
}, Log);
