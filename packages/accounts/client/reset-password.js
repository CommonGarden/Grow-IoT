class ResetPasswordComponent extends CommonComponent {
	onCreated() {
		super.onCreated();

		if (Accounts._resetPasswordToken) {
			return Session.set('resetPassword', Accounts._resetPasswordToken);
		}
	}

	events() {
		return super.events().concat({
			['submit form'](e){
				// Prevent form submission so it's deferred to our validator.
				return e.preventDefault();
			}
		});
	}

	resetPassword() {
		return Session.get('resetPassword');
	}

	onRendered() {
		super.onRendered();

		$('#recovery-form').validate({
			rules: {
				emailAddress: {
					required: true,
					email: true
				}
			},
			messages: {
				emailAddress: {
					required: "Please enter your email address.",
					email: "Please enter a valid email."
				}
			},
			submitHandler() {
				let email = $('#recovery-email').val();
				return Accounts.forgotPassword({ email }, function(err) {
					if (err) {
						return Session.set('displayMessage', 'Password Reset Error');
					} else {
						return Session.set('displayMessage', 'Email Sent &amp; Please check your email.');
					}
				});
			}
		});

		return $('#new-password').validate({
			rules: {
				newPassword: {
					required: true
				}
			},
			messages: {
				newPassword: {
					required: "Please enter a password."
				}
			},
			submitHandler() {
				let pw = $('#new-password-password').val();
				return Accounts.resetPassword(Session.get('resetPassword'), pw, function(err) {
					if (err) {
						return Session.set('displayMessage', 'Password Reset Error');
					} else {
						return Session.set('resetPassword', null);
					}
				});
			}
		});
	}
}

ResetPasswordComponent.register('ResetPasswordComponent');
