import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.publish('Images.all', function(limit = 10, skip = 0) {
    check(limit, Number);
    check(skip, Number);

    // Return only images owned by the authenticated user.
    return Images.find({
  	'meta.owner': this.userId
    }, {
  	'sort': {
    	'meta.insertedAt': -1
  	},
  	limit,
        skip,
    }).cursor;
});
