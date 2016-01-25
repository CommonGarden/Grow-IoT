class Device.NewComponent extends UIComponent
  @register 'Device.NewComponent'

  onCreated: ->
    super

    @subscribe 'Device.unclaimedList'

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @subscribe 'Environment.one', @currentEnvironmentUuid()
    
  unclaimedDevicesList: ->
    Device.documents.find
      'owner._id':
        $exists: false

  events: ->
    super.concat
      'click .unclaimed': @claimDevice

  claimDevice: (event) ->
    event.preventDefault()
    
    # We get the uuid from the data-uuid attribute
    deviceUuid = event.currentTarget.dataset.uuid

    Meteor.call 'Device.claim',
      deviceUuid,
      @currentEnvironmentUuid(),
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        params = { uuid: @currentEnvironmentUuid() }
        path = FlowRouter.path('Environment.DisplayComponent', params)
        FlowRouter.go path
