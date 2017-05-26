import { Meteor } from 'meteor/meteor';
import './collections';

if (Meteor.isServer) {
  import './thing/publish';
  import './notifications/publish';
  import './images/publish';
  import './images/s3.js';
  import './thing/server-methods';
  import './notifications/server-methods.js';
  // import './events/eventBus';
  // import './elastic';
  import './coap/coap.js';
}

import './thing/methods';
import './notifications/methods';
import './images/methods';
