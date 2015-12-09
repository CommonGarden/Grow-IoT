class Device.ListComponent extends UIComponent
  @register 'Device.ListComponent'

  onCreated: ->
    super

    @subscribe 'Device.list'

  devicesList: ->
    Device.documents.find()

  events: ->
    super.concat
      'click .device': @viewDevice

  viewDevice: (event) ->
    # Build path from the data-uuid attribute
    params = { uuid: event.currentTarget.dataset.uuid }
    path = FlowRouter.path("Device.display", params);
    
    FlowRouter.go path
