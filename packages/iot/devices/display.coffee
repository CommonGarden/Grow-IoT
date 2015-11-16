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

    @canNew = new ComputedField =>
      !!Meteor.userId()

  events: ->
    super.concat
      'click .acid': @onAcid
      'click .base': @onBase

      'click .glyphicon-chevron-left': (event) =>
        currentValue = @$('#set-ph').val()
        currentValue = parseFloat(currentValue) - 0.1
        @$('#set-ph').val(currentValue)

      'click .glyphicon-chevron-right': (event) =>
        currentValue = @$('#set-ph').val()
        currentValue = parseFloat(currentValue) + 0.1
        @$('#set-ph').val(currentValue)

  onAcid: (event) ->
    event.preventDefault()

    Meteor.call 'Device.sendCommand', @currentDeviceUuid(), 'acid', 5, (error) ->
      console.log "Error", error if error

  onBase: (event) ->
    event.preventDefault()

    Meteor.call 'Device.sendCommand', @currentDeviceUuid(), 'base', 5, (error) ->
      console.log "Error", error if error

  device: ->
    Device.documents.findOne
      uuid: @currentDeviceUuid()

  datapoints: ->
    Data.documents.find
      'device._id': @device()?._id

  notFound: ->
    @subscriptionsReady() and not @device()

FlowRouter.route '/device/:uuid',
  name: 'Device.display'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Device.DisplayComponent'
