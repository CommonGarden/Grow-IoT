class Device.ListComponent extends UIComponent
  @register 'Device.ListComponent'

  onCreated: ->
    super

    @subscribe 'Device.list'

  onRendered: ->
    super

    # Based on: https://themeteorchef.com/snippets/adding-drag-and-drop-sorting-to-lists/
    $ ($) ->
      sortableList = $('.sortable')
      sortableList.sortable( 'destroy' )
      sortableList.sortable()
      sortableList.sortable().off( 'sortupdate' )
      sortableList.sortable().on 'sortupdate', () ->
        items = []

        $('.sortable li').each ( index, element ) ->
          items.push
            _id: $( element ).data( 'id' )
            order: index + 1

        Meteor.call 'CommonGarden.updateDeviceListOrder',
          items
        ,
          (error, documentId) =>
            if error
              console.log error.reason

  devicesList: ->
    Device.documents.find()

  events: ->
    super.concat
      'click .device': @viewDevice

  viewDevice: (event) ->
    # Build path from the data-uuid attribute
    params = { uuid: event.currentTarget.dataset.uuid }
    path = FlowRouter.path('Device.display', params)
    FlowRouter.go path
