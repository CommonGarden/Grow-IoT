import { EventsSchema } from './events';
import { ThingSchema } from './things';
const rootSchema = [`
type Query {
  getThing(
  uuid: String!
  ): [Thing]
getEvent(
_id: String!
  ): [Event]
}
schema {
  query: Query
}
`];

const schema = [...rootSchema, ...EventsSchema, ...ThingSchema];
export default schema;
