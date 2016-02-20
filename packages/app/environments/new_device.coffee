class Environment.NewDeviceComponent extends UIComponent
  @register 'Environment.NewDeviceComponent'

  onCreated: ->
    super

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @subscribe 'Device.unassignedList'

  unassignedDevicesList: ->
    Device.documents.find({})

  events: ->
    super.concat
      'click .unclaimed': @claimDevice

  claimDevice: (event) ->
    event.preventDefault()
    
    # We get the uuid from the data-uuid attribute
    deviceUuid = event.currentTarget.dataset.uuid

    Meteor.call 'Device.assignEnvironment',
      deviceUuid,
      @currentEnvironmentUuid(),
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        # TODO: fix this.
        params = { uuid: @currentEnvironmentUuid() }
        path = FlowRouter.path('Environment.DisplayComponent', params)
        FlowRouter.go path
