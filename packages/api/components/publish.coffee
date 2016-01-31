new PublishEndpoint 'Component.list', (environmentUuid) ->
  Component.documents.find
    'owner._id': @userId
    'environment.uuid': environmentUuid

new PublishEndpoint 'Component.one', (componentUuid) ->
  # TODO: Do better checks.
  check componentUuid, Match.NonEmptyString

  Component.documents.find
    uuid: componentUuid
