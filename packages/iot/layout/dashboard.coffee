class Dashboard extends UIComponent
	@register 'Dashboard'

	onCreated: ->
		super

		@subscribe 'Environment.list'

	environments: ->
		Environment.documents.find
			'owner._id': Meteor.userId()
