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

class EventHistory extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <h1>Event History</h1>
        {
          this.props.ready ? this.props.events.map((v, k) => {
            return <TableRow key={k}>
              <TableRowColumn>{v.event.type}</TableRowColumn>
              <TableRowColumn>{typeof v.event.message === 'string' ? v.event.message: ""}</TableRowColumn>
              <TableRowColumn>{moment(v.event.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</TableRowColumn>
            </TableRow>
          }): <CircularProgress />
        }
      </div>
    )
  }
}

EventHistory.propTypes = {
    events: PropTypes.array,
    ready: PropTypes.bool
}

export default EventHistoryContainer= createContainer((props) => {
  const uuid = props.match.params.uuid;
  const thing = Things.findOne({ uuid: uuid });
  const eventsHandle = Meteor.subscribe('Thing.events', uuid);
  const ready = [ eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const events = Events.find({}, {limit: 200, sort: { insertedAt: -1 }}).fetch();

  return {
    events: events,
    ready: ready
  }
}, EventHistory);
