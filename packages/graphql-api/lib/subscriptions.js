import PubSub from 'graphql-subscriptions';
import schema from 'grow-graphql-schema/schema';

console.log(PubSub);

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
});

export { subscriptionManager, pubsub };