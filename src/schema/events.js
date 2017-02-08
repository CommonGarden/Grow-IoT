export const EventsSchema = [`
  _id: String,
  thing: {
    _id: String
  },
  event: {
    type: String,
    value: Number,
    timestamp: Date
  },
  insertedAt: Date
`];

