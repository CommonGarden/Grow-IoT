import BaseDocument from '../base';

class User extends BaseDocument {
  constructor() {
    super();
  }

  Meta () {
    return {
      name: 'User',
      collection: Meteor.users
    };
  }
}

// Meteor.user = function(userId, fields) {
//   if (!fields && _.isObject(userId)) {
//     fields = userId;
//     userId = null;
//   }

//   // Meteor.userId is reactive
//   if (typeof userId === 'undefined' || userId === null) { userId = Meteor.userId(); }
//   if (typeof fields === 'undefined' || fields === null) { fields = {}; }

//   if (!userId) { return null; }

//   return User.documents.findOne(
//     {_id: userId}
//   ,
//     {fields});
// };

export default User;
