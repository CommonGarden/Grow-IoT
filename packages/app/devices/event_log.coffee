class Device.EventLogComponent extends UIComponent
  @register 'Device.EventLogComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @autorun (computation) =>
      deviceUuid = @currentDeviceUuid()
      return unless deviceUuid

      @subscribe 'Device.one', deviceUuid

      @subscribe 'Data.events', deviceUuid

  eventsLog: ->
    Data.documents.find
      'device.uuid': @currentDeviceUuid()
