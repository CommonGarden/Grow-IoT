Rooms = new Mongo.Collection("rooms");

Rooms.allow({
  insert: function (userId, room) {
    return userId && room.owner === userId;
  },
  update: function (userId, room, fields, modifier) {
    return userId && room.owner === userId;
  },
  remove: function (userId, room) {
    return userId && room.owner === userId;
  }
});