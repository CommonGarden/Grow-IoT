import { Meteor } from 'meteor/meteor';
import Notifications from '../collections/notifications';

Meteor.methods({
  'Notifications.getCount': function() {
    return Notifications.find({ 'owner._id': this.userId, read: false }).fetch().length;
  }
});