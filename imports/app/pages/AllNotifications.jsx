import React, { Component } from 'react';
import Notifications from '../../api/collections/notifications';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';


class AllNotifications extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    limit: 20,
    skip: 0,
  }

  handleLoadMore = () => {
    const skip = this.state.skip + 20;
    const limit = this.state.limit;
    Meteor.subscribe('Notifications.all', { limit, skip });
    this.setState({ skip });
  }

  handleRead (event) {
    event.preventDefault();
    let id = event.currentTarget.dataset.id;
    Meteor.call('Notifications.read',
      id,
      (error, documentId) => {
        if (error) {
          console.error("Error", error);
          return alert(`Error: ${error.reason || error}`);
        }
      }
    );
  }

  render() {
    const cardStyle = {
      margin: 20,
      padding: 20,
      textAlign: 'center',
    };
    return (
      <Paper zDepth={1} style={cardStyle}>
        <h2> All Notifications </h2>
        <List>
          {
            this.props.notifications.map((v, k) => {
              return <MenuItem primaryText={v.notification}
                key={k}
                disabled={v.read}
                data-id={v._id}
                leftIcon={
                    <WarningIcon />
                }
                onTouchTap={this.handleRead} />;
            })
          }
        </List>
        {
          this.props.ready ? '' : <div>Loading..</div>
        }
        <RaisedButton label="Load More" primary={true} onTouchTap={this.handleLoadMore}/>
      </Paper>
    )
  }
}

AllNotifications.propTypes = {
  notifications: PropTypes.array,
  ready: PropTypes.bool,
}

export default NotificationsWidgetContainer = createContainer(() => {
  const notificationsHandle = Meteor.subscribe('Notifications.all', { limit: 20 });

  const ready = [ notificationsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  // Todo: get unread notifications.
  const notifications = Notifications.find({}, { sort: { timestamp: -1 } }).fetch();

  return {
    ready,
    notifications
  }
}, AllNotifications);
