import BaseDocument from '../base';

/*
 * insertedAt
 * device: device associated with data
 *   _id
 * body
*/
class Notifications extends BaseDocument {
  constructor() {
    super();
  }

  Meta () {
  	return {
	    name: 'Notifications',
	    collection: 'Notifications',
	    fields: () => {
	      return {device: this.ReferenceField(Device)};
	    }
  	};
  }
}

export default Notifications;
