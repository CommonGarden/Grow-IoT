import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';



Meteor.methods({
  sendCommand: function (deviceUuid, type, options) {
    // TODO: use regex to determin if it's a valid format?
    check(deviceUuid, String);
    check(type, String);

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
