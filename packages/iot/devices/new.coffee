class Device.NewComponent extends UIComponent
  @register 'Device.NewComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      console.log(FlowRouter.getParam())

    @canNew = new ComputedField =>
      !!Meteor.userId()

  events: ->
    super.concat
      'submit .device-new': @onSubmit

  onSubmit: (event) ->
    event.preventDefault()

    device = Device.documents.findOne
      uuid: @currentDeviceUuid()

    if @$('[name="token"]').val() == device['token']
      return

    # Comments on what I was going to do:
    # If the token submitted matches the token of the device in context,
    # then assign the device's owner attribute to the the current user's 
    # id. 
    # Device in context is found by it's uuid which is passed in from the 
    # list page

    Meteor.call '',
      token: @$('[name="token"]').val()
      description: @$('[name="description"]').val()
      _id: Meteor.userId()
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        FlowRouter.go 'Device.display',
          _id: documentId

FlowRouter.route '/device/new',
  name: 'Device.new'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Device.NewComponent'
