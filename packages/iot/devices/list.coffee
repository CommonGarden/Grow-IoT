class Device.ListComponent extends UIComponent
  @register 'Device.ListComponent'

  onCreated: ->
    super

    @subscribe 'Device.list'

  devicesList: ->
    Device.documents.find()

class Device.ListItemComponent extends UIComponent
  @register 'Device.ListItemComponent'
