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

  'CommonGarden.registerDevice': ->
    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document

  'CommonGarden.claimDevice': (uuid, userID) ->
    # Should add an owner to that device document....
    console.log userID
    device = Device.documents.findOne
      'uuid': uuid
    Device.documents.update device._id,
      $set:
        'owner._id': userID
