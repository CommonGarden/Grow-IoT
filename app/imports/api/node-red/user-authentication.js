import { Accounts } from 'meteor/accounts-base';

module.exports = {
   type: "credentials",
    authenticate: async function(username, password) {
        let user = Accounts.findUserByEmail(username);
        if (Accounts._checkPassword(user, password)) {
            return {username, permissions: '*'};
        }
        return null;
   },
   users: async function(username) {
       let account = Accounts.findUserByEmail(username);
       if (account) {
           return {username, permissions: '*'};
       }
       return null;
   },
}
