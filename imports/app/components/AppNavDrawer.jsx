import React, {Component, PropTypes} from 'react';
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
  state = {
    fullscreen: false,
  }
  componentWillMount () {
    this.addFullscreenEventListener();
    this.setFullscreenState();
  }
  componentWillUnmount () {
    this.removeFullscreenEventListener();
  }
  handleClose = () => {
    console.log('clicked')
    this.setState({open: false});
  }

  handleRequestChangeLink = (event, value) => {
    console.log(event);
    var win = window.open(value, '_blank');
    win.focus();
  };

  handleTouchTapHeader = () => {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };
  handleFullscreenToggle = () => {
    if (this.notFullscreen()) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  addFullscreenEventListener() {
    const handler = this.setFullscreenState;
    if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', handler, false);
      document.addEventListener('mozfullscreenchange', handler, false);
      document.addEventListener('fullscreenchange', handler, false);
      document.addEventListener('MSFullscreenChange', handler, false);
    }
  }
  removeFullscreenEventListener() {
    const handler = this.setFullscreenState;
    if (document.removeEventListener) {
      document.removeEventListener('webkitfullscreenchange', handler, false);
      document.removeEventListener('mozfullscreenchange', handler, false);
      document.removeEventListener('fullscreenchange', handler, false);
      document.removeEventListener('MSFullscreenChange', handler, false);
    }
  }
  notFullscreen() {
    return (document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen);
  }
  isFunction(fn) {
    return typeof fn === 'function';
  }
  setFullscreenState = (fn1, fn2) => {
    if(this.notFullscreen()) {
      this.setState({ fullscreen : false });
    } else {
      this.setState({ fullscreen : true });
    }
  }
  signOut(e) {
    e.preventDefault();
    // Log out the user and navigate back to the home page on success
    Meteor.logout(this.signOutCallback);
  }

  signOutCallback(error) {
    console.log(error);
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
      width: '100%',
      backgroundColor: 'white',
      color: 'rgba(0, 0, 0, 0.87)',
      display: 'block',
      fontSize: 16,
      lineHeight: '16px',
      outline: '0px',
      border: 'none',
      textAlign: 'left',
      cursor: "pointer",
    };
    const fsIconStyle = {
      margin: '12px 24px 12px 16px',
    }
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
          {/* button instead of ListItem to because fullscreen request is not autherized for synthetic events. */}
          <div className="horizontal layout">
            {this.state.fullscreen ? <FullscreenExitIcon style={fsIconStyle} /> : <FullscreenIcon style={fsIconStyle}/>}
            <button onClick={this.handleFullscreenToggle} style={fsButtonStyle} className="flex">
              {this.state.fullscreen ? 'Exit' : 'Go'} Fullscreen 
            </button>
          </div>
          <ListItem primaryText="Issues and Feedback" value="https://github.com/CommonGarden/Grow-IoT/" leftIcon={<FeedbackIcon />} />
          <ListItem primaryText="Dev list" value="https://groups.google.com/a/commongarden.org/forum/#!forum/dev" leftIcon={<MailIcon />}/>
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
