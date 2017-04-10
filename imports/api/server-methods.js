import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import Notifications from './collections/notifications';

Meteor.methods({
  'Thing.sendCommand': function (thingUuid, type, options) {
    check(thingUuid, String);
    check(type, String);
    // Todo: Options are optional...
    // check(options, Object);

    // Must be owner of the device.
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

    Messages.insert(document);
  },
  'Notifications.getCount': function() {
    return Notifications.find({ 'owner._id': this.userId, read: false }).fetch().length;
  }

});
