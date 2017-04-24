import React, { Component } from 'react';
import Notifications from '../../api/collections/notifications';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import RaisedButton from 'material-ui/RaisedButton';

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
              return <ListItem primaryText={v.notification}
                key={k}
                disabled={v.read}
                data-id={v._id}
                leftIcon={
                  <span>
                    { k + 1 }
                  </span>
                }
                rightIcon={
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
  notifications: React.PropTypes.array,
  ready: React.PropTypes.bool,
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
