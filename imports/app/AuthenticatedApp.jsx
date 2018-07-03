import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import ThingsList from './pages/ThingsList.jsx';
import ThingView from './pages/ThingView.jsx';
import EnvironmentsList from './pages/EnvironmentsList.jsx';
import EnvironmentsView from './pages/EnvironmentsView.jsx';
import Profile from './pages/Profile.jsx';
import Camera from './components/Camera.jsx';
import EventHistory from './pages/EventHistory.jsx';
import AllNotifications from './pages/AllNotifications.jsx';
import CreateThing from './components/CreateThing.jsx';
import NotificationsWidget from './components/NotificationsWidget';
import CameraComponent from './components/Camera.jsx';

const title = Meteor.settings.public.title || 'Grow-IoT';
class AuthenticatedApp extends Component {
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
    return (
      <Switch>
        <Redirect exact from={`${rootUrl}/`} to={`${rootUrl}/things`}/>
        <Route path={`${rootUrl}/things`} render={routeProps=> <ThingsList user={this.props.user} thingsChanged={this.handleThingsChange} {...routeProps}/>}/>
        <Route path={`${rootUrl}/environments`} render={routeProps=> <EnvironmentsList user={this.props.user} thingsChanged={this.handleThingsChange} {...routeProps}/>}/>
        <Route path={`${rootUrl}/settings`} render={routeProps=> <Profile user={this.props.user} {...routeProps}/>}/>
        <Route path={`${rootUrl}/thing/:uuid`} render={routeProps => <ThingView user={this.props.user} {...routeProps}/>}/>
        <Route path={`${rootUrl}/environment/:uuid`} render={routeProps => <EnvironmentView user={this.props.user} {...routeProps}/>}/>
        <Route path={`${rootUrl}/events/:uuid`} render={routeProps => <EventHistory user={this.props.user} {...routeProps}/>}/>
        <Route path={`${rootUrl}/notifications`} component={AllNotifications} />
        {/* <Route path={`${rootUrl}/camera`} component={CameraComponent} /> */}
      </Switch>
    );
  }
}

AuthenticatedApp.propTypes = {
  user: PropTypes.object,
}

export default AuthenticatedAppContainer = createContainer(() => {
  return {
    user: Meteor.user(),
  }
}, AuthenticatedApp);
