Meteor.methods
  'Component.sendData': (auth, body) ->
  	# TODO: better checks.
  	# uuid in this case is the component uuid given on creation
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
      body: body
      insertedAt: new Date()

  'Component.create': (auth, component) ->
  	# TODO: better checks.
  	check auth,
      uuid: Match.NonEmptyString
      token: Match.NonEmptyString
    check component, Object

    device = Device.documents.findOne auth,
      fields:
        _id: 1
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless device


    document =
      uuid: Meteor.uuid()
      device:
        _id: device._id
      registeredAt: new Date()
      component: component

    throw new Meteor.Error 'internal-error', "Internal error." unless Component.documents.insert document

    document
