class Device.DisplayComponent extends UIComponent
  @register 'Device.DisplayComponent'

  onCreated: ->
    super

    @currentDeviceId = new ComputedField =>
      FlowRouter.getParam '_id'

    @autorun (computation) =>
      deviceId = @currentDeviceId()
      return unless deviceId
      @subscribe 'Device.one', deviceId

    @autorun (computation) =>
      return unless @subscriptionsReady()

      device= Device.documents.findOne @currentDeviceId(),
        fields:
          title: 1

      if device
        share.PageTitle device.title
      else
        share.PageTitle "Not found"

  device: ->
    Device.documents.findOne @currentDeviceId()

  notFound: ->
    @subscriptionsReady() and not @device()

FlowRouter.route '/device/:_id',
  name: 'Device.display'
  action: (params, queryParams) ->
    BlazeLayout.render 'ColumnsLayoutComponent',
      main: 'Device.DisplayComponent'
      first: 'Comment.ListComponent'
      second: 'Point.ListComponent'
      third: 'Motion.ListComponent'

    # We set PageTitle after we get devicetitle.
