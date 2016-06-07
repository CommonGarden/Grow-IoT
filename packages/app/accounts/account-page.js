class AccountPageComponent extends CommonComponent {
	onCreated() {
	  return super.onCreated();
	}

	events() {
		return super.events().concat({
			['submit form'](e){
				// Prevent form submission so it's deferred to our validator.
				return e.preventDefault();
			}
		});
	}

	onRendered() {
		super.onRendered();

		return $('#change-password').validate({
			rules: {
				oldPassword: {
					required: true
				},
				newPassword: {
					required: true
				}
			},
			messages: {
				oldPassword: {
					required: "Please enter your current password."
				},
				newPassword: {
					required: "Please enter a new password."
				}
			},

			submitHandler() {
				let oldPw = $('#old-password-password').val();
				let newPw = $('#new-password-password').val();
				return Accounts.changePassword(oldPw, newPw, function(err) {
					if (err) {
						return Session.set('displayMessage', 'Password Reset Error');
					} else {
						Bert.alert('Password reset successful.', 'success', 'growl-top-right');
						return FlowRouter.go('Dashboard');
					}
				});
			}
		});
	}
}

AccountPageComponent.register('AccountPageComponent');

