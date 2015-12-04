class Device.DisplayComponent extends UIComponent
  @register 'Device.DisplayComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @autorun (computation) =>
      deviceUuid = @currentDeviceUuid()
      return unless deviceUuid

      @subscribe 'Device.one', deviceUuid

      @subscribe 'Data.points', deviceUuid

    @autorun (computation) =>
      return unless @subscriptionsReady()

      device = Device.documents.findOne
        uuid: @currentDeviceUuid()
      ,
        fields:
          title: 1

  device: ->
    Device.documents.findOne
      uuid: @currentDeviceUuid()

  # thing: ->
  #   device = Device.documents.findOne
  #     uuid: @currentDeviceUuid()
  #   device.thing

  datapoints: ->
    Data.documents.find
      'device._id': @device()?._id

  events: ->
    super.concat
      'click .remove': @remove

  notFound: ->
    @subscriptionsReady() and not @device()

  # TODO: add send command function.
  command: (type, options) ->
    Meteor.call 'Device.sendCommand',
      @currentDeviceUuid(),
      type,
      options,
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

  remove: ->
    # TODO: add an alert so that a user has to confirm deletion.
    Meteor.call 'CommonGarden.removeDevice',
      @currentDeviceUuid(),
      Meteor.userId(),
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        FlowRouter.go 'Device.list'
