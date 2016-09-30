import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	import './thing/server-methods.js';
}

// 
import './environment/methods.js';
import './notifications/methods.js';
import './thing/methods.js';

