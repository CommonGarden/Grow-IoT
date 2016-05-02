Meteor.methods
  'Notifications.new': (notification) ->
    check notification, Match.NonEmptyString

    document =
      timestamp: new Date()
      notification: notification
      read: false
      owner:
      	_id: Meteor.userId()

    throw new Meteor.Error 'internal-error', "Internal error." unless Notifications.documents.insert document

    document

  # Mark a notification as read by id.
  'Notifications.read': (id) ->
    check id, Match.NonEmptyString

    Notifications.documents.update id,
      $set:
      	'read':true
