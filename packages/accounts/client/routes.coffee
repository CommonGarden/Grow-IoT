# From: https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.vty74pkpy

# Routes in this group are public
exposed = FlowRouter.group {}

exposed.route '/login',
  name: 'LoginComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'LoginComponent'

exposed.route '/register',
  name: 'LoginComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'LoginComponent'

# Redirect after login to original destination
Accounts.onLogin ->
  redirect = Session.get 'redirectAfterLogin'
  if redirect?
    unless redirect is '/login'
      FlowRouter.go redirect

# Routes in this group are for logged in users. Unauthenticated users
# will be redirected to login / signup.
loggedIn = FlowRouter.group
 triggersEnter: [ ->
   unless Meteor.loggingIn() or Meteor.userId()
     route = FlowRouter.current()
     unless route.route.name is 'login'
       Session.set 'redirectAfterLogin', route.path
     FlowRouter.go '/login'
 ]
    

  