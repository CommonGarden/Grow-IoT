Environment.ListItemComponent = class ListItemComponent extends Environment.ListComponent {
  onCreated() {
    super.onCreated();

    return this.subscribe('Environment.one', Template.currentData().uuid);
  }

  environment() {
    return Environment.documents.findOne(
      {'uuid': Template.currentData().uuid});
  }
};

Environment.ListItemComponent.register('Environment.ListItemComponent');
