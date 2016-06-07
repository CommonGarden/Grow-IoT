class EventLogComponent extends UIComponent {
  onCreated() {
    super.onCreated();

    this.currentDeviceUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    return this.subscribe('Data.events', this.currentDeviceUuid());
  }

  eventsLog() {
    return Data.documents.find({
      'device.uuid': this.currentDeviceUuid(),
      'event': {
        $exists: true
      }
    }
    , {
      'sort': {
        'insertedAt': -1
      }
    });
  }
};

EventLogComponent.register('EventLogComponent');
