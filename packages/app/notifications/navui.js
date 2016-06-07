class NotificationsNavUI extends UIComponent {
  onCreated() {
    super.onCreated();

    return this.subscribe('Notifications.list');
  }

  events() {
    return super.events().concat(
      {'click .read': this.read});
  }

  notifications() {
    return Notifications.documents.find({
      'owner._id': Meteor.userId(),
      'read': false
    });
  }

  notificationCount() {
    return Notifications.documents.find({
      'owner._id': Meteor.userId(),
      'read': false
    })
    .count();
  }

  read(event) {
    event.preventDefault();
    return Meteor.call('Notifications.read', event.currentTarget.dataset.notification, (error, documentId) => {
        if (error) {
          return console.error("New notification error", error);
        }
      }
    );
  }
};

NotificationsNavUI.register('NotificationsNavUI');
