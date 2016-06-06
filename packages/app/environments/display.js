class EnvironmentDisplayComponent extends UIComponent {
  onCreated() {
    super.onCreated();

    this.currentEnvironmentUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    this.environment = new ComputedField(() => {
      return Environment.documents.findOne(
        {uuid: this.currentEnvironmentUuid()});
    });

    this.autorun(computation => {
      let uuid = this.currentEnvironmentUuid();
      if (!uuid) { return; }

      this.subscribe('Environment.one', uuid);

      this.subscribe('Device.listByEnvironment', uuid);

      return this.subscribe('Thing.list', uuid);
    });

    return this.autorun(computation => {
      if (!this.subscriptionsReady()) { return; }

      let environment = Environment.documents.findOne(
        {uuid: this.currentEnvironmentUuid()}
      , {
        fields: {
          name: 1
        }
      });

      // Set page title to environment name.
      document.title = environment.name;

      return environment;
    });
  }

  events() {
    return super.events().concat({
      'click .remove': this.remove,
      'click .new-device': this.addDevice,
      'click .new-thing': this.addThing
    });
  }

  devices() {
    return Device.documents.find(
      {'environment.uuid': this.currentEnvironmentUuid()});
  }

  things() {
    return Thing.documents.find(
      {'environment.uuid': this.currentEnvironmentUuid()});
  }

  emptyState() {
    // No things or devices.
    let x = this.devices().exists();
    return !x;
  }

  environment() {
    return this.environment();
  }

  notFound() {
    return this.subscriptionsReady() && !this.environment();
  }

  addDevice(e) {
    e.preventDefault();
    let params = { uuid: this.currentEnvironmentUuid() };
    let path = FlowRouter.path('Environment.NewDeviceComponent', params);
    return FlowRouter.go(path);
  }

  addThing(e) {
    e.preventDefault();
    let params = { uuid: this.currentEnvironmentUuid() };
    let path = FlowRouter.path('Thing.NewComponent', params);
    return FlowRouter.go(path);
  }

  remove() {
    if (window.confirm("Are you sure you want to delete this Environment?")) {
      return Meteor.call('Environment.delete',
        this.currentEnvironmentUuid(),
        (error, documentId) => {
          if (error) {
            console.error("New environment error", error);
            return alert(`New environment error: ${error.reason || error}`);
          } else {
            Bert.alert('Environment deleted.', 'success', 'growl-top-right');
            return FlowRouter.go('Dashboard');
          }
        });
    }
  }
}

EnvironmentDisplayComponent.register('EnvironmentDisplayComponent');
