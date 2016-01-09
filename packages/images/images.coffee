class Images.Upload extends UIComponent
	@register 'Images.Upload'

	onCreated: ->
		super

	events: ->
		super.concat
			'change .myFileInput': (event) ->
				FS.Utility.eachFile event, (file) ->
					newFile = new FS.File(file)
					Images.insert newFile, (err, fileObj) ->
						if err
	            Bert.alert 'Upload failed.', 'error', 'growl-top-right'
	          else
	          	Bert.alert 'Upload successful.', 'success', 'growl-top-right'
