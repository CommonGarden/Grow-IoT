class Environment.NewDeviceComponent extends UIComponent
  @register 'Environment.NewDeviceComponent'

  onCreated: ->
    super

    @subscribe 'Device.unclaimedList'

    @currentEnvironmentUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

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

    Meteor.call 'CommonGarden.claimDevice',
      deviceUuid,
      Meteor.userId(),
      @currentEnvironmentUuid(),
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        FlowRouter.go 'Dashboard'
