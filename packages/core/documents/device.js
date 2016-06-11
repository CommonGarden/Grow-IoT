import BaseDocument from '../base';

// registeredAt
// uuid: UUID of the device
// token: token of the device
// thing: a model of the device and its api
// owner:
//   _id
// environment: the place a thing belongs too.
//   _id
// onlineSince
class Device extends BaseDocument {
  constructor() {
    super();
  }

  Meta () {
    return {
      name: 'Device',
      fields: () => {
        return {
          owner: this.ReferenceField(User, []),
          environment: this.ReferenceField(Environment, Environment.REFERENCE_FIELDS(), false, 'devices')
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
      uuid: 1
    };
  }
}

export default Device;
