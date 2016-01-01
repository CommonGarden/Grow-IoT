new PublishEndpoint 'Environment.list', ->
  Environment.documents.find
    'owner._id': @userId

new PublishEndpoint 'Environment.one', (uuid) ->
  check uuid, Match.NonEmptyString

  Environment.documents.find
    'uuid': uuid
