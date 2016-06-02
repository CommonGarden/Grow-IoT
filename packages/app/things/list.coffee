class Thing.ListComponent extends UIComponent
  @register 'Thing.ListComponent'

  onCreated: ->
    super

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @subscribe 'Thing.list', @currentEnvironmentUuid()

  onRendered: ->
    super

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
