class AllDevicesComponent extends CommonComponent {
  onCreated() {
    super.onCreated();

    this.currentEnvironmentUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    return this.subscribe('Device.list', this.currentEnvironmentUuid());
  }

  onRendered() {
    return super.onRendered();
  }

  unassignedDevicesList() {
    return Device.documents.find({});
  }

  // TODO: Sort this list based on the order
  devicesList() {
    return Device.documents.find({});
  }

  events() {
    return super.events().concat(
      {
        'click .device': this.viewDevice
      }
    );
  }

  viewDevice(event) {
    // Build path from the data-uuid attribute
    let params = { uuid: event.currentTarget.dataset.uuid };
    let path = FlowRouter.path('Device.display', params);
    return FlowRouter.go(path);
  }
};

AllDevicesComponent.register('AllDevicesComponent');
