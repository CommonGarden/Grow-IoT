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
        'click .device': this.viewDevice,
        'click .new-device': this.newDeviceHelper
      }
    );
  }

  viewDevice(event) {
    // Build path from the data-uuid attribute
    let params = { uuid: event.currentTarget.dataset.uuid };
    let path = FlowRouter.path('Device.display', params);
    return FlowRouter.go(path);
  }

  newDeviceHelper(event) {
    Bert.alert('Pick an evironment to add a new device too.', 'success', 'growl-top-right');
  }
};

AllDevicesComponent.register('AllDevicesComponent');
