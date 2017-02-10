import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';
import GrowSchema from './schema/index';
import config from './config';
import { Events, Things, User, Password } from 'grow-mongoose-models';

import {
  APP_SECRET,
  MONGO_URL,
} from './apiKeys';
const mongo_url = MONGO_URL || config.database;
const app_secret = APP_SECRET || config.secret;
mongoose.connect(mongo_url);

const rootResolvers = {
  Query: {
    getThing(root, { uuid }, /* content */) {
      return new Promise((resolve, reject) => {
        Things.findOne({ uuid }, function(err, thing) {
          if (err){
            reject(err);
          }
          else {
            resolve([thing]);
          }
        });
      });
    },
    // authenticate(root, {
      // username,
      // password,
    // }, [> context <]) {
      // return new Promise((resolve, reject) => {
        // User.findOne({ username }, {'services.password.bcrypt': 1 }, (err, user) => {

          // if (err) reject(err)

          // if (!user) {

            // reject({ success: false, message: 'Authentication failed. User not found.' });
          // } else if (user) {

            // Password.comparePassword(password, user.services.password.bcrypt)
              // .then((r) => {

                // if (!r) {

                  // reject({ success: false, message: 'Authentication failed. Wrong password.' });
                // } else {

                  // // const token = jwt.sign(user, app.get('superSecret'), {
                  // // expiresIn : 60*60*24
                  // // });

                  // // return the information including token as JSON
                  // resolve({
                    // success: true,
                    // message: 'Use this token as param in your future requests!',
                    // token: token
                  // });
                // }
              // }).
              // catch((e) => {
                // throw e;
              // });
            // // if user is found and password is right
            // // create a token
          // }
        // });

      // })
    // },
  },
};
const executableSchema = makeExecutableSchema({
  typeDefs: GrowSchema,
  resolvers: rootResolvers,
});

export default executableSchema;
