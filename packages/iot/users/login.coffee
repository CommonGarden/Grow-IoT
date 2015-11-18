class User.LoginComponent extends UIComponent
  @register 'User.LoginComponent'

  onCreated: ->
    super

    @canNew = new ComputedField =>
      !!Meteor.userId()

  events: ->
    super.concat
      'submit form': @onSubmit

  onSubmit: (event) ->
    event.preventDefault()
    email = $('[name="email"]').val()
    password = $('[name="password"]').val()
    Meteor.loginWithPassword(email, password, 
      (error, documentId) =>
        if error
          console.error "Login error", error
          alert "Login error: #{error.reason or error}"
          return

        FlowRouter.go 'Device.display',
          _id: documentId)

 FlowRouter.route '/login',
  name: 'User.login'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'User.LoginComponent'