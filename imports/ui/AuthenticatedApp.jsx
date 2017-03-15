import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import ThingsList from './pages/ThingsList.jsx';
import TopLeftActions from './components/TopLeftActions.jsx';


class AuthenticatedApp extends Component {
  componentWillMount() {
    document.title = "Grow IoT";
    // Check that the user is logged in before the component mounts
    if (!this.props.user && !Meteor.loggingIn()) {
      browserHistory.push('/account');
    }
  }

  // When the data changes, this method is called
  componentDidUpdate(prevProps, prevState) {
    // Now check that they are still logged in. Redirect to sign in page if they aren't.
    if (!this.props.user) {
      browserHistory.push('/account');
    }
  }

  render() {
    const actions = <TopLeftActions/>;

    // Todo: flower icon. ; )
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Grow-IoT"
            iconElementRight={actions}
            iconStyleLeft={{
              display: 'none'
            }}
          />
          <div className="layout vertical flex center center-justified">
          </div>
          <ThingsList user={this.props.user}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

AuthenticatedApp.propTypes = {
  user: React.PropTypes.object,
}

export default AuthenticatedAppContainer = createContainer(() => {
  return {
    user: Meteor.user(),
  }
}, AuthenticatedApp);