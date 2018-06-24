import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Notifications from '../collections/notifications';

Meteor.publish('Notifications.all', function({ limit = 10, skip = 0 }) {
    check({ limit, skip }, {
        limit: Number,
        skip: Number,
    });
    return Notifications.find({
        'owner._id': this.userId
    }, {
        'sort': {
            'timestamp': -1
        },
        limit,
        skip,
    });
});
