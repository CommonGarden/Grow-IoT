class Device.NewComponent extends UIComponent
  @register 'Device.NewComponent'

  onCreated: ->
    super

    @subscribe 'Device.unclaimedList'

  unclaimedDevicesList: ->
    Device.documents.find
      'owner._id':
        $exists: false

  events: ->
    super.concat
      'click .unclaimed': @claimDevice

  claimDevice: (event) ->
    # We get the uuid from the data-uuid attribute
    uuid = event.currentTarget.dataset.uuid

    Meteor.call 'CommonGarden.claimDevice',
      uuid,
      Meteor.userId(),
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        FlowRouter.go 'Dashboard'
