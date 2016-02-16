class Device.ActuatorListComponent extends Device.DisplayComponent
  @register 'Device.ActuatorListComponent'

  onCreated: ->
    super

    # console.log @device()

  actuators: ->
    device = @device()
    list = []
    for component in device.thing.components
      if component.template == "actuator"
        list.push component
    list
