// Should rename to device data points?
new PublishEndpoint('Data.points', function(deviceUuid) {
  // TODO: Do better checks.
  check(deviceUuid, Match.NonEmptyString);

  let device = Device.documents.findOne({
    'uuid': deviceUuid,
    'owner._id': this.userId
  }
  , {
    fields: {
      _id: 1
    }
  });

  if (!device) { throw new Meteor.Error('not-found', `Device '${deviceUuid}' cannot be found.`); }

  // TODO: refine query to remove events.
  return Data.documents.find(
    {'device._id': device._id}
  , {
    'sort': {
      'insertedAt': -1
    },
    'limit': 100
  });
});

new PublishEndpoint('Data.pointsByType', function(deviceUuid, type) {
  // TODO: Do better checks.
  check(deviceUuid, Match.NonEmptyString);
  check(type, Match.NonEmptyString);

  let device = Device.documents.findOne(
    {'uuid': deviceUuid}
  , {
    fields: {
      _id: 1
    }
  });

  if (!device) { throw new Meteor.Error('not-found', `Device '${deviceUuid}' cannot be found.`); }

  // TODO: refine query to remove events.
  return Data.documents.find({
    'device._id': device._id,
    'data.type': type,
    'event': {
      $exists: false
    }
  }
  , {
    'sort': {
      'insertedAt': -1
    },
    'limit': 100
  });
});


new PublishEndpoint('Data.events', function(deviceUuid) {
  check(deviceUuid, Match.NonEmptyString);

  let device = Device.documents.findOne({
    'uuid': deviceUuid,
    'owner._id': this.userId
  }
  , {
    fields: {
      _id: 1
    }
  });

  if (!device) { throw new Meteor.Error('not-found', `Device '${deviceUuid}' cannot be found.`); }

  // Return data documents with an event field.
  return Data.documents.find({
    'device._id': device._id,
    'event': {
      $exists: true
    }
  }
  , {
    'sort': {
      'insertedAt': -1
    }
  });
});
