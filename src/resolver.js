import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';
import GrowSchema from './schema';
import config from './config';
import { Events, Things, User, Password } from 'grow-mongoose-models';

import {
  APP_SECRET,
  MONGO_URL,
} from './apiKeys';
const MONGO_URL = process.env.MONGO_URL || config.database;
const APP_SECRET = process.env.APP_SECRET || config.secret;
mongoose.connect(MONGO_URL);


const rootResolvers = {
  Query: {
    authenticate(root, {
      username,
      password,
    }, /* context */) {
    },
  },
};
const executableSchema = makeExecutableSchema({
  typeDefs: GrowSchema,
  resolvers: rootResolvers,
});

export default executableSchema;
