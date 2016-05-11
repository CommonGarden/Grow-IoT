import Actions from './actions';
import Events from './events';

var _ = require('underscore')


class Thing {
  /**
   * Constructs a new thing object.
   * @param {Object} config  
   * @return     A new events object
  */
  constructor(config) {
    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(this, config);
    }

    try {
      // We need the methods defined in the config, so we _.extend state.json.
      var state = require('./state.json');
      _.extend(this, state);
    } catch (err) {
      // Do nothing.
    }

    // Register actions events
    this.actions = Actions.register(config);
    this.events = Events.register(config);
  }
};

export default Thing;
