class Device.VisualizationComponent extends UIComponent
  @register 'Device.VisualizationComponent'

  onCreated: ->
  	super

  	# Perhaps all visualization components can eventually inherit from this class
  	# then real time visualization can become a package of it's own.

  	templateData = Template.currentData()
  	@chartType = templateData.chartType
  	if @chartType == "line"
  		@lineChart = true

  	@property = templateData.property
