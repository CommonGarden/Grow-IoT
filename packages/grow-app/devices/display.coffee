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

      # if device
      #   share.PageTitle device.title
      # else
      #   share.PageTitle "Not found"

  onRendered: ->
    currentValue = $('#set-ph').val()
    $('.glyphicon-chevron-left').on 'click', ->
      currentValue = parseFloat(currentValue) - 0.1
      $('#set-ph').val(currentValue)
    $('.glyphicon-chevron-right').on 'click', ->
      currentValue = parseFloat(currentValue) + 0.1
      $('#set-ph').val(currentValue)

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
      # first: 'Comment.ListComponent'
      # second: 'Point.ListComponent'
      # third: 'Motion.ListComponent'

    # We set PageTitle after we get devicetitle.
