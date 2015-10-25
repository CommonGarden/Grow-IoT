class Device.ListComponent extends UIComponent
  @register 'Device.ListComponent'

  onCreated: ->
    super

    @canNew = new ComputedField =>
      !!Meteor.userId()

    @subscribe 'Meeting.list'
    @subscribe 'Device.list'

  devicesWithoutMeeting: ->
    Device.documents.find
      # Devices which do not have even the first meeting list item.
      'meetings.0':
        $exists: false

class Device.ListItemComponent extends UIComponent
  @register 'Device.ListItemComponent'

FlowRouter.route '/',
  name: 'Device.list'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Device.ListComponent'
