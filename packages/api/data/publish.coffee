new PublishEndpoint 'Data.points', (deviceUuid) ->
  # TODO: Do better checks.
  check deviceUuid, Match.NonEmptyString

  device = Device.documents.findOne
    'uuid': deviceUuid
    'owner._id': Meteor.userId()
  ,
    fields:
      _id: 1

  throw new Meteor.Error 'not-found', "Device '#{deviceUuid}' cannot be found." unless device

  Data.documents.find
    'device._id': device._id
  ,
    'sort':
      'insertedAt': -1
    'limit': 100

# TODO: move events into data.
# new PublishEndpoint 'Data.events', (deviceUuid) ->
#   check deviceUuid, Match.NonEmptyString

#   device = Device.documents.findOne
#     uuid: deviceUuid
#     owner._id: Meteor.userId()
#   ,
#     fields:
#       _id: 1

#   throw new Meteor.Error 'not-found', "Device '#{deviceUuid}' cannot be found." unless device

#   Events.documents.find
#     'device._id': device._id