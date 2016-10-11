Polymer({
  is:"data-viz",
  properties:{
    events: Object
  },
  tracker:function(){
    this.subscribe('Thing.datapointsByType');
    
    // TODO: list events in a thing object.
    let events = Things.find({
      uuid: this.uuid
    },
    {
      fields: {
        _id: 1,
        events: 1
      }
    });
    this.set('events', events);
    // if (events) {
    //   var eventlist = [];
    //   _.each(thing.events, (value, key, list) => {
    //     value.id = key;
    //     eventlist.push(value);
    //   });
    // }
  }
});