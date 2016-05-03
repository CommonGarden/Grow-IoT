# Todo display the title for the current device, thing, or environment
# in the Nav?
# Note: this file and it's corresponding template is not in the package yet.
class Title extends UIComponent
  @register 'Title'

  onCreated: ->
    super

  dashboard: ->
    if FlowRouter.getRouteName() == "Dashboard"
      true
    else
      false
