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

    !!Data.documents.insert
      device:
        _id: device._id
      body: body
      insertedAt: new Date()


  # TODO: Should take an optional config argument so that when it creates the device
  # we ratain any meta data.
  'CommonGarden.registerDevice': (deviceInfo) ->
    # TODO: we need to run checks on deviceInfo, then add that info to the device
    # document
    # check deviceInfo, Object

    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()
      thing: deviceInfo

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document

  # TODO: make it so users can add their user IDs to the device config to claim
  # a device under their username.

  # CURRENTLY A HACK: this lists devices that don't have owners.
  'CommonGarden.claimDevice': (uuid, userID) ->
    check uuid, Match.NonEmptyString
    check userID, Match.NonEmptyString
    device = Device.documents.findOne
      'uuid': uuid
    Device.documents.update device._id,
      $set:
        'owner._id': userID


  'CommonGarden.removeDevice': (uuid, userID) ->
    check uuid, Match.NonEmptyString
    check userID, Match.NonEmptyString
    device = Device.documents.findOne
      'uuid': uuid
      'owner._id': userID
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    Device.documents.remove device._id
