import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

Meteor.methods({
  'Thing.sendCommand': function (thingUuid, type, options) {
    check(thingUuid, String);
    check(type, String);
    check(options, Object);

    // must be owner of the device.
    let thing = Things.findOne(
      {uuid: thingUuid}
    , {
      fields: {
        _id: 1
      }
    });

    if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

    let document = {
      createdAt: new Date(),
      thing: {
        _id: thing._id
      },
      body: {
        type: type,
        options: options
      }
    }

    // Clean up.
    Messages.insert(document);

    // if (!Messages.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }
  }
});
