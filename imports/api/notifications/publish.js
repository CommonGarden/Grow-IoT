import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Notifications.list', function() {
  return Notifications.documents.find(
    {'owner._id': this.userId}
  );
});
