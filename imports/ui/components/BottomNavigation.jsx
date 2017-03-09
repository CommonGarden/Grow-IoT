import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

const signInIcon = <FontIcon className="material-icons"></FontIcon>;
const signUpIcon = <FontIcon className="material-icons"></FontIcon>;

class AccountsBottomNavigation extends Component {
  state = {
    selectedIndex: 0,
  };

  select = (index) => this.setState({selectedIndex: index});

  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Sign In"
            icon={signInIcon}
            onTouchTap={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Sign Up"
            icon={signUpIcon}
            onTouchTap={() => this.select(1)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default AccountsBottomNavigation;
