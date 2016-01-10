new PublishEndpoint 'Plant.list', (environmentUuid) ->
  Plant.documents.find
    'owner._id': @userId
    'environment': environmentUuid

new PublishEndpoint 'Plant.one', (uuid) ->
  # TODO: Do better checks.
  check uuid, Match.NonEmptyString

  Plant.documents.find
    uuid: uuid
