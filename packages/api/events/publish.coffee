new PublishEndpoint 'Events.device', (deviceUuid) ->
  # TODO: Do better checks.
  check deviceUuid, Match.NonEmptyString

  device = Device.documents.findOne
    uuid: deviceUuid
  ,
    fields:
      _id: 1

  throw new Meteor.Error 'not-found', "Device '#{deviceUuid}' cannot be found." unless device

  Events.documents.find
    'device._id': device._id
