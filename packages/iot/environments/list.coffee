class Environment.ListComponent extends UIComponent
  @register 'Environment.ListComponent'

  onCreated: ->
    super

    @subscribe 'Environment.list'

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

        Meteor.call 'Environment.updateListOrder',
          items
        ,
          (error, documentId) =>
            if error
              console.log error.reason

  # TODO: Sort this list based on the order and rename.
  devicesList: ->
    Environment.documents.find()

  events: ->
    super.concat
      'click .device': @viewEnvironment

  viewEnvironment: (event) ->
    # Build path from the data-uuid attribute
    params = { uuid: event.currentTarget.dataset.uuid }
    path = FlowRouter.path('Environment.display', params)
    FlowRouter.go path
