export const MONGO_URL = process.env.MONGO_URL;
import monq from 'monq';
export const client = monq(MONGO_URL);
export const queue = client.queue('eventsqueue');


