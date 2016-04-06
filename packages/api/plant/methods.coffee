Meteor.methods
  'Plant.new': (plant, environmentUuid) ->
    # TODO: checks.
    check plant, Object
    check environmentUuid, Match.NonEmptyString

    environment = Environment.documents.findOne
      uuid: environmentUuid

    document =
      uuid: Meteor.uuid()
      plant: plant
      environment:
        environment.getReference()
      owner:
        _id: Meteor.userId()
      timestamp: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Plant.documents.insert document

  'Plant.remove': (uuid) ->
    plant = Plant.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()

    Plant.documents.remove plant._id


  # Todo: Plant.edit
  'Plant.edit': (uuid) ->
