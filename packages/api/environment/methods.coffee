Meteor.methods
  'Environment.new': (name, userID) ->
    check name, Match.NonEmptyString

    document =
      uuid: Meteor.uuid()
      name: name
      owner: 
        _id: userID
      created: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Environment.documents.insert document

    document

  'Environment.delete': (uuid, userID) ->
    check uuid, Match.NonEmptyString
    check userID, Match.NonEmptyString
    environment = Environment.documents.findOne
      'uuid': uuid
      'owner._id': userID
    throw new Meteor.Error 'unauthorized', "Unauthorized." unless environment

    Environment.documents.remove environment._id
