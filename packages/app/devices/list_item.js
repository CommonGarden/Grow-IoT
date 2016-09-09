class DeviceListItemComponent extends CommonComponent {
  // onCreated() {
  //   super.onCreated();

  //   let device = Template.currentData();

  //   this.autorun(computation => {
  //     let deviceUuid = device.uuid;
  //     if (!deviceUuid) { return; }

  //     this.subscribe('Device.one', deviceUuid);

  //     this.subscribe('Data.points', deviceUuid);

  //     return this.dataPoint = () => {
  //       let dataPoint = Data.documents.findOne(
  //         {'device._id': device._id}
  //       , {
  //         'sort': {
  //           'insertedAt': -1
  //         }
  //       });
  //       if (!_.isUndefined(dataPoint)) {
  //         return dataPoint.data;
  //       }
  //     };
  //   });
  // }

  // currentValue() {
  //   return this.dataPoint();
  // }
}

DeviceListItemComponent.register('DeviceListItemComponent');