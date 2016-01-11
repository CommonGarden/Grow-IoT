class Plant.ListItemComponent extends UIComponent
	@register 'Plant.ListItemComponent'

	onCreated: ->
		super

		# plant = Template.currentData()

		# @autorun (computation) =>
		# 	plantUuid = plant.uuid
		# 	return unless Template.currentData().uuid

		@subscribe 'Plant.one', Template.currentData().uuid

	plant: ->
		plant = Plant.documents.findOne
			uuid: Template.currentData().uuid
		console.log plant
		plant.plant
