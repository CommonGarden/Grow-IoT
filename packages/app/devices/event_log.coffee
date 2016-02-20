class Device.EventLogComponent extends UIComponent
  @register 'Device.EventLogComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @subscribe 'Data.events', @currentDeviceUuid()

  eventsLog: ->
    Data.documents.find
      'device.uuid': @currentDeviceUuid()
      'event':
        $exists: true
    ,
      'sort':
        'insertedAt': -1

