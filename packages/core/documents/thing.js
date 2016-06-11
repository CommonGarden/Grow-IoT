import BaseDocument from '../base';

/* registeredAt
 * uuid: UUID of the device
 * token: token of the device
 * thing: a model of the device and its api
 * owner:
 *   _id
 * environment: the place a thing belongs too.
 *   _id
 * onlineSince
*/
Thing = class Thing extends BaseDocument {
  constructor() {
    super();
  }

  Meta () {
    return {
      name: 'Thing',
      fields: () => {
        return {
          owner: this.ReferenceField(User, [], false),
          environment: this.ReferenceField(Environment, Environment.REFERENCE_FIELDS(), false, 'things')
        };
      }
    };
  }
}

export default Thing;
