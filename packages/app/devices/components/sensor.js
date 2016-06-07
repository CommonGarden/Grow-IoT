Device.SensorComponent = class SensorComponent extends Device.DisplayComponent {
  onCreated() {
    super.onCreated();

    return this.type = Template.currentData().type;
  }
}

Device.SensorComponent.register('SensorComponent');
