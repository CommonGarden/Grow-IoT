import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  // Add links? For example if a device is offline, clicking on the notification
  // takes you to the offline device.
  ['Notifications.new'](notification, userId) {
    check(notification, Match.NonEmptyString);

    // There is probably a more elegant way of writing the following.
    if (userId) {
      check(userId, Match.NonEmptyString);
      var document = {
        timestamp: new Date(),
        notification,
        read: false,
        owner: {
          _id: userId
        }
      };
    } else {
      var document = {
        timestamp: new Date(),
        notification,
        read: false,
        owner: {
          _id: Meteor.userId()
        }
      };
    }

    if (!Notifications.documents.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

    return document;
  },

  // Mark a notification as read by id.
  ['Notifications.read'](id) {
    check(id, Match.NonEmptyString);

    return Notifications.documents.update(id, {
      $set: {
      	'read':true
    }
    });
  }
});