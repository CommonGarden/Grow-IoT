import { makeExecutableSchema } from 'graphql-tools';
import mongoose from 'mongoose';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import GrowSchema from './schema/index';
import { Events, Things, User, Password } from 'grow-mongoose-models';

import {
  APP_SECRET,
  MONGO_URL,
} from './apiKeys';


const rootResolvers = ({ config = {}, validate }) => {
  const mongo_url = MONGO_URL || config.database;
  const app_secret = APP_SECRET || config.secret;
  mongoose.connect(mongo_url);
  return {
    Query: {
      getThing(root, { uuid }, context) {
        validate && validate.getThing && validate.getThing(root, { uuid }, context);
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
      getEvent(root, { _id }, context) {
        validate && validate.getEvent && validate.getEvent(root, { _id }, context);
        return new Promise((resolve, reject) => {
          Events.findById(_id, function(err, event) {
            if (err){
              reject(err);
            }
            else {
              resolve([event]);
            }
          });
        });
      },
      allThings(root, { limit, skip }, context) {
        validate && validate.allThings && validate.allThings(root, { limit, skip }, context);
        const l = limit || 10;
        const s = skip || 0;
        const q = Things.find({})
          .sort({registeredAt: -1})
          .skip(s)
          .limit(l);
        return new Promise((resolve, reject) => {
          q.exec(function(err, things) {
            if (err){
              reject(err);
            }
            else {
              resolve(things);
            }
          });
        });
      },

      allEvents(root, { limit, skip }, context) {
        validate && validate.allEvents && validate.allEvents(root, { limit, skip }, context);
        const l = limit || 10;
        const s = skip || 0;
        const q = Events.find({})
          .sort({insertedAt: -1})
          .skip(s)
          .limit(l);
        return new Promise((resolve, reject) => {
          q.exec(function(err, events) {
            if (err){
              reject(err);
            }
            else {
              resolve(events);
            }
          });
        });
      },
    },
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize(value) {
        return value.getTime(); // value sent to the client
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      },
    }),
  };
};

const executableSchema = ({ config, validate }) => {
  return makeExecutableSchema({
    typeDefs: GrowSchema,
    resolvers: rootResolvers({ config, validate }),
  });
};

export default executableSchema;
