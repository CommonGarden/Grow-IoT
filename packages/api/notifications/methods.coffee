Meteor.methods
  'Notifications.new': (notification) ->
    # TODO: checks.
    document =
      timestamp: new Date()
      notification: notification
      owner:
      	_id: Meteor.userId()

    throw new Meteor.Error 'internal-error', "Internal error." unless Notifications.documents.insert document

    document
