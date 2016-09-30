import { Meteor } from 'meteor/meteor';

import 'documents/events';
import 'documents/things';

if (Meteor.isServer) {
	import 'documents/messages';
}
