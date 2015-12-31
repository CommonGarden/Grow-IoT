class Notifications extends UIComponent
	@register 'Notifications'

  onCreated: ->
    super

  notifications: ->
    Notifications.documents.find
    	owner._id: Meteor.userId()
    	read: false
  	
  notificationCount: ->
    Notifications.documents.find
    	owner._id: Meteor.userId()
    	read: false
    .count()

class Notification extends UIComponent
	@register 'Notification'
