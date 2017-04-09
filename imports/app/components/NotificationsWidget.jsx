import React, { Component } from 'react';
import Notifications from '../../api/collections/notifications';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

// Probably don't need all of these.
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

const iconList = {
  warning: <WarningIcon />,
}

class NotificationsWidget extends Component {
  state = {
    loading: false,
    notificationCount: 0,
  };

  componentWillMount() {
    this.subNotifications();
    this.getNotificationCount();
  }
  getNotificationCount() {
    Notifications.find({owner : Meteor.userId()}).observe({
      added: this.callGetCount,
      removed: this.callGetCount,
    });
  }
  callGetCount = () => {
    Meteor.call('Notifications.getCount', (e, notificationCount) => {
      if(!e) {
        this.setState({ notificationCount });
      }
    });
  }
  subNotifications(){
    this.setState({ loading: true });
    Meteor.subscribe('Notifications.all', {limit: 5}, (h) => {
      this.setState({ loading: false });
    });
  }
  render() {
    return (
      <span>
        <IconMenu
          iconButtonElement={
            <IconButton tooltip="Notifications" iconStyle={{color: 'white'}}>
              <NotificationsIcon />
            </IconButton>
          }
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          {
            this.props.notifications.length ? _.map(this.props.notifications, function(n, i){
              // TODO secondary text style. or use dialog and list instead of iconMenu
              return <MenuItem
                key={i}
                primaryText={n.message}
                secondaryText={moment(n.timestamp).calendar()}
                leftIcon={iconList[n.type || 'warning']} />
            }) : <MenuItem value="go" primaryText="No new notifications" />
          }
          <Divider />
          <MenuItem value="go" primaryText="See All Notification" />
        </IconMenu>
        <Badge
          badgeContent={this.state.notificationCount}
          secondary={true}
          badgeStyle={{top: 5, right: 34, padding: 0}}
        />
      </span>
    )
  }
};

NotificationsWidget.PropTypes = {
  notifications: React.PropTypes.array,
}

export default NotificationsWidgetContainer= createContainer(() => {
  const owner = Meteor.userId();
  const notifications = Notifications.find({ owner }).fetch();
  return {
    notifications,
  }
}, NotificationsWidget);
