import { Meteor } from 'meteor/meteor';

import 'documents/user';
import 'documents/environment';
import 'documents/device';
import 'documents/data';
import 'documents/notifications';
import 'documents/thing';

if (Meteor.isServer) {
	import 'documents/messages';
}
