import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  ['Device.sendCommand'](deviceUuid, type, options) {
    // TODO: Do better checks.
    check(deviceUuid, Match.NonEmptyString);
    check(type, Match.NonEmptyString);

    let device = Device.documents.findOne(
      {uuid: deviceUuid}
    , {
      fields: {
        _id: 1
      }
    });

    if (!device) { throw new Meteor.Error('not-found', `Device '${deviceUuid}' cannot be found.`); }

    return Message.send(device, {
      type,
      options
    });
  }
});
