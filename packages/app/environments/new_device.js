Environment.NewDeviceComponent = class NewDeviceComponent extends CommonComponent {
  onCreated() {
    super.onCreated();

    this.currentEnvironmentUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    return this.subscribe('Device.unassignedList');
  }

  // Todo: don't list offline devices...
  // Not as simple as the attempt below...
  // Online since is not always false.
  unassignedDevicesList() {
    return Device.documents.find({ onlineSince: {$not: false} } );
  }

  events() {
    return super.events().concat({
      'click .unclaimed': this.claimDevice
    });
  }

  // TODO: this is a bit redundant. 
  // The user will have already selected new device in the environment they want to put it in.
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
