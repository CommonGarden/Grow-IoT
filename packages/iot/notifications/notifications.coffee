class Notifications.NavUI extends UIComponent
  @register 'Notifications.NavUI'

  onCreated: ->
    super

    @subscribe 'Notifications.list'

  notifications: ->
    Notifications.documents.find
      'owner._id': Meteor.userId()
      'read': false

  notificationCount: ->
    Notifications.documents.find
      'owner._id': Meteor.userId()
      'read': false
    .count()


class Notification extends UIComponent
  @register 'Notification'
