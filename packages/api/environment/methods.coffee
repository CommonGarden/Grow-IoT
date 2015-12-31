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
