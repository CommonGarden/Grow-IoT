class AccountPageComponent extends CommonComponent
	@register 'AccountPageComponent'

	onCreated: ->
	  super

	events: ->
		super.concat
			'submit form': (e)->
				# Prevent form submission so it's deferred to our validator.
				e.preventDefault()

	onRendered: ->
		super

		$('#change-password').validate
			rules:
				oldPassword:
					required: true
				newPassword:
					required: true
			messages:
				oldPassword:
					required: "Please enter your current password."
				newPassword:
					required: "Please enter a new password."

			submitHandler: ->
				oldPw = $('#old-password-password').val()
				newPw = $('#new-password-password').val()
				Accounts.changePassword oldPw, newPw, (err) ->
					if err
						Session.set 'displayMessage', 'Password Reset Error'
					else
						Bert.alert 'Password reset successful.', 'success', 'growl-top-right'
						FlowRouter.go 'Dashboard'
