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
      body: body
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


  'Device.emitEvent': (auth, body) ->
    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    !!Events.documents.insert
      device:
        _id: device._id
      body: body
      insertedAt: new Date()

  
  'Device.register': (deviceInfo) ->
    # TODO: better checks
    # check deviceInfo, Object

    # TODO if the user has specified a username or user id in their config file,
    # then claim the device under that account. Call the claim device method.

    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()
      thing: deviceInfo

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document


  # For front end use.
  'Device.claim': (deviceUuid, environmentUuid) ->
    check deviceUuid, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    # TODO: make sure this doesn't work for devices with an owner.
    device = Device.documents.findOne
      'uuid': deviceUuid
    deviceCount = Device.documents.find().count()
    Device.documents.update device._id,
      '$set':
        'owner._id': Meteor.userId()
        'environment': environmentUuid
        'order': deviceCount

    Environment.documents.update
      'uuid': environmentUuid
      'owner._id': Meteor.userId()
    ,
      '$addToSet':
        'devices': device._id


  'Device.remove': (uuid, environmentUuid) ->
    check uuid, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    device = Device.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    Environment.documents.update
      'uuid': environmentUuid
      'owner._id': Meteor.userId()
    ,
      '$pull':
        'devices': device._id

    Device.documents.remove device._id


  'Device.updateListOrder': (items) ->
    # TODO: checks
    for item in items
      Device.documents.update item._id,
        '$set':
          'order': item.order
