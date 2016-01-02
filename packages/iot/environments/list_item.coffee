class Environment.ListItemComponent extends Environment.ListComponent
  @register 'Environment.ListItemComponent'

  onRendered: ->
    super

    @autorun (computation) =>
      @subscribe 'Environment.one', Template.currentData().uuid

  deviceCount: ->
    Environment.documents.findOne
      'uuid': Template.currentData().uuid
    .devices?.length

  indoorsOrOutdoors: ->
    Environment.documents.findOne
      'uuid': Template.currentData().uuid
    .type
