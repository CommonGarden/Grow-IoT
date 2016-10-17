class thingDisplay {
  beforeRegister() {
    this.is = "thing-display";
    this.properties = {
      uuid: String,
      thing: {
        type: Object
      }
    };
  }
  get behaviors() {
    return [
      mwcMixin,
    ];
  }
  get trackers (){
    return [
      "subThing(uuid)",
      "setThing(uuid)"
    ];
  }
  tracker(){

  }
  subThing(uuid) {

    if(uuid){
      this.subscribe('Things.one', uuid);
    }
  }
  setThing(uuid){
    if(uuid){
      let thing = Things.findOne({uuid: uuid});
      this.set('thing', thing);
    }
  }
  deleteThing () {
    Meteor.call('Thing.delete',
      this.thing.uuid,
      (error, document) => {
        if (error) {
          console.error("Delete thing error", error);
          return alert(`Error: ${error.reason || error}`);
        }
      }
    );
  }
}

Polymer(thingDisplay);

