class StorageFile.Uploader extends UIComponent
	@register 'StorageFile.Uploader'

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
			
			'click .take-pic': (event) ->
				MeteorCamera.getPicture [], (err, data) ->
					newFile = new FS.File(data)

					# Todo: create our own method.
					Meteor.call 'StorageFile.new', newFile, (err, fileObj) ->
						if err
							console.log err
							Bert.alert 'Image save failed.', 'error', 'growl-top-right'
						else
							Bert.alert 'Image saved', 'success', 'growl-top-right'