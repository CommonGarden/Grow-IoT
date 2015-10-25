class Device.NewComponent extends UIComponent
  @register 'Device.NewComponent'

  onCreated: ->
    super

    @canNew = new ComputedField =>
      !!Meteor.userId()

  events: ->
    super.concat
      'submit .device-new': @onSubmit

  onSubmit: (event) ->
    event.preventDefault()

    Meteor.call 'Device.new',
      title: @$('[name="title"]').val()
      description: @$('[name="description"]').val()
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

    share.PageTitle "New Device"
