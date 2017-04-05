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
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

// TODO: list of notifications, also 'mark as read functionality'
const NotificationsWidget = () => (
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
      <MenuItem primaryText="pH low" leftIcon={<WarningIcon />} />
    </IconMenu>
        <Badge
      badgeContent={10}
      secondary={true}
      badgeStyle={{top: 5, right: 34, padding: 0}}
    />
  </span>
);

export default NotificationsWidget;
