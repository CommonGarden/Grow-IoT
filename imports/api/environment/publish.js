import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Environment.list', function() {
  return Environment.documents.find(
    {'owner._id': this.userId}
  );
});

Meteor.publish('Environment.one', function(uuid) {
  check(uuid, Match.NonEmptyString);

  return Environment.documents.find(
    {'uuid': uuid}
  );
});
