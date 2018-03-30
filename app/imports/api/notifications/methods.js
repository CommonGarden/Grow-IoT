import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { EJSON } from 'meteor/ejson';
import Notifications from '../collections/notifications';

Meteor.methods({
  // Add links? For example if a device is offline, clicking on the notification
  // takes you to the offline device.
  'Notifications.new': function (notification, owner) {
    check(notification, Match.OneOf(String, Object));
    check(owner, Match.OneOf(String, undefined));
    let document = {
      timestamp: new Date(),
      notification,
      read: false,
      owner: {
        _id: owner || this.userId,
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

    // Mark a notification as read by id.
  'Notifications.markAllRead': function () {
    return Notifications.update({'owner._id': this.userId}, {
      $set: {
        'read':true
      }
    }, {multi: true});
  }
});