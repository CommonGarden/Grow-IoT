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

  'CommonGarden.registerDevice': ->
    auth =
      uuid: Meteor.uuid()
      token: Random.secret TOKEN_LENGTH

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert auth

    auth
