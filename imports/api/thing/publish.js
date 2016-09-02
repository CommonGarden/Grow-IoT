import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Thing.list', function(environmentUuid) {
  return Thing.documents.find({
    'owner._id': this.userId,
    'environment.uuid': environmentUuid
  });
});

Meteor.publish('Thing.one', function(uuid) {
  // TODO: Do better checks.
  check(uuid, Match.NonEmptyString);

  return Thing.documents.find(
    {uuid});
});
