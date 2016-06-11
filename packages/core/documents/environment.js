import BaseDocument from '../base';

// registeredAt
// uuid: UUID of the device
// token: token of the device
// thing: a model of the device and its api
// owner:
//   _id
// devices: list of (reverse of the Device.environment)
//   _id
// things: list of (reverse of the Thing.environment)
//   _id
// rules: list of (reverse of the Rule.environment)
//   _id
Environment = class Environment extends BaseDocument {
  constructor() {
    super();
  }

  Meta () {
    return {
      name: 'Environment',
      fields: () => {
        return {
          owner: this.ReferenceField(User, [], false),
          deviceCount: this.GeneratedField('self', ['devices'], fields => {
            return [fields._id, fields.devices.length || 0];
          }),
          thingsCount: this.GeneratedField('self', ['things'], fields => {
            return [fields._id, fields.things.length || 0];
          })
        };
      }
    };
  }

  getReference() {
    return _.pick(this, _.keys(this.constructor.REFERENCE_FIELDS()));
  }

  REFERENCE_FIELDS() {
    return {
      _id: 1,
      uuid: 1,
      rule: 1
    };
  }
}

// export default Environment;
