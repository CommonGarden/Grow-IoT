import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ThingsSchema = new Schema({
    _id: String,
    uuid: String,
    token: String,
    owner: String,
    component: String,
    name : String,
    onlineSince: Boolean,
    properties: {
        state: String
    },
    registeredAt: Date
});

export default mongoose.model('Things', ThingsSchema, 'Things');
