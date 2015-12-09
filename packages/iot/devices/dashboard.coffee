class Dashboard extends UIComponent
  @register 'Dashboard'

  onCreated: ->
  	super

  	@autorun (computation) =>
			@subscribe 'Device.list'

			return unless @subscriptionsReady()
			@devices = Device.documents.find
				'owner._id': Meteor.userId()
