Meteor.methods
  'Thing.new': (thing, environmentUuid) ->
    # TODO: checks.
    check thing, Object
    check environmentUuid, Match.NonEmptyString

    environment = Environment.documents.findOne
      uuid: environmentUuid

    document =
      uuid: Meteor.uuid()
      thing: thing
      environment:
        environment.getReference()
      owner:
        _id: Meteor.userId()
      timestamp: new Date()

    throw new Meteor.Error 'internal-error', "Internal error." unless Thing.documents.insert document

  'Thing.remove': (uuid) ->
    thing = Thing.documents.findOne
      'uuid': uuid
      'owner._id': Meteor.userId()

    Thing.documents.remove thing._id


  # Todo: Thing.edit
  'Thing.edit': (uuid) ->
