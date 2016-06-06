new PublishEndpoint('Thing.list', function(environmentUuid) {
  return Thing.documents.find({
    'owner._id': this.userId,
    'environment.uuid': environmentUuid
  });
});

new PublishEndpoint('Thing.one', function(uuid) {
  // TODO: Do better checks.
  check(uuid, Match.NonEmptyString);

  return Thing.documents.find(
    {uuid});
});
