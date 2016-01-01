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

  events: ->
    super.concat
      'click .remove': @remove
      'click .new-device': @addDevice

  devices: ->
    Device.documents.find()

  environment: ->
    @environment()

  notFound: ->
    @subscriptionsReady() and not @environment()

  addDevice: (e) ->
    e.preventDefault()
    params = { uuid: @currentEnvironmentUuid() }
    path = FlowRouter.path('Environment.NewDeviceComponent', params)
    FlowRouter.go path

  remove: ->
    if window.confirm("Are you sure you want to delete this Environment?")
      Meteor.call 'Environment.delete',
        @currentEnvironmentUuid(),
        Meteor.userId(),
      ,
        (error, documentId) =>
          if error
            console.error "New environment error", error
            alert "New environment error: #{error.reason or error}"
          else
            Bert.alert 'Environment deleted.', 'success', 'growl-top-right'
            FlowRouter.go 'Dashboard'
