new PublishEndpoint 'Notifications', ->
  Notifications.documents.find
    'owner._id': @userId
