class Device.SensorListComponent extends Device.DisplayComponent
  @register 'Device.SensorListComponent'

  onCreated: ->
    super

  sensors: ->
  	device = @device()
  	list = []
  	for component in device.thing.components
  		if component.class == "sensor"
  			list.push component
  	list
