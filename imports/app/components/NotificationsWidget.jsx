import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Subheader from 'material-ui/Subheader';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import WarningIcon from 'material-ui/svg-icons/alert/warning';

class NotificationsWidget extends Component {
  constructor(props) {
    super(props);
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

  renderBadge (count) {
    if (count !== 0) {
      return <Badge
        badgeContent={count}
        secondary={true}
        badgeStyle={{top: 5, right: 34, padding: 0}}
      />
    } else {
      return <Badge
        badgeContent={count}
        badgeStyle={{display: 'none'}}
      />
    }
  }

  render(){
    let notifications = this.props.notifications;
    let count = 0;
    for (var i = notifications.length - 1; i >= 0; i--) {
      if (notifications[i].read === false) count += 1;
    }

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
          <Subheader>Notifications</Subheader>
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
        </IconMenu>
        {this.renderBadge(count)}
      </span>
    );
  }
};

NotificationsWidget.propTypes = {
  notifications: React.PropTypes.array,
  ready: React.PropTypes.bool,
}

export default NotificationsWidgetContainer = createContainer(() => {
  const notificationsHandle = Meteor.subscribe('Notifications');

  const ready = [ notificationsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  // Todo: get unread notifications.
  const notifications = Notifications.find({}).fetch();

  return {
    ready,
    notifications
  }
}, NotificationsWidget);