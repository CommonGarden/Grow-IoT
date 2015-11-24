class Device.ListComponent extends UIComponent
  @register 'Device.ListComponent'

  onCreated: ->
    super

    @canNew = new ComputedField =>
      !!Meteor.userId()

    @subscribe 'Device.list'

  unclaimedDevicesList: ->
    Device.documents.find()

class Device.ListItemComponent extends UIComponent
  @register 'Device.ListItemComponent'

FlowRouter.route '/',
  name: 'Device.belongs_to_user_list'
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent',
      main: 'Device.ListComponent'
