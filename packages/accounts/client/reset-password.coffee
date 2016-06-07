class ResetPasswordComponent extends CommonComponent
	@register 'ResetPasswordComponent'

	onCreated: ->
		super

		if Accounts._resetPasswordToken
			Session.set('resetPassword', Accounts._resetPasswordToken)

	events: ->
		super.concat
			'submit form': (e)->
				# Prevent form submission so it's deferred to our validator.
				e.preventDefault()

	resetPassword: ->
		Session.get('resetPassword')

	onRendered: ->
		super

		$('#recovery-form').validate
			rules:
				emailAddress:
					required: true
					email: true
			messages:
				emailAddress:
					required: "Please enter your email address."
					email: "Please enter a valid email."
			submitHandler: ->
				email = $('#recovery-email').val()
				Accounts.forgotPassword { email: email }, (err) ->
					if err
						Session.set 'displayMessage', 'Password Reset Error'
					else
						Session.set 'displayMessage', 'Email Sent &amp; Please check your email.'

		$('#new-password').validate
			rules:
				newPassword:
					required: true
			messages:
				newPassword:
					required: "Please enter a password."
			submitHandler: ->
				pw = $('#new-password-password').val()
				Accounts.resetPassword Session.get('resetPassword'), pw, (err) ->
					if err
						Session.set 'displayMessage', 'Password Reset Error'
					else
						Session.set 'resetPassword', null
