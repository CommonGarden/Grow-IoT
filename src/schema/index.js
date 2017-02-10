import { EventsSchema } from './events';
import { ThingSchema } from './things';

const schema = [...EventsSchema, ...ThingSchema];
export default schema;
