class User.LoginComponent extends UIComponent
  @register 'User.LoginComponent'

  onCreated: ->
    super

    @canNew = new ComputedField =>
      !!Meteor.userId()

  events: ->
    super.concat
      'submit .user-register': @onSubmit

  onSubmit: (event) ->
    event.preventDefault()

    Meteor.call 'User.login',
      email: @$('[name="email"]').val()
      password: @$('[name="password"]').val()
    ,
      (error, documentId) =>
        if error
          console.error "New deviceerror", error
          alert "New deviceerror: #{error.reason or error}"
          return

        FlowRouter.go 'Device.display',
          _id: documentId

 FlowRouter.route '/login',
  name: 'User.login'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'User.LoginComponent'