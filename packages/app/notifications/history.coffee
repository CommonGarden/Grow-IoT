class Notifications.History extends UIComponent
  @register 'Notifications.History'

  onCreated: ->
    super

    @subscribe 'Notifications.list'

  notifications: ->
    Notifications.documents.find
      'owner._id': Meteor.userId()
      # 'read': false

  notificationCount: ->
    Notifications.documents.find
      'owner._id': Meteor.userId()
      # 'read': false
    .count()
