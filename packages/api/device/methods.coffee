TOKEN_LENGTH = 32

Meteor.methods
  'Device.sendData': (auth, body) ->
    check auth,
      # TODO: Do better checks.
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString
    # check body, Object

    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device
    
    !!Data.documents.insert
      device:
        _id: device._id
      data: body
      insertedAt: new Date()


  'Device.udpateProperty': (auth, componentName,  propertyKey, value) ->
    check auth,
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString
    check componentName, Match.NonEmptyString
    check propertyKey, Match.NonEmptyString

    # TODO: check value... though it could be many things, JSON object, boolean, null, a string, an array.
    # It shouldn't be a function or contain any functions.

    device = Device.documents.findOne auth,
      fields:
        _id: 1
        thing: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

    # Update the propery on the thing object
    thing = device.thing
    for key of thing
      if key == 'components'
        for item of thing.components
          if thing.components[item].name == componentName
            thing.components[item][propertyKey] = value
      else if thing[key] == componentName
        thing[propertyKey] = value

    # Set the new thing object
    Device.documents.update device._id,
      $set:
        'thing': thing


  'Device.emitEvent': (auth, body) ->
    check auth,
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString

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
    # TODO: better checks.
    check deviceInfo, Object

    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()
      thing: deviceInfo

    # HACK: should owner be required? Ultimately it would be nice to
    # be able to configure / claim devices from the app.
    try
      if deviceInfo.username
        if Meteor.isServer
          user = Accounts.findUserByUsername(deviceInfo.username)
          document.owner = 
            _id: user._id
      else
        throw new Meteor.Error 'internal-error', 'The device has no username. Choose the username of the account you want the device added to.'
    catch error
      # TODO: better error message
      throw new Meteor.Error 'internal-error', 'The device has no username. Choose the username of the account you want the device added to.'

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document


  'Device.assignEnvironment': (deviceUuid, environmentUuid) ->
    check deviceUuid, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    device = Device.documents.findOne
      'uuid': deviceUuid
      'owner._id': Meteor.userId()
    environment = Environment.documents.findOne
      'uuid': environmentUuid

    throw new Meteor.Error 'unauthorized', "Unauthorized." unless environment

    Device.documents.update device._id,
      '$set':
        'environment':
          environment.getReference()


  'Device.unassignEnvironment': (deviceUuid, environmentUuid) ->
    check deviceUuid, Match.NonEmptyString
    check environmentUuid, Match.NonEmptyString

    device = Device.documents.findOne
      'uuid': deviceUuid
      'owner._id': Meteor.userId()
    environment = Environment.documents.findOne
      'uuid': environmentUuid

    Device.documents.update device._id,
      '$unset':
        'environment': ""


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
