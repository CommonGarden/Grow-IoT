class Component.ListComponent extends UIComponent
  @register 'Component.ListComponent'

  onCreated: ->
    super

    @type = Template.currentData().type

    @subscribe 'Component.list'

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

        Meteor.call 'Component.updateListOrder',
          items
        ,
          (error, documentId) =>
            if error
              console.log error.reason

  # TODO: filter this list based on type.
  componentsList: ->
    # console.log Component.documents.find({}).fetch()
    Component.documents.find
      "component.class": @type

  events: ->
    super.concat
      'click .Component': @viewComponent

  viewComponent: (event) ->
    # Build path from the data-uuid attribute
    params = { uuid: event.currentTarget.dataset.uuid }
    path = FlowRouter.path('Component.display', params)
    FlowRouter.go path
