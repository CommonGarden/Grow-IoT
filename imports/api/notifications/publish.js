import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('notifications', function() {
  return Notifications.documents.find(
    {'owner._id': this.userId}
  );
});
