import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';
import _ from 'underscore';

import getSchema from 'grow-graphql-schema';
const config = {
  database: process.env.MONGO_URL
};
const ifUser = (root, args, context) => {
  if (!context.userId) {
    throw Error('unautherized');
  }
}
const validate = {};
_.each(['allThings', 'allEvents', 'getThing', 'getEvent'], v => {
  validate[v] = ifUser;
});
const schema = getSchema({ config, validate })

createApolloServer({
  schema,
});
