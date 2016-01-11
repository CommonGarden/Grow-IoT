class Plant.NewComponent extends UIComponent
	@register 'Plant.NewComponent'

	events: ->
		super.concat
			'submit form': (e)->
				# Prevent form submission so it's deferred to our validator.
				e.preventDefault()

	onRendered: ->
		super

		currentEnvironmentUuid = new ComputedField =>
			FlowRouter.getParam 'uuid'

		$('#newPlant').validate
			rules:
				name:
					required: true
			messages:
				name:
					required: "Please give this plant a name."

			submitHandler: ->
				plant =
					name: $('#plantName').val()
					latinName: $('#latinName').val()
					minTemp: $('#minTemp').val()
					maxTemp: $('#maxTemp').val()
					lightRequirements: $('[name="lightRequirements"]').val()
					humidity:	$('[name="humidity"]').val()
					ph: $('#ph').val()

				Meteor.call 'Plant.new',
					plant,
					currentEnvironmentUuid(),
				,
					(error, documentId) =>
						if error
							console.log error
						else
							FlowRouter.go 'Dashboard'

  	# Slider example
  	# $("#ex6").slider()
  	# $("#ex6").on "slide", (slideEvt) ->
  	# 	$("#ex6SliderVal").text(slideEvt.value)

    # Jquery cron examp
  	# $ ($) ->
			# $('#example1').cron({
			#   initial: '42 3 * * 5'
			#   onChange: ->
			#     $('#example1-val').text $(this).cron('value')
			# })

