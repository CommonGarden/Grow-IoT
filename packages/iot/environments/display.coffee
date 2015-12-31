class Environment.DisplayComponent extends UIComponent
  @register 'Environment.DisplayComponent'

  onCreated: ->
    super

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @environment = new ComputedField =>
      Environment.documents.findOne
        uuid: @currentEnvironmentUuid()

    @autorun (computation) =>
      uuid = @currentEnvironmentUuid()
      return unless uuid

      @subscribe 'Environment.one', uuid

      @subscribe 'Device.list'

    @autorun (computation) =>
      return unless @subscriptionsReady()

      environment = Environment.documents.findOne
        uuid: @currentEnvironmentUuid()
      ,
        fields:
          title: 1

  devices: ->
    Device.documents.find()

  environment: ->
    @environment()

  notFound: ->
    @subscriptionsReady() and not @environment()
