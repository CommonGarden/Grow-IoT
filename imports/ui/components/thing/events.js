Polymer({
  is:"thing-events",
  properties:{
    events: Object
  },
  tracker:function(){
    console.log(this.events);
  }
});
