class NotificationsHistory extends UIComponent {
  onCreated() {
    super.onCreated();

    return this.subscribe('Notifications.list');
  }

  notifications() {
    return Notifications.documents.find(
      {'owner._id': Meteor.userId()});
  }
      // 'read': false

  notificationCount() {
    return Notifications.documents.find(
      {'owner._id': Meteor.userId()})
      // 'read': false
    .count();
  }
};

NotificationsHistory.register('NotificationsHistory');
