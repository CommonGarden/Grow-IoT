TOKEN_LENGTH = 24

Meteor.methods
  'CommonGarden.sendData': (auth, data) ->
    check auth,
      # TODO: Do better checks.
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString
    check data, Object

    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    !!Data.documents.insert
      device:
        _id: device._id
      data: data
      insertedAt: new Date()

  'CommonGarden.registerDevice': ->
    document =
      uuid: Meteor.uuid()
      token: Random.secret TOKEN_LENGTH
      registeredAt: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document
