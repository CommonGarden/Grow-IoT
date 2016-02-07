class BackButton extends UIComponent
  @register 'BackButton'

  onCreated: ->
    super

  dashboard: ->
    if FlowRouter.getRouteName() == "Dashboard"
      true
    else
      false

  events: ->
    super.concat
      'click .back-button': (event) ->
        event.preventDefault()
        history.back()
