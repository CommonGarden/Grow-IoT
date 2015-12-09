new PublishEndpoint 'CommonGarden.messages', (auth) ->
  check auth,
    # TODO: Do better checks.
    uuid: Match.NonEmptyString
    token: Match.NonEmptyString

  device = Device.documents.findOne auth,
    fields:
      _id: 1
  throw new Meteor.Error 'unauthorized', "Unauthorized." unless device

  Device.documents.update device._id,
    $set:
      onlineSince: new Date()

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
    added: (id, fields) =>
      @added 'CommonGarden.messages', id, fields
      @removed 'CommonGarden.messages', id

      Message.documents.remove id

  @ready()

  @onStop =>
    handle?.stop()
    handle = null

    # Wait for 5 seconds before marking device offline. It might be just reconnecting.
    Meteor.setTimeout =>
      Device.documents.update
        _id: device._id
        onlineSince:
          $lt: new Date(new Date().valueOf() - 5000)
      ,
        $set:
          onlineSince: false
    ,
      5000 # ms

# This is a nasty temporary HACK
new PublishEndpoint 'Device.unclaimedList', ->
  # TODO: adjust query to not return devices without an owner.
  Device.documents.find
    'owner._id':
      $exists: false
# / End nasty hack

new PublishEndpoint 'Device.list', ->
  Device.documents.find
    'owner._id': @userId
    # fields: Device.PUBLISH_FIELDS()

new PublishEndpoint 'Device.one', (deviceUuid) ->
  # TODO: Do better checks.
  check deviceUuid, Match.NonEmptyString

  Device.documents.find
    uuid: deviceUuid
    # fields: Device.PUBLISH_FIELDS()
