class SensorListComponent extends Device.DisplayComponent {
  onCreated() {
    return super.onCreated();
  }

  sensors() {
    let device = this.device();
    let sensorlist = [];
    if (device.thing.actions != null) {
      _.each(device.thing.actions, (value, key, list) => {
        value.id = key;
        if (value.template === "sensor") {
          return sensorlist.push(value);
        }
      });
    }
    return sensorlist;
  }
};

SensorListComponent.register('SensorListComponent');
