# From: https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.vty74pkpy

# Routes in this group are public
exposed = FlowRouter.group {}

exposed.route '/login',
  name: 'User.login'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'User.LoginComponent'

exposed.route '/register',
  name: 'User.register'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'User.RegisterComponent'

# Redirect after login to original destination
Accounts.onLogin ->
  redirect = Session.get 'redirectAfterLogin'
  if redirect?
    unless redirect is '/login'
      FlowRouter.go redirect
      