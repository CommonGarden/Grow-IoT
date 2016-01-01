class Environment.ListItemComponent extends Environment.ListComponent
  @register 'Environment.ListItemComponent'

  onCreated: ->
    super

    @currentEnvironmentUuid = new ComputedField =>
      environment = Template.currentData()
      environment.uuid

    @autorun (computation) =>
      return unless @currentEnvironmentUuid()

      @subscribe 'Environment.one', @currentEnvironmentUuid()

  deviceCount: ->
    environment = Environment.documents.findOne
      'uuid': @currentEnvironmentUuid()
    environment.devices.length
