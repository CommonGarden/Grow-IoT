import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Feel free to make suggestions for the eventbus api.

Meteor.publish('Events.byThing', function(thingUuid) {
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

  return Events.find(
    {'thing._id': thing._id}
  , {
    'sort': {
      'insertedAt': -1
    },
    'limit': 100
  });
});


Meteor.publish('Events.byThingAndType', function(thingUuid, type) {
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

  return Events.find({
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
