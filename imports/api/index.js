import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	import './things/server-methods.js';
	import './events/publish.js';
	import './things/publish.js';
}

import './things/methods.js';
