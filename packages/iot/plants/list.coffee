class Plant.ListComponent extends UIComponent
  @register 'Plant.ListComponent'

  onCreated: ->
    super

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @subscribe 'Plant.list', @currentEnvironmentUuid()

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

        Meteor.call 'CommonGarden.updateListOrder',
          items
        ,
          (error, documentId) =>
            if error
              console.log error.reason

  # TODO: Sort this list based on the order
  plantsList: ->
    Plant.documents.find()

  events: ->
    super.concat
      'click .plant': @viewPlant

  viewPlant: (event) ->
    # Build path from the data-uuid attribute
    params = { uuid: event.currentTarget.dataset.uuid }
    path = FlowRouter.path('Plant.display', params)
    FlowRouter.go path
