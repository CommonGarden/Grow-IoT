class GrowFileCreatorComponent extends UIComponent
  @register 'GrowFileCreatorComponent'

  onCreated: ->
  	super

  onRendered: ->
  	super

  	$ ($) ->
			$('#example1').cron({
			  initial: '42 3 * * 5'
			  onChange: ->
			    $('#example1-val').text $(this).cron('value')
			})

