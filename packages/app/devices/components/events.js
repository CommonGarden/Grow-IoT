Device.EventComponent = class EventComponent extends Device.DisplayComponent {
  onCreated() {
    return super.onCreated();
  }

  eventsList() {
    let device = this.device();
    if (device.thing.events) {
      var eventlist = [];
      _.each(device.thing.events, (value, key, list) => {
        value.id = key;
        if (!value.template) {
          eventlist.push(value);
        }
      });
    }
    return eventlist;
  }
}

Device.EventComponent.register('Device.EventComponent');
