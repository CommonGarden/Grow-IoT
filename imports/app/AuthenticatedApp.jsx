import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import spacing from 'material-ui/styles/spacing';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import AppNavDrawer from './components/AppNavDrawer';
import ThingsList from './pages/ThingsList.jsx';
import ThingView from './pages/ThingView.jsx';
import LogicView from './pages/LogicView.jsx';
import Profile from './pages/Profile.jsx';
import Camera from './components/Camera.jsx';
import EventHistory from './pages/EventHistory.jsx';
import AllNotifications from './pages/AllNotifications.jsx';
import CreateThing from './components/CreateThing.jsx';
import NotificationsWidget from './components/NotificationsWidget';
import CameraComponent from './components/Camera.jsx';

const title = Meteor.settings.public.title || 'Grow-IoT';
const logo = Meteor.settings.public.logo || '/img/white_flower.png';

class AuthenticatedApp extends Component {

  state = {
    navDrawerOpen: false,
    highlightCreate: false,
  };

  getStyles() {
    const styles = {
      appBar: {
        position: 'fixed',
        top: 0,
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: 356,
      },
      iconButton: {
        color: darkWhite,
      },
      logo: {
        width: 25,
        height: 'auto',
        marginTop: 3
      }
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  }

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  };

  handleChangeRequestNavDrawer = (open) => {
    this.setState({
      navDrawerOpen: open,
    });
  };

  handleChangeList = (event, value) => {
    this.context.router.push(value);
    this.setState({
      navDrawerOpen: false,
    });
  };

  handleChangeMuiTheme = (muiTheme) => {
    this.setState({
      muiTheme: muiTheme,
    });
  };

  handleOpen = () => {
    this.setState({navDrawerOpen: true})
  };

  handleThingsChange = (things) => {
    this.setState({highlightCreate: !things.length});
  };

  goHome = (e) => {
    const rootUrl = this.props.match.url;
    this.props.history.push(`${rootUrl}/things`);
  };

  componentWillMount() {
    document.title = title;
    // Check that the user is logged in before the component mounts
    if (!this.props.user && !Meteor.loggingIn()) {
      this.props.history.push('/public/account');
    }
  }

  // When the data changes, this method is called
  componentDidUpdate(prevProps, prevState) {
    // Now check that they are still logged in. Redirect to sign in page if they aren't.
    if (!this.props.user) {
      this.props.history.push('/public/account');
    }
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const rootUrl = this.props.match.url;
    const styles = this.getStyles();
    return (
      <div>
        <AppBar
          title={<span style={{cursor: 'pointer'}}>{title}</span>}
          onTitleClick={this.goHome}
          iconElementRight={
            <div>
              <NotificationsWidget history={this.props.history} match={this.props.match}/>
              <CreateThing highlight={this.state.highlightCreate}/>
              <IconButton tooltip="Menu"
                tooltipPosition="bottom-left"
                iconStyle={{color: 'white'}}
                onTouchTap={this.handleOpen}>
                <MenuIcon />
              </IconButton>
            </div>
          }
          iconElementLeft={
            <img src={logo} style={styles.logo} />
          }
        />
        <AppNavDrawer
          style={styles.navDrawer}
          location={location}
          docked={false}
          onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
          onChangeList={this.handleChangeList}
          open={this.state.navDrawerOpen}
        />
        <div className="layout vertical flex center center-justified">
          <Switch>
            <Redirect exact from={`${rootUrl}/`} to={`${rootUrl}/things`}/>
            <Route path={`${rootUrl}/things`} render={routeProps=> <ThingsList user={this.props.user} thingsChanged={this.handleThingsChange} {...routeProps}/>}/>
            <Route path={`${rootUrl}/logic`} render={routeProps=> <LogicView user={this.props.user} thingsChanged={this.handleThingsChange} {...routeProps}/>}/>
            <Route path={`${rootUrl}/settings`} render={routeProps=> <Profile user={this.props.user} {...routeProps}/>}/>
            <Route path={`${rootUrl}/thing/:uuid`} render={routeProps => <ThingView user={this.props.user} {...routeProps}/>}/>
            <Route path={`${rootUrl}/events/:uuid`} render={routeProps => <EventHistory user={this.props.user} {...routeProps}/>}/>
            <Route path={`${rootUrl}/notifications`} component={AllNotifications} />
            <Route path={`${rootUrl}/camera`} component={CameraComponent} />
          </Switch>
        </div>
      </div>
    );
  }
}

AuthenticatedApp.propTypes = {
  user: PropTypes.object,
}

export default withWidth()(AuthenticatedAppContainer = createContainer(() => {
  return {
    user: Meteor.user(),
  }
}, AuthenticatedApp));
