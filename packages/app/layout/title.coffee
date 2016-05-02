# Todo display the title for the current device, thing, or environment
class Title extends UIComponent
  @register 'Title'

  onCreated: ->
    super

  dashboard: ->
    if FlowRouter.getRouteName() == "Dashboard"
      true
    else
      false
