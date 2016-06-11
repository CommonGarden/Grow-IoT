import BaseDocument from '../base';

let MESSAGES_TTL = 60; // seconds

/*
 * createdAt: timestamp when created
 * device: device associated with data
 *    _id
 *  body
*/
Message = class Message extends BaseDocument {
  // Needed?
  constructor() {
    super();
  }

  Meta () {
    return {
      name: 'Message',
      fields: () => {
        return {device: this.ReferenceField(Device)};
      }
    };
  }

  send (device, message) {
    return !!this.documents.insert({
      createdAt: new Date(),
      device: {
        _id: device._id
      },
      body: message
    });
  }
}

// Auto-expire messages after MESSAGES_TTL seconds.
// Message.Meta.collection._ensureIndex(
//   {createdAt: 1}
// ,
//   {expireAfterSeconds: MESSAGES_TTL});


export default Message;
