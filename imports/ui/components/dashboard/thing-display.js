class thingDisplay {
  beforeRegister () {
    this.is = "thing-display";
    this.properties = {
      uuid: String,
      thing: {
        type: Object
      },
      loader:Number,
    };
  }

  get behaviors () {
    return [
      mwcMixin,
    ];
  }

  get trackers () {
    return [
      "subThing(uuid)",
      "setThing(uuid)"
    ];
  }

  attached () {
    const span = this.$.loading;
    this.loader = setInterval(function() {
      if ((span.innerHTML += '.').length == 4) 
        span.innerHTML = '';
    }, 500);

    //clearInterval( this.loader ); // at some point, clear the setInterval
  }

  subThing (uuid) {
    if (uuid) {
      this.subscribe('Things.one', uuid);
    }
  }

  setThing (uuid) {
    if (uuid) {
      let thing = Things.findOne({uuid: uuid});
      this.set('thing', thing);
    }
  }

  deleteThing (e) {
    this.fire("delete-thing",{
      thing: this.thing,
      target: e.target
    });
  }


  createTestThing () {
    Meteor.call('Thing.register',
      {
        uuid: this.thing.uuid,
        token: this.thing.token
      },
      {
        testThing: true
      },
      (error, document) => {
        if (error) {
          console.error("New deviceerror", error);
          return alert(`New deviceerror: ${error.reason || error}`);
        }
      }
    );
  }
}

Polymer(thingDisplay);

