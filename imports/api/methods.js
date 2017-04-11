import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { EJSON } from 'meteor/ejson';
import Notifications from './collections/notifications';

/*
 * Thing methods
*/
Meteor.methods({
  /*
   * Registers a thing.
  */
  'Thing.register': function (auth, config) {
    check(auth, {
      uuid: String,
      token: String
    });
    check(config, Object);

    // Check to see we have that thing and fetch the document.
    let thing = Things.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }
    

    config = _.extend(config, { registeredAt: new Date() });

    // Update the document
    if (!Things.update(thing._id, {
      $set: config
    })) { throw new Meteor.Error('internal-error', "Internal error."); }
  },

  /*
   * Creates a new thing with UUID and Token.
  */
  'Thing.new': function (thing) {
    check(thing, Match.OneOf(Object, undefined));
    // Must be a logged in user. Anyone want to do a security audit?
    if (Meteor.userId()) {
      let document = {
        'uuid': Meteor.uuid(),
        'token': Random.id(32),
        'owner': Meteor.userId(),
        thing,
      };
      if (!Things.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

      return document;
    }
  },

  /*
   * Set property
  */
  'Thing.setProperty': function (auth, key, value) {
    check(auth, {
      uuid: String,
      token: String
    });
    check(key, String);
    check(value, Match.OneOf(String, Number));

    let thing = Things.findOne(auth, {
      fields: {
        _id: 1,
        properties: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    thing.properties[key] = value;

    return Things.update(thing._id, {
      $set: {
        'properties': thing.properties
      }
    });
  },

  // /*
  //  * Emit an event.
  // */
  // 'Thing.emit': function (auth, event) {
  //   check(auth, {
  //     uuid: String,
  //     token: String
  //   });
  //   check(event, Match.OneOf(String, Object));

  //   let thing = Things.findOne(auth, {
  //     fields: {
  //       _id: 1
  //     }
  //   });
  //   if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

  //   console.log(influx);

  //   if (influx) {
  //     influx.writePoints([
  //       {
  //         measurement: 'events',
  //         tags: { thing: thing._id },
  //         fields: { value: event.value, type: event.type },
  //       }
  //     ]).catch(err => {
  //       console.error(`Error saving data to InfluxDB! ${err.stack}`)
  //     })
  //   }


  //   return !!Events.insert({
  //     thing: {
  //       _id: thing._id
  //     },
  //     event: event,
  //     insertedAt: new Date()
  //   });
  // },

  /*
   * Delete thing.
  */
  'Thing.delete': function (uuid) {
    check(uuid, String);

    // Users can only delete things they own... someone please audit this...
    let thing = Things.findOne({
      'uuid': uuid,
      'owner': Meteor.userId()
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Things.remove(thing._id);
  },

  /*
   *
   */
  'Image.new': function (auth, file) {
    check(auth, {
      uuid: String,
      token: String
    });

    // Should be binary...
    check(file, Match.Where(EJSON.isBinary));

    let thing = Things.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    let imageFile = Buffer.from(file);

    Images.write(imageFile, {
      meta: {
        thing: thing._id,
        insertedAt: new Date(),
        'owner._id': this.userId, // Optional, used to check on server for file tampering
      },
      type: 'image/jpg',
    }, function (error, fileRef) {
      if (error) {
        throw error;
      } else {
        console.log(fileRef.name + ' is successfully saved to FS. _id: ' + fileRef._id);
      }
    });
  },

  /*
   * Delete an image file.
   */
  'Image.delete': function (id) {
    check(id, String);
    if (!Images.remove({'_id': id})) { throw new Meteor.Error('internal-error', "Internal error."); }
  },

  // Add links? For example if a device is offline, clicking on the notification
  // takes you to the offline device.
  'Notifications.new': function ({ notification }) {
    check(notification, String);
    let document = {
      timestamp: new Date(),
      notification,
      read: false,
      owner: {
        _id: this.userId,
      }
    };

    if (!Notifications.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

    return document;
  },

  // Mark a notification as read by id.
  'Notifications.read': function (id) {
    check(id, String);

    return Notifications.update(id, {
      $set: {
        'read':true
      }
    });
  },
});
