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
  'CommonGarden.registerDevice': ->
    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document


  # CURRENTLY A HACK
  'CommonGarden.claimDevice': (uuid, userID) ->
    # Should add an owner to that device document....
    device = Device.documents.findOne
      'uuid': uuid
    Device.documents.update device._id,
      $set:
        'owner._id': userID


  'CommonGarden.removeDevice': (auth) ->
    check auth,
      # TODO: Do better checks.
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString

    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    Device.documents.remove device._id
