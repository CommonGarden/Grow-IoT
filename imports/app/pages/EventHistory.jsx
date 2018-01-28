import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import ThingDisplay from '../components/ThingDisplay.jsx';
import EmptyState from '../components/EmptyState.jsx';


class ThingView extends Component {
  state = {
    loading: false,
  }

  componentWillMount() {
    this.subThings();
  }

  componentWillReceiveProps(nextProps) {
  }

  subThings(){
    this.setState({ loading: true });
    Meteor.subscribe('Things.one', this.props.match.params.uuid, (h) => {
      this.setState({ loading: false });
    });
  }

  renderEvents() {
                  this.props.events.map((v, k) => {
                    return <TableRow key={k}>
                      <TableRowColumn>{v.event.type}</TableRowColumn>
                      <TableRowColumn>{typeof v.event.message === 'string' ? v.event.message: ""}</TableRowColumn>
                      <TableRowColumn>{moment(v.event.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</TableRowColumn>
                    </TableRow>
                  })

  }

  render () {
    return (
      this.state.loading ? <CircularProgress size={80} thickness={5} style={styles.circProg} /> : this.renderEvents()
    )
  }
}

EventHistory.PropTypes = {
    events: PropTypes.object,
    ready: PropTypes.boolean
}

export default EventHistoryContainer= createContainer(({ user, uuid }) => {
  const eventsHandle = Meteor.subscribe('Thing.events', uuid);
  const ready = [ eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const events = Events.find({'thing.uuid': uuid,}, {limit: 20, sort: { insertedAt: -1 }}).fetch();

  return {
    events: events,
  }
}, EventHistory);
