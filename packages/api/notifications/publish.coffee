new PublishEndpoint 'Notifications.list', ->
  Notifications.documents.find
    'owner._id': @userId
