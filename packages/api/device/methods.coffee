TOKEN_LENGTH = 32

Meteor.methods
  'Device.sendData': (auth, body) ->
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
      data: body
      insertedAt: new Date()


  'Device.udpateProperties': (auth, body) ->
    check auth,
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString

    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    # TODO: better checks.
    Device.documents.update device._id,
      $set:
        'thing': body

  # Need to test this works with v0.1 grow.js
  'Device.emitEvent': (auth, body) ->
    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    !!Data.documents.insert
      device:
        _id: device._id
      event: body
      insertedAt: new Date()

  
  'Device.register': (deviceInfo) ->
    # TODO: better checks
    # check deviceInfo, Object

    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()
      thing: deviceInfo

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    # TODO: claim device via config file?
    # if deviceInfo.owner?
    #   if Meteor.isServer
    #     user = Accounts.findUserByEmail(deviceInfo.owner)
    #     document.owner = 
    #       _id: user._id

    document
  
  # For front end use.
  # This is a hack.
  'Device.claim': (deviceUuid, environmentUuid) ->
    check deviceUuid, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    # TODO: make sure this doesn't work for devices with an owner.
    device = Device.documents.findOne
      'uuid': deviceUuid
    environment = Environment.documents.findOne
      'uuid': environmentUuid

    Device.documents.update device._id,
      '$set':
        'owner._id': Meteor.userId()
        'environment':
          environment.getReference()
        # 'order': deviceCount

  # Device.move: -> # Move device to different environment?

  'Device.remove': (uuid) ->
    check uuid, Match.NonEmptyString

    device = Device.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    Device.documents.remove device._id


  'Device.updateListOrder': (items) ->
    # TODO: checks
    for item in items
      Device.documents.update item._id,
        '$set':
          'order': item.order
