import { Meteor } from 'meteor/meteor';
import './collections';

if (Meteor.isServer) {
  import './thing/publish';
  import './environments/publish.js';
  import './notifications/publish';
  import './images/publish';
  import './thing/server-methods';
  import './notifications/server-methods.js';
  import './elastic';
  import './coap/coap.js';
  import './Users/server/index.js';
  import './node-red/node-red.js';
}

import './thing/methods';
import './notifications/methods';
import './environments/methods'
import './images/methods';
