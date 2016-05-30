class Device.SensorListComponent extends Device.DisplayComponent
  @register 'Device.SensorListComponent'

  onCreated: ->
    super

  sensors: ->
    device = @device()
    sensorlist = []
    if device.thing.actions?
      _.each device.thing.actions, (value, key, list) =>
        value.id = key
        if value.template == "sensor"
          sensorlist.push value
    sensorlist
