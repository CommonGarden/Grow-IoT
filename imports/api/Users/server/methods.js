import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';

Meteor.methods({
    'users.sendVerificationEmail': function usersSendVerificationEmail() {
        return Accounts.sendVerificationEmail(this.userId);
    },

    'users.editProfile': function usersEditProfile(profile) {
    // TODO: make sure user is logged in, if not, throw error.
        check(profile, {
            emailAddress: String,
            profile: {
                name: {
                    first: String,
                    last: String,
                },
            },
        });

        return editProfile({ userId: this.userId, profile })
            .then(response => response)
            .catch((exception) => {
                throw new Meteor.Error('500', exception);
            });
    },
});

