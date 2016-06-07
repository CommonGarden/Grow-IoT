Environment.ListComponent = class ListComponent extends UIComponent {
  onCreated() {
    super.onCreated();

    this.subscribe('Environment.list');

    return document.title = "Grow dashboard";
  }

  onRendered() {
    return super.onRendered();
  }

  devicesList() {
    return Environment.documents.find();
  }

  events() {
    return super.events().concat(
      {'click .device': this.viewEnvironment});
  }

  viewEnvironment(event) {
    // Build path from the data-uuid attribute
    let params = { uuid: event.currentTarget.dataset.uuid };
    let path = FlowRouter.path('Environment.DisplayComponent', params);
    return FlowRouter.go(path);
  }
};

Environment.ListComponent.register('Environment.ListComponent');
