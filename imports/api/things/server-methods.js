import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

Meteor.methods({
  'Thing.sendCommand': function (thingUuid, type, options) {
    check(thingUuid, Match.NonEmptyString);
    check(type, Match.NonEmptyString);

    // must be owner of the device.
    let thing = Things.findOne(
      {uuid: thingUuid}
    , {
      fields: {
        _id: 1
      }
    });

    if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

    return Messages.send(thing, {
      type,
      options
    });
  }
});
