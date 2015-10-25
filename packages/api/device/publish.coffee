new PublishEndpoint 'CommonGarden.messages', (auth) ->
  check auth,
    # TODO: Do better checks.
    uuid: Match.NonEmptyString
    token: Match.NonEmptyString

  device = Device.documents.findOne auth,
    fields:
      _id: 1
  throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

  query =
    'device._id': device._id
    createdAt:
      $gte: new Date()
  options =
    fields:
      body: 1
    sort:
      createdAt: 1

  handle = Message.documents.find(query, options).observeChanges
    added: (id, fields) ->
      fields.createdAt = fields.createdAt.valueOf()

      @added 'CommonGarden.messages', id, fields
      @removed 'CommonGarden.messages', id

      Message.documents.remove id

  @ready()

  @onStop =>
    handle?.stop()
    handle = null
