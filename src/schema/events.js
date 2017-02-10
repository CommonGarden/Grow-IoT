export const EventsSchema = [`
scalar Date
type thingEntry {
    _id: String
}
type eventEntry {
    type: String,
    value: Int,
    timestamp: Date
}
type Event {
  _id: String,
  thing: thingEntry,
  event: eventEntry,
  insertedAt: Date
}
`];

