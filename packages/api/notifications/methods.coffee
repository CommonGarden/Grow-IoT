Meteor.methods
  'Notifications.new': (notification) ->
    # TODO: checks.
    document =
      timestamp: new Date()
      notification: notification

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document
