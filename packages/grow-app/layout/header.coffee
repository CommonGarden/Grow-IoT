class HeaderComponent extends UIComponent
  @register 'HeaderComponent'

  onCreated: ->
  	super

  dashboard: ->
  	if FlowRouter.getRouteName() == "Dashboard"
  		true
  	else
  		false

  events: ->
    super.concat
      'click .logout': @onLogout

  onLogout: (event) ->
    event.preventDefault()
    Meteor.logout()
    FlowRouter.go '/login'