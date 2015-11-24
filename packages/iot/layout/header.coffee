class HeaderComponent extends UIComponent
  @register 'HeaderComponent'

  events: ->
    super.concat
      'click .logout': @onLogout

  onLogout: (event) ->
    event.preventDefault()
    Meteor.logout()
    FlowRouter.go '/login'