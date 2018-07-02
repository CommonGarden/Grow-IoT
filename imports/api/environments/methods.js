import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { EJSON } from 'meteor/ejson';
import uuid from 'uuid/v1';

/*
 * Environment methods
*/
Meteor.methods({
    /*
   * Creates a new thing with UUID and Token.
  */
    'Environment.new': function (config, auth) {
        check(config, Match.OneOf(Object, null));
        check(auth, Match.OneOf({
            uuid: String,
            token: String
        }, undefined));

        let document;

        // Must be a logged in user.
        if (Meteor.userId()) {
            if (auth) {
                document = {
                    uuid: auth.uuid,
                    token: auth.token,
                    owner: Meteor.userId(),
                    config,
                };
            } else {
                document = {
                    uuid: uuid(),
                    token: Random.id(32),
                    owner: Meteor.userId(),
                    registeredAt: new Date(),
                    config,
                };
            }
            if (!Environments.insert(document)) { throw new Meteor.Error('internal-error', 'Internal error.'); }

            return document;
        }
    },

    /*
   * Add thing to an environment
  */
    'Environment.addThing': function (environmentUuid, thingUuid) {
        check(environmentUuid, String);
        check(thingUuid, String);

        let environment = Environments.findOne(auth, {
            fields: {
                _id: 1,
                contains: 1
            }
        });
        if (!environment) { throw new Meteor.Error('unauthorized', 'Environment' + ' not found'); }

        return Environments.update(thing._id, {
            $push: { contains: thingUuid }
        });
    },

    /*
   * Add thing to an environment
   */
    'Environment.removeThing': function (environmentUuid, thingUuid) {
        check(environmentUuid, String);
        check(thingUuid, String);

        let environment = Environments.findOne({
            'uuid': environmentUuid,
            'owner': Meteor.userId()
        }, {
            fields: {
                _id: 1,
                contains: 1
            }
        });
        if (!environment) { throw new Meteor.Error('unauthorized', 'Environment' + ' not found'); }

        return Environments.update(thing._id, {
            $pull: { votes: { $eq: thingUuid } }
        });
    },

    /*
   * Delete thing.
  */
    'Environment.delete': function (uuid) {
        check(uuid, String);

        // Users can only delete things they own... someone please audit this...
        let thing = Environments.findOne({
            'uuid': uuid,
            'owner': Meteor.userId()
        });
        if (!thing) { throw new Meteor.Error('unauthorized', 'Unauthorized.'); }

        return Environments.remove(thing._id);
    },

    /*
   * TODO be able to share a read only view of the device publically.
   */
    'Environment.setAccess': function (uuid, options) {
        check(uuid, String);
        // TODO a more robust check of the options object
        check(options, Object);
        // Users can only delete things they own... someone please audit this...
        let thing = Environments.findOne({
            'uuid': uuid,
            'owner': Meteor.userId()
        });
        if (!thing) { throw new Meteor.Error('unauthorized', 'Unauthorized.'); }

        return Environments.update(thing._id, {
            $set: {
                publicReadonly: options.publicReadonly
            }
        });
    }
});


function getEnvironmentByUUID (uuid) {
    check(uuid, String);
    // Users can only delete things they own... someone please audit this...
    let thing = Environments.findOne({
        'uuid': uuid,
        'owner': Meteor.userId()
    });

    if (!thing) {
        throw new Meteor.Error('unauthorized', 'Unauthorized.');
    } else {
        return thing;
    };
}
