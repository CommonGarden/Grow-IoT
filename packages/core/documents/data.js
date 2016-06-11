import share from '../base';

Data = class Data extends share.BaseDocument {
  // insertedAt
  // device: device associated with data
  //   _id
  // body
  constructor() {
    super();
  }

  Meta () {
    return {
      name: 'Data',
      collection: 'Data',
      fields: () => {
        return {device: this.ReferenceField(Device, Device.REFERENCE_FIELDS())};
      },

      triggers: () => {
        return {
          rules: this.Trigger(['insertedAt', 'device', 'body'], function(newDocument, oldDocument) {
            // Don't do anything when document is removed
            if (!newDocument._id) { return; }
            return console.log(newDocument);
          })
        };
      }
    };
  }
}

export default Data;
