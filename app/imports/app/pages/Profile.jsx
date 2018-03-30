import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
  	old: '',
  	new_1: '',
  	new_2: ''
  }

  handleChange(event, newValue) {
  	console.log(event)
  	console.log(newValue)
  }

  handleSubmit() {
    // const profile = {
    //   emailAddress: this.emailAddress.value,
    //   profile: {
    //     name: {
    //       first: this.firstName.value,
    //       last: this.lastName.value,
    //     },
    //   },
    // };

    alert('Not implemented, see https://github.com/CommonGarden/Grow-IoT/issues/382')

    // if (this.newPassword.value) {
    //   Accounts.changePassword(this.currentPassword.value, this.newPassword.value, (error) => {
    //     if (error) {
    //       alert(error.reason, 'danger');
    //     } else {
    //       this.currentPassword.value = '';
    //       this.newPassword.value = '';
    //     }
    //   });
    // }
  }

  render() {
    const { loading, user } = this.props;
    return (
      <div>
      	<h1>Settings</h1>
	    <TextField
          hintText="Old password"
          floatingLabelText="Old password"
          data-key="old"
          type="password"
        />
        <br />
        <TextField
          hintText="New password"
          floatingLabelText="New password"
          data-key="new_1"
          type="password"
        />
        <br />
        <TextField
	      hintText="Repeat new password"
	      floatingLabelText="Repeat new password"
	      data-key="new_2"
	      type="password"
	    />
        <br />
        <RaisedButton label="Change Password" primary={true} onTouchTap={this.handleSubmit}/>

      </div>
    );
  }
}

export default Profile;
