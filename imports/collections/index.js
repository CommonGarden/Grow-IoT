import { Meteor } from 'meteor/meteor';

import { Events } from './events';
import { Things } from './things';

if (Meteor.isServer) {
	import { Messages } from './messages';
}
