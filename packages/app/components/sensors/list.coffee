class Device.SensorListComponent extends Device.DisplayComponent
  @register 'Device.SensorListComponent'

  onCreated: ->
    super

  # This is a hack...
  # Should we kill the components temporarily for MVP?
  # Would be nice if we could include grow.js via NPM and use
  sensors: ->
    device = @device()
    list = []
    if device.thing.events?
      for event in device.thing.events
        if event.type != "alert"
          list.push event
    # if device.thing.components?
    #   for component in device.thing.components
    #     if component.template == "sensor"
    #       list.push component
      list
