TOKEN_LENGTH = 32

Meteor.methods
  'CommonGarden.sendData': (auth, body) ->
    check auth,
      # TODO: Do better checks.
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString
    check body, Object

    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    # Update main properties if need be.
    if body.properties?
      Device.documents.update device._id,
        $set:
          'properties': body.properties

    # Update actuators properties. Each actuator has it's own model.
    if body.actuators?
      Device.documents.update device._id,
        $set:
          'thing.actuators': body.actuators

    # Filter events from other data.
    if body.event?
      !!Events.documents.insert
        device:
          _id: device._id
        body: body
        insertedAt: new Date()
    else
      !!Data.documents.insert
        device:
          _id: device._id
        body: body
        insertedAt: new Date()

  'CommonGarden.registerDevice': (deviceInfo) ->
    # TODO: better checks
    # check deviceInfo, Object

    # TODO if the user has specified a username or user id in their config file,
    # then claim the device under that account.

    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()
      thing: deviceInfo

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document

  'CommonGarden.claimDevice': (deviceUuid, userID, environmentUuid) ->
    check deviceUuid, Match.NonEmptyString
    check userID, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    device = Device.documents.findOne
      'uuid': deviceUuid
    deviceCount = Device.documents.find().count()
    Device.documents.update device._id,
      '$set':
        'owner._id': userID
        'environment': environmentUuid
        'order': deviceCount

    Environment.documents.update
      'uuid': environmentUuid
      'owner._id': userID
    ,
      '$addToSet':
        'devices': device._id

  'CommonGarden.removeDevice': (uuid, userID, environmentUuid) ->
    check uuid, Match.NonEmptyString
    check userID, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    device = Device.documents.findOne
      'uuid': uuid
      'owner._id': userID
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    Environment.documents.update
      'uuid': environmentUuid
      'owner._id': userID
    ,
      '$pull':
        'devices': device._id

    Device.documents.remove device._id

  'CommonGarden.updateListOrder': (items) ->
    # TODO: checks

    for item in items
      Device.documents.update item._id,
        '$set':
          'order': item.order
