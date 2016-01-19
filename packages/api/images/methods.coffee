Meteor.methods
  'Images.new': (plant, fileObj) ->
    # TODO: checks.
    check plant, Object

    document =
      uuid: Meteor.uuid()
      plant: plant
      owner:
        _id: Meteor.userId()
      timestamp: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Plant.documents.insert document

  'Images.remove': (uuid) ->
    plant = Plant.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()

    Plant.documents.remove plant._id
