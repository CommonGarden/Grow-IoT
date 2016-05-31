class Device.ActuatorListComponent extends Device.DisplayComponent
  @register 'Device.ActuatorListComponent'

  onCreated: ->
    super

  actuators: ->
    device = @device()
    if device.thing.actions
      actionslist = []
      _.each device.thing.actions, (value, key, list) =>
        value.id = key
        if !value.template
          actionslist.push value
    actionslist