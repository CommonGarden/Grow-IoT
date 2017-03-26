import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import ThingsList from './pages/ThingsList.jsx';
import AppNavDrawer from './components/AppNavDrawer';
import spacing from 'material-ui/styles/spacing';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';
import CreateThing from './components/CreateThing.jsx';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


class AuthenticatedApp extends Component {

  state = {
    navDrawerOpen: false,
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
  }

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
    // const actions = <TopLeftActions/>;
    const styles = this.getStyles();

    // Todo: flower icon. ; )
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Grow-IoT"
            iconElementRight={
              <div>
                <CreateThing />
                <IconButton tooltip="Menu"
                            tooltipPosition="bottom-left"
                            iconStyle={{color: 'white'}}
                            onTouchTap={this.handleOpen}>
                  <MenuIcon />
                </IconButton>
              </div>
            }
            iconStyleLeft={{
              display: 'none'
            }}
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
            <ThingsList user={this.props.user}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

AuthenticatedApp.propTypes = {
  user: React.PropTypes.object,
}

export default withWidth()(AuthenticatedAppContainer = createContainer(() => {
  return {
    user: Meteor.user(),
  }
}, AuthenticatedApp));