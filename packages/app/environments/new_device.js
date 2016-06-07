Environment.NewDeviceComponent = class NewDeviceComponent extends UIComponent {
  onCreated() {
    super.onCreated();

    this.currentEnvironmentUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    return this.subscribe('Device.unassignedList');
  }

  unassignedDevicesList() {
    return Device.documents.find({});
  }

  events() {
    return super.events().concat(
      {'click .unclaimed': this.claimDevice});
  }

  claimDevice(event) {
    event.preventDefault();
    
    // We get the uuid from the data-uuid attribute
    let deviceUuid = event.currentTarget.dataset.uuid;

    return Meteor.call('Device.assignEnvironment',
      deviceUuid,
      this.currentEnvironmentUuid(),
      (error, documentId) => {
        if (error) {
          console.error("New deviceerror", error);
          alert(`New deviceerror: ${error.reason || error}`);
          return;
        }

        // TODO: fix this.
        let params = { uuid: this.currentEnvironmentUuid() };
        let path = FlowRouter.path('Environment.DisplayComponent', params);
        return FlowRouter.go(path);
      });
  }
};

Environment.NewDeviceComponent.register('Environment.NewDeviceComponent');
