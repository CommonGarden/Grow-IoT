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

    # Update properties if need be.
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

  # Starting to think that devices are a specific type of thing.
  # Todo: make device and thing the same but add new methods for non-devices.
  'CommonGarden.newThing': (thing) ->
    # TODO: we need to run checks on deviceInfo, then add that info to the device
    # document
    # check deviceInfo, Object

    document =
      uuid: Meteor.uuid()
      token: Random.id TOKEN_LENGTH
      registeredAt: new Date()
      thing: thing

    throw new Meteor.Error 'internal-error', "Internal error." unless Device.documents.insert document

    document


  # TODO add relationships better devices, currently this is a one way relationship.
  # 'CommonGarden.addRelationship': (device1uuid, device2uuid, relationship) ->
  #   check device1uuid, Match.NonEmptyString
  #   check device2uuid, Match.NonEmptyString
  #   check relationship, Object
    
  #   # Get the device document for the first device. 
  #   device = Device.documents.findOne
  #     'uuid': device1uuid

  #   !!Relationships.documents.insert
  #     device:
  #       _id: device._id
  #     body: relationship
  #     insertedAt: new Date()

  ## TODO: Remove relationship
  # 'CommonGarden.removeRelationship': (device1uuid, device2uuid, relationship) ->
  #   check device1uuid, Match.NonEmptyString
  #   check device2uuid, Match.NonEmptyString
  #   check relationship, Object
    
  #   # Get the device document for the first device. 
  #   device = Device.documents.findOne
  #     'uuid': device1uuid


