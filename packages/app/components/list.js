class ActuatorListComponent extends Device.DisplayComponent {
  onCreated() {
    return super.onCreated();
  }

  actuators() {
    let device = this.device();
    if (device.thing.actions) {
      var actionslist = [];
      _.each(device.thing.actions, (value, key, list) => {
        value.id = key;
        if (!value.template) {
          return actionslist.push(value);
        }
      });
    }
    return actionslist;
  }
}

ActuatorListComponent.register('ActuatorListComponent');
