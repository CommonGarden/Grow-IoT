import { Meteor } from 'meteor/meteor';

import { Events } from './events';
import { Things } from './things';
import { Notifications } from './notifications';
import { Images } from './images';
import { Environments } from './environments';

if (Meteor.isServer) {
	import { Messages } from './messages';
}


