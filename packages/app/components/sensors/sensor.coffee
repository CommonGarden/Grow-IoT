class Device.SensorComponent extends Device.DisplayComponent
  @register 'Device.SensorComponent'

  onCreated: ->
    super

    @type = Template.currentData().type
