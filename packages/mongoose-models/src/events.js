import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EventsSchema = new Schema({
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
});

export default mongoose.model('Events', EventsSchema, 'Events');
