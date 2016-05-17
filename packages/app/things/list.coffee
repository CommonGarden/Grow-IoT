class Thing.ListComponent extends UIComponent
  @register 'Thing.ListComponent'

  onCreated: ->
    super

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @subscribe 'Thing.list', @currentEnvironmentUuid()

  onRendered: ->
    super

    # Based on: https://themeteorchef.com/snippets/adding-drag-and-drop-sorting-to-lists/
    # $ ($) ->
    #   sortableList = $('.sortable')
    #   sortableList.sortable( 'destroy' )
    #   sortableList.sortable()
    #   sortableList.sortable().off( 'sortupdate' )
    #   sortableList.sortable().on 'sortupdate', () ->
    #     items = []

    #     $('.sortable li').each ( index, element ) ->
    #       items.push
    #         _id: $( element ).data( 'id' )
    #         order: index + 1

    #     # TODO: fix method call.
    #     Meteor.call 'CommonGarden.updateListOrder',
    #       items
    #     ,
    #       (error, documentId) =>
    #         if error
    #           console.log error.reason

  # TODO: Sort this list based on the order
  thingsList: ->
    Thing.documents.find()

  events: ->
    super.concat
      'click .thing': @viewThing

  viewThing: (event) ->
    # Build path from the data-uuid attribute
    params = { uuid: event.currentTarget.dataset.uuid }
    path = FlowRouter.path('Thing.DisplayComponent', params)
    FlowRouter.go path
