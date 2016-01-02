Meteor.methods
  'Environment.new': (name, insideOrOutside) ->
    check name, Match.NonEmptyString
    check insideOrOutside, Match.NonEmptyString

    document =
      uuid: Meteor.uuid()
      name: name
      type: insideOrOutside
      owner: 
        _id: Meteor.userId()
      created: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Environment.documents.insert document

    document

  'Environment.delete': (uuid) ->
    check uuid, Match.NonEmptyString
    environment = Environment.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless environment

    Environment.documents.remove environment._id

  'Environment.updateListOrder': (items) ->
    # TODO: checks

    for item in items
      Environment.documents.update item._id,
        '$set':
          'order': item.order