import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'

Meteor.publish('Thing.events', function(uuid, type) {
  check(uuid, String);
  check(type, Match.OneOf(String, undefined));

  let thing = Things.findOne({
    'uuid': uuid,
    'owner': this.userId
  }
  , {
    fields: {
      _id: 1
    }
  });

  if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

  if (type === undefined) {
      return Events.find(
        {'thing._id': thing._id}
      , {
        'sort': {
          'insertedAt': -1
        },
        'limit': 100
      });
  }

  if (type) {
    return Events.find({
      'thing._id': thing._id,
      'event.type': type,
    }
    , {
      'sort': {
        'insertedAt': -1
      },
      'limit': 100
    });
  }
});
