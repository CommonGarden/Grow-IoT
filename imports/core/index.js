import { Meteor } from 'meteor/meteor';

import './collections/events';
import './collections/things';

if (Meteor.isServer) {
	import './collections/messages';
}
