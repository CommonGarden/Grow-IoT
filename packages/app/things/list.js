Thing.ListComponent = class ListComponent extends CommonComponent {
  onCreated() {
    super.onCreated();

    this.currentEnvironmentUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    return this.subscribe('Thing.list', this.currentEnvironmentUuid());
  }

  onRendered() {
    return super.onRendered();
  }

  // TODO: Sort this list based on the order
  thingsList() {
    return Thing.documents.find();
  }

  events() {
    return super.events().concat(
      {'click .thing': this.viewThing});
  }

  viewThing(event) {
    // Build path from the data-uuid attribute
    let params = { uuid: event.currentTarget.dataset.uuid };
    let path = FlowRouter.path('Thing.DisplayComponent', params);
    return FlowRouter.go(path);
  }
};

Thing.ListComponent.register('Thing.ListComponent');
