import React, { Component } from 'react';
import Notifications from '../../api/collections/notifications';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import moment from 'moment';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Subheader from 'material-ui/Subheader';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import WarningIcon from 'material-ui/svg-icons/alert/warning';

const iconList = {
  warning: <WarningIcon />,
}

class NotificationsWidget extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    notificationCount: 0,
  };

  componentDidMount() {
    this.getNotificationCount();
    this.callGetCount();
  }
  getNotificationCount() {
    Notifications.find({'owner._id' : Meteor.userId(), read: false,}).observe({
      added: this.callGetCount,
      removed: this.callGetCount,
    });
  }
  callGetCount = () => {
    setTimeout(() => {
      Meteor.call('Notifications.getCount', (e, r) => {
        if(!e) {
          this.setState({ notificationCount: r });
        }
      });
    });
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
  goToAllNotifications = () => {
    browserHistory.push('/notifications');
  }
  renderBadge (count) {
    return count ? <Badge
      badgeContent={count}
      secondary={true}
      badgeStyle={{top: 5, right: 34, padding: 0}}
    /> : <Badge
      badgeContent={0}
      badgeStyle={{display: 'none'}}
    />
  }

  render() {
    return (
      <span style={{marginRight: -30}}>
        <IconMenu
          iconButtonElement={
            <IconButton tooltip="Notifications" iconStyle={{color: 'white'}}>
              <NotificationsIcon />
            </IconButton>
          }
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <Subheader>{this.props.notifications.length ? "Notifications" : "No new notifications"}</Subheader>
          {
            this.props.notifications.map((v, k) => {
              return <MenuItem primaryText={v.notification}
                key={k}
                disabled={v.read}
                data-id={v._id}
                leftIcon={<WarningIcon />}
                onTouchTap={this.handleRead} />;
            })
          }
          <MenuItem value="all" primaryText="See All Notification" onTouchTap={this.goToAllNotifications}/>
        </IconMenu>
        {this.renderBadge(this.state.notificationCount)}
      </span>
    );
  }
};

NotificationsWidget.propTypes = {
  notifications: React.PropTypes.array,
  ready: React.PropTypes.bool,
}

export default NotificationsWidgetContainer = createContainer(() => {
  const notificationsHandle = Meteor.subscribe('Notifications.all', { limit: 5 });

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
}, NotificationsWidget);
