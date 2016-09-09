Device.PropertiesComponent = class PropertiesComponent extends Device.DisplayComponent {
  onCreated() {
    return super.onCreated();
  }

  eventsList() {
    let device = this.device();
    if (device.thing.events) {
      var eventlist = [];
      _.each(device.thing.events, (value, key, list) => {
        value.id = key;
        eventlist.push(value);
      });
    }
    return eventlist;
  }
}

Device.PropertiesComponent.register('Device.PropertiesComponent');
