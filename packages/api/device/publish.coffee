new PublishEndpoint 'Device.messages', (auth) ->
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
      @added 'Device.messages', id, fields
      @removed 'Device.messages', id

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

      # Emit notification.
      Meteor.call 'Notification.new',
        "Device offline."
      ,
        (error, documentId) =>
          if error
            console.error "New Notification Error", error
          else
            Bert.alert 'Device offline.', 'warning', 'growl-top-right'
    ,
      5000 # ms

new PublishEndpoint 'Device.unassignedList', ->
  Device.documents.find
    'owner._id': @userId
    'environment':
      $exists: false

# Maybe this should be a publish end point in Environment methods
new PublishEndpoint 'Device.listByEnvironment', (environmentUuid) ->
  Device.documents.find
    'owner._id': @userId
    'environment.uuid': environmentUuid

new PublishEndpoint 'Device.list', ->
  Device.documents.find
    'owner._id': @userId
    'environment':
      $exists: true


new PublishEndpoint 'Device.one', (deviceUuid) ->
  # TODO: Do better checks.
  check deviceUuid, Match.NonEmptyString

  Device.documents.find
    uuid: deviceUuid
