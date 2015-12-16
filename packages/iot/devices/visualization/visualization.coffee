class Device.VisualizationComponent extends UIComponent
  @register 'Device.VisualizationComponent'

  onCreated: ->
  	super

  	templateData = Template.currentData()
  	@chartType = templateData.chartType
  	if @chartType == "line"
  		@lineChart = false

  	@property = templateData.property
