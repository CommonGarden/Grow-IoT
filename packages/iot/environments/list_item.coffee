class Environment.ListItemComponent extends Environment.ListComponent
  @register 'Environment.ListItemComponent'

  onRendered: ->
    super

    @uuid = ->
      environment = Template.currentData()
      environment.uuid

    @autorun (computation) =>

      @subscribe 'Environment.one', @uuid()

    @deviceCount = new ComputedField =>
      environment = Environment.documents.findOne
        'uuid': @uuid()
      environment?.devices?.length
