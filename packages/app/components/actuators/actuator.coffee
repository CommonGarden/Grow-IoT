class Device.ActuatorComponent extends Device.DisplayComponent
  @register 'Device.ActuatorComponent'

  onCreated: ->
    super

    @type = Template.currentData().type
