class Thing.NewComponent extends UIComponent
	@register 'Thing.NewComponent'

	onCreated: ->
		super

		@currentEnvironmentUuid = new ComputedField =>
			FlowRouter.getParam 'uuid'

		@subscribe 'Environment.one', @currentEnvironmentUuid()

	events: ->
		super.concat
			'submit form': (e)->
				# Prevent form submission so it's deferred to our validator.
				e.preventDefault()

	onRendered: ->
		super

		currentEnvironmentUuid = new ComputedField =>
			FlowRouter.getParam 'uuid'

		$('#newThing').validate
			rules:
				name:
					required: true
			messages:
				name:
					required: "Please give this thing a name."

			submitHandler: ->
				thing =
					name: $('#plantName').val()

				Meteor.call 'Thing.new',
					thing,
					currentEnvironmentUuid(),
				,
					(error, documentId) =>
						if error
							console.log error
						else
							params = { uuid: currentEnvironmentUuid() }
							path = FlowRouter.path('Environment.DisplayComponent', params)
							FlowRouter.go path

  	# Slider example
  	# $("#ex6").slider()
  	# $("#ex6").on "slide", (slideEvt) ->
  	# 	$("#ex6SliderVal").text(slideEvt.value)
