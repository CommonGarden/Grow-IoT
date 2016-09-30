import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Rethink this bit...
Meteor.publish('thing.data.points', function(thingUuid) {
  check(thingUuid, Match.NonEmptyString);

  let thing = Thing.findOne({
    'uuid': thingUuid,
    'owner._id': this.userId
  }
  , {
    fields: {
      _id: 1
    }
  });

  if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

  // TODO: refine query to remove events.
  return Data.find(
    {'thing._id': thing._id}
  , {
    'sort': {
      'insertedAt': -1
    },
    'limit': 100
  });
});


Meteor.publish('thing.data.pointsByType', function(thingUuid, type) {
  check(thingUuid, Match.NonEmptyString);
  check(type, Match.NonEmptyString);

  let thing = Thing.findOne(
    {'uuid': thingUuid}
  , {
    fields: {
      _id: 1
    }
  });

  if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

  // TODO: refine query to remove events.
  return Data.find({
    'thing._id': thing._id,
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


Meteor.publish('Data.events', function(thingUuid) {
  check(thingUuid, Match.NonEmptyString);

  let thing = Thing.findOne({
    'uuid': thingUuid,
    'owner._id': this.userId
  }
  , {
    fields: {
      _id: 1
    }
  });

  if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

  // Return data documents with an event field.
  return Data.find({
    'thing._id': thing._id,
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
