import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'

Meteor.publish('Events', function(uuid, type) {
  check(uuid, String);
  check(type, Match.OneOf(String, undefined));

  console.log(type);

  let thing = Thing.findOne({
    'uuid': uuid,
    'owner': this.userId
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

  // return Events.find({
  //   'thing._id': thing._id,
  //   'event.message.type': type,
  // }
  // , {
  //   'sort': {
  //     'insertedAt': -1
  //   },
  //   'limit': 100
  // });
});

// // Does this have to be a seperate function? Me thinks no.
// Meteor.publish('Events.byThingAndType', function(thingUuid, type) {
//   check(thingUuid, String);
//   check(type, String);

//   let thing = Things.findOne(
//     {
//       'uuid': thingUuid,
//       'owner': this.userId
//     }
//   , {
//     fields: {
//       _id: 1
//     }
//   });

//   if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

//   return Events.find({
//     'thing._id': thing._id,
//     'event.message.type': type,
//   }
//   , {
//     'sort': {
//       'insertedAt': -1
//     },
//     'limit': 100
//   });
// });
