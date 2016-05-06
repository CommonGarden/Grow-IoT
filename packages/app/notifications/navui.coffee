class Notifications.NavUI extends UIComponent
  @register 'Notifications.NavUI'

  onCreated: ->
    super

    @subscribe 'Notifications.list'

  events: ->
    super.concat
      'click .read': @read

  read: (event) ->
    event.preventDefault()
    Meteor.call 'Notifications.read',
      event.currentTarget.dataset.notification,
    ,
      (error, documentId) =>
        if error
          console.error "New notification error", error

  notifications: ->
    Notifications.documents.find
      'owner._id': Meteor.userId()
      'read': false

  notificationCount: ->
    Notifications.documents.find
      'owner._id': Meteor.userId()
      'read': false
    .count()
