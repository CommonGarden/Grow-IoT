import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Notifications from '../collections/notifications';

Meteor.publish('Notifications.all', function({ limit }) {
  check(limit, Match.OneOf(Number, undefined));

  const l = limit || 10;
  return Notifications.find({
    'owner._id': this.userId
  }, {
    'sort': {
      'timestamp': -1
    },
    limit: l
  });
});