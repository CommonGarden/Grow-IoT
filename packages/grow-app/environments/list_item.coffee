class Environment.ListItemComponent extends Environment.ListComponent
  @register 'Environment.ListItemComponent'

  onCreated: ->
    super

    @subscribe 'Environment.one', Template.currentData().uuid

  environment: ->
    Environment.documents.findOne
      'uuid': Template.currentData().uuid
