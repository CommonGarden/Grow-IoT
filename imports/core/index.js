import { Meteor } from 'meteor/meteor';

import { Events } from './collections/events';
import { Things } from './collections/things';

if (Meteor.isServer) {
	import { Messages } from './collections/messages';
}

// Documents are not getting created...
