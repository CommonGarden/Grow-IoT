new PublishEndpoint 'Relationships.links', (deviceUuid) ->
  # TODO: Do better checks.
  check deviceUuid, Match.NonEmptyString

  device = Device.documents.findOne
    uuid: deviceUuid
  ,
    fields:
      _id: 1

  throw new Meteor.Error 'not-found', "Device '#{deviceUuid}' cannot be found." unless device

  Relationships.documents.find
    'device._id': device._id
