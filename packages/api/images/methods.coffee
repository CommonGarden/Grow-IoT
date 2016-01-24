Meteor.methods
  'Images.new': (plant, fileObj) ->
    # TODO: checks.
    check plant, Object
    check fileObj, Object

    document =
      uuid: Meteor.uuid()
      plant: plant
      owner:
        _id: Meteor.userId()
      timestamp: new Date()

    # Images.insert newFile, (err, fileObj) ->
    #   if err
    #     Bert.alert 'Image save failed.', 'error', 'growl-top-right'
    #   else
    #     Bert.alert 'Image saved', 'success', 'growl-top-right'

    throw new Meteor.Error 'internal-error', "Internal error." unless Plant.documents.insert document

  'Images.remove': (uuid) ->
    plant = Plant.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()

    Plant.documents.remove plant._id
