new PublishEndpoint('Environment.list', function() {
  return Environment.documents.find(
    {'owner._id': this.userId}
  );
});

new PublishEndpoint('Environment.one', function(uuid) {
  check(uuid, Match.NonEmptyString);

  return Environment.documents.find(
    {'uuid': uuid}
  );
});
