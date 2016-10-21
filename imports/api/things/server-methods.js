import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
// import { HTTP } from 'meteor/http';

Meteor.methods({
  'Thing.sendCommand': function (thingUuid, type, options) {
    check(thingUuid, String);
    check(type, String);

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
  },

  // http://docs.meteor.com/api/http.html#HTTP-call

  // 'Thing.http': function (method, url, options, asyncCallback) {
  //   check(thingUuid, String);

  //   this.unblock();

  //   try {
  //     var result = HTTP.call(method, url, options);
  //     return true;
  //   } catch (e) {
  //     // Got a network error, time-out or HTTP error in the 400 or 500 range.
  //     return false;
  //   }
  // }
});
