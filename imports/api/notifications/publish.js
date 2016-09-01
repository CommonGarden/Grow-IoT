import { PublishEndpoint } from 'meteor/peerlibrary:reactive-publish';

new PublishEndpoint('Notifications.list', function() {
  return Notifications.documents.find(
    {'owner._id': this.userId}
  );
});
