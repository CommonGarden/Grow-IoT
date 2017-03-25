import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import { Link } from 'react-router'
import Paper from 'material-ui/Paper';


export default class AccountsBottomNavigation extends Component {
  state = {
    selectedIndex: 0,
  };

  select = (index) => {
    this.setState({selectedIndex: index});
    this.props.onTabChange(index); 
  };

  render() {
    const signInIcon = <FontIcon className="material-icons"></FontIcon>;
    const signUpIcon = <FontIcon className="material-icons"></FontIcon>;
    
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
