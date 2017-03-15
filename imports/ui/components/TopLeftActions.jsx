import React, {Component} from 'react';
import CreateThing from './CreateThing.jsx';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export default class TopLeftActions extends Component {
  signOut(e) {
    e.preventDefault();
    // Log out the user and navigate back to the home page on success
    Meteor.logout(this.signOutCallback);
  }

  signOutCallback(error) {
    if (error === undefined) {
      browserHistory.push('/');
    }
  }

  render() {
    return (
      <div>
        <CreateThing/>
        <IconMenu iconButtonElement={
                    <IconButton tooltip="Menu"
                          tooltipPosition="bottom-left">
                    <MoreVertIcon />
                    </IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}} >
          <MenuItem primaryText="Sign out" onClick={this.signOut} />
        </IconMenu>
      </div>
    );
  }
}
