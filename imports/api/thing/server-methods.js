import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  'Thing.sendCommand': function (thingUuid, type, options) {
    check(thingUuid, String);
    check(type, String);

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
