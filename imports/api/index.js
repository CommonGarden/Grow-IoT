import { Meteor } from 'meteor/meteor';
import './collections';

if (Meteor.isServer) {
  import './server-methods.js';
  import './publish.js';
  import './elastic';
  import './coap.js';
  import './graphql/server';
}

import './methods.js';
