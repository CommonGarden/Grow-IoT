import Actions from './actions';
import Events from './events';

const _ = require('underscore')
const EventEmitter = require('events');

class Thing extends EventEmitter {
  /**
   * Constructs a new thing object.
   * @param {Object} config
   * @return     A new events object
  */
  constructor(config) {
    super();

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(this, config);
    }

    // Register actions events
    Actions.register(this);
    this.events = new Events(this);
  }
};

export default Thing;
