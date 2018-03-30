import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {spacing, typography, zIndex} from 'material-ui/styles';
import {cyan500} from 'material-ui/styles/colors';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import MailIcon from 'material-ui/svg-icons/content/mail';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import HelpIcon from 'material-ui/svg-icons/action/help';
import FullscreenIcon from 'material-ui/svg-icons/navigation/fullscreen';
import FullscreenExitIcon from 'material-ui/svg-icons/navigation/fullscreen-exit';
import SvgIcon from 'material-ui/SvgIcon';
import Avatar from 'material-ui/Avatar';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import BuildIcon from 'material-ui/svg-icons/action/build';

const SelectableList = makeSelectable(List);

class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  handleClose = () => {
    this.setState({open: false});
  }

  handleRequestChangeLink = (event, value) => {
    let win = window.open(value, '_blank');
    win.focus();
  };

  handleTouchTapHeader = () => {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

  isFunction(fn) {
    return typeof fn === 'function';
  }

  signOut(e) {
    e.preventDefault();
    // Log out the user and navigate back to the home page on success
    Meteor.logout(this.signOutCallback);
  }

  signOutCallback(error) {
    if (error === undefined) {
      this.context.router.push('/');
    }
  }

  render() {
    const {
      location,
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      style,
    } = this.props;

    const styles = {
      logo: {
        cursor: 'pointer',
        fontSize: 24,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: cyan500,
        paddingLeft: spacing.desktopGutter,
        marginBottom: 8,
      },
      version: {
        paddingLeft: spacing.desktopGutterLess,
        fontSize: 16,
      },
    };

    const fsButtonStyle = {
      backgroundColor: 'white',
      color: 'rgba(0, 0, 0, 0.87)',
      display: 'block',
      fontSize: 16,
      lineHeight: '16px',
      outline: '0px',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      padding: '0px',
    };

    const fsIconStyle = _.extend({}, fsButtonStyle, {
      padding: '12px 32px 12px 16px',
    });

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        openSecondary={true}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{zIndex: zIndex.drawer - 100}}
      >
        <SelectableList
          value=""
          onChange={this.handleRequestChangeLink}
        >
          <ListItem primaryText="Logic" value="/red" leftIcon={<BuildIcon />} />
          <ListItem primaryText="Camera" value="/camera" leftIcon={<CameraIcon />} />
          <ListItem primaryText="Issues and Feedback" value="https://github.com/CommonGarden/Grow-IoT/" leftIcon={<FeedbackIcon />} />
          <ListItem primaryText="Settings" value="/app/settings" leftIcon={<SettingsIcon />} />
        </SelectableList>
        <ListItem primaryText="Sign Out" onTouchTap={this.signOut} leftIcon={
          <SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19,3 C20.11,3 21,3.9 21,5 L21,8 L19,8 L19,5 L5,5 L5,19 L19,19 L19,16 L21,16 L21,19 C21,20.1 20.11,21 19,21 L5,21 C3.9,21 3,20.1 3,19 L3,5 C3,3.9 3.9,3 5,3 L19,3 Z M15.5,17 L20.5,12 L15.5,7 L14.09,8.41 L16.67,11 L7,11 L7,13 L16.67,13 L14.09,15.59 L15.5,17 Z"/></svg>
          </SvgIcon>
        } />
    </Drawer>
    );
  }
}

export default AppNavDrawer;
