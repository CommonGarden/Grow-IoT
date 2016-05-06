# Routes in this group are for logged in users. Unauthenticated users
# will be redirected to login / signup.

# From: https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.vty74pkpy
loggedIn = FlowRouter.group
 triggersEnter: [ ->
   unless Meteor.loggingIn() or Meteor.userId()
     route = FlowRouter.current()
     unless route.route.name is 'login'
       Session.set 'redirectAfterLogin', route.path
     FlowRouter.go '/login'
 ]

loggedIn.route '/device/:uuid',
  name: 'Device.display'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Device.DisplayComponent'

loggedIn.route '/thing/:uuid',
  name: 'Thing.DisplayComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Thing.DisplayComponent'

loggedIn.route '/environment/:uuid',
  name: 'Environment.DisplayComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Environment.DisplayComponent'

loggedIn.route '/',
  name: 'Dashboard'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Dashboard'

loggedIn.route '/environment/:uuid/new-device',
  name: 'Environment.NewDeviceComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Environment.NewDeviceComponent'

loggedIn.route '/new-environment',
  name: 'Environment.NewComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Environment.NewComponent'

loggedIn.route '/new-grow-file',
  name: 'GrowFileCreatorComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'GrowFileCreatorComponent'

loggedIn.route '/environment/:uuid/new-thing',
  name: 'Thing.NewComponent'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Thing.NewComponent'

loggedIn.route '/notifications',
  name: 'Notifications.History'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Notifications.History'
