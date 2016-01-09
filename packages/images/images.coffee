class Images extends UIComponent
	@register 'Images'

	onCreated: ->
		super

	events: ->
		super.concat
			'click .upload': (event) ->
				FS.Utility.eachFile event, (file) ->
					Images.insert file, (err, fileObj) ->
						# Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
						return
					return

