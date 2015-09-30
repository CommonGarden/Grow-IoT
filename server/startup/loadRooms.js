Meteor.startup(function () {
  if (Rooms.find().count() === 0) {
    var rooms = [
      {'name': 'Dubstep-Free Zone',
        'description': 'Fast just got faster with Nexus S.'},
      {'name': 'All dubstep all the time',
        'description': 'Get it on!'},
      {'name': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.'}
    ];
    for (var i = 0; i < rooms.length; i++)
      Rooms.insert({name: rooms[i].name, description: rooms[i].description});
  }
});
