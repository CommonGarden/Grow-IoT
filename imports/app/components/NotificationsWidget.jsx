import React from 'react';
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

// TODO: drop down list of notifications.
const NotificationsWidget = () => (
  <span>
    <IconButton tooltip="Notifications" iconStyle={{color: 'white'}}>
      <NotificationsIcon />
    </IconButton>
    <Badge
      badgeContent={10}
      secondary={true}
      badgeStyle={{top: 5, right: 34, padding: 0}}
    />
  </span>
);

export default NotificationsWidget;
