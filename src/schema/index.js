import { EventsSchema } from './events';
import { ThingSchema } from './things';
const rootSchema = [`
type Query {
  getThing(
  uuid: String!
  token: String,
  owner: String,
  component: String,
  name : String,
  ): [Thing]
}
schema {
  query: Query
}
`];

const schema = [...rootSchema, ...EventsSchema, ...ThingSchema];
export default schema;
