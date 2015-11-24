class Device.NewComponent extends UIComponent
  @register 'Device.NewComponent'

  onCreated: ->
    super

    @subscribe 'Device.unclaimedList'

  devicesList: ->
    Device.documents.find()

  events: ->
    super.concat
      'submit .device-new': @onSubmit

  onSubmit: (event) ->
    event.preventDefault()
    @claimDevice("0e9520d0-b7c5-4fdc-bb11-7607e43de4e3", Meteor.userId())

  claimDevice: (uuid, userId) ->
    Meteor.call 'CommonGarden.claimDevice',
      uuid,
      userId,
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        FlowRouter.go 'Device.display',
          _id: documentId

class Device.UnclaimedListItemComponent extends UIComponent
  @register 'Device.UnclaimedListItemComponent'
