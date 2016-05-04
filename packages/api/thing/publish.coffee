new PublishEndpoint 'Thing.list', (environmentUuid) ->
  Thing.documents.find
    'owner._id': @userId
    'environment.uuid': environmentUuid

new PublishEndpoint 'Thing.one', (uuid) ->
  # TODO: Do better checks.
  check uuid, Match.NonEmptyString

  Thing.documents.find
    uuid: uuid
