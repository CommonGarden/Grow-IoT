Meteor.startup ->
	return if Device.documents.exists()

  device = Meteor.call 'CommonGarden.registerDevice'
	
  console.log "Registered: #{device.uuid}/#{device.token}"
