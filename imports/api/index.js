import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	import './thing/server-methods.js';
	import './events/publish.js';
	// import './notifications/publish.js';
	import './thing/publish.js';
}

// import './notifications/methods.js';
import './thing/methods.js';
