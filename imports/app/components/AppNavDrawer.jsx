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

  handleRequestChangeLink = (event, value) => {
    window.location = value;
  };

  handleTouchTapHeader = () => {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

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

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        openSecondary={true}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{zIndex: zIndex.drawer - 100}}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          Grow-IoT
        </div>
        <span style={styles.version}>Version: 0.3.0</span>
        <SelectableList
          value={location.pathname}
          onChange={onChangeList}
        >
          <ListItem
            primaryText="Documentation"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem primaryText="Required Knowledge" value="/get-started/required-knowledge" />,
              <ListItem primaryText="Installation" value="/get-started/installation" />,
              <ListItem primaryText="Connecting devices" value="/get-started/usage" />,
              <ListItem primaryText="Creating custom components (things)" value="/get-started/server-rendering" />,
              <ListItem primaryText="Examples" value="/get-started/examples" />,
            ]}
          />
        </SelectableList>

        <ListItem primaryText="Sign Out" onTouchTap={this.signOut} />

        <Divider />
        <SelectableList
          value=""
          onChange={this.handleRequestChangeLink}
        >
          <Subheader>Resources</Subheader>
          <ListItem primaryText="GitHub Issues" value="https://github.com/callemall/material-ui" />
          <ListItem primaryText="Dev list" value="" />
        </SelectableList>
      </Drawer>
    );
  }
}

export default AppNavDrawer;
