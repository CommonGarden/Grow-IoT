class Thing.ListItemComponent extends CommonComponent
	@register 'Thing.ListItemComponent'

	onCreated: ->
		super

		# thing = Template.currentData()

		# @autorun (computation) =>
		# 	thingUuid = thing.uuid
		# 	return unless Template.currentData().uuid

		@subscribe 'Thing.one', Template.currentData().uuid

	thing: ->
		thing = Thing.documents.findOne
			uuid: Template.currentData().uuid
		thing.thing
