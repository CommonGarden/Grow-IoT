Meteor.methods
  'Plant.new': (plant, environmentUuid) ->
    # TODO: checks.
    document =
      uuid: Meteor.uuid
    	growInfo: plant
    	environment: environmentUuid
    	owner: 
        _id: Meteor.userId()
      timestamp: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Plant.documents.insert document

    Environment.documents.update
      'uuid': environmentUuid
      'owner._id': Meteor.userId()
    ,
      '$addToSet':
        'plants': document._id

  'Plant.remove': (uuid) ->
    plant = Plant.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()

    Plant.documents.remove plant._id