import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	import './thing/server-methods.js';
	import './events/publish.js';
	import './thing/publish.js';
}

import './thing/methods.js';
