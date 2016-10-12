Polymer({
  is:"thing-events",
  properties:{
    events: Object
  },
  tracker:function(){
    this.subscribe('Thing.events');

    // TODO: list events in a thing object.
    let events = Events.find({
      uuid: this.uuid
    },
    {
      fields: {
        _id: 1,
        events: 1
      }
    });
    console.log(events);
    this.set('events', events);
  }
});
