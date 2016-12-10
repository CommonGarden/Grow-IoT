class thingDisplay {
  beforeRegister () {
    this.is = "thing-display";
    this.properties = {
      uuid: String,
      thing: Object,
      loader:Number,
    };
    this.observers = [
      '_thingChange(thing.component)'
    ];
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
  }

  detached() {
    clearInterval(this.loader);
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
        component: 'test-thing',
        onlineSince: true,
        properties: {
          state: "on"
        }
      },
      (error, document) => {
        if (error) {
          console.error("New deviceerror", error);
          return alert(`New deviceerror: ${error.reason || error}`);
        }
      }
    );
  }

  _thingChange(type) {
    if (!_.isUndefined(this.thing.component)) {
      const container = this.$.container;
      if(container.getAttribute('data-type') !== type) {
        container.innerHTML = '';
        container.setAttribute('data-type', type);
        let children = [this.thing.component];
        const docFrag = document.createDocumentFragment();
        for(let i = 0; i < children.length; i++) {
          const child = document.createElement(children[i]);
          child.setAttribute('legit-child', 'true'); // LOL
          child.setAttribute('uuid', this.thing.uuid);
          const self = this;
          function onDemandChange(e) {
            const change = e.detail;
            const arr = change.path.split(/\./);
            if (arr.length > 1) {
              return self._serveChildDemand(e.target, arr[1]);
            }
            self._serveChildDemands(e.target);
          };
          child.addEventListener('demands-change', onDemandChange)
          docFrag.appendChild(child);
        }

        Polymer.dom(container).appendChild(docFrag);
      }
    }
  }

  _serveChildDemands(child) {
    const demands = child.demands || {};
    for(key of Object.keys(demands)){
      const demand = demands[key];
      const path = demand.path;
      if(path === undefined) {
        return console.warn(`path not defined for ${key}`, child);
      }
      child.set(key, this.get(path));
    }
  }

  _serveChildDemand(child, key) {
    const demand = child.demands[key];
    const path = demand.path;
    if(path === undefined) {
      return console.warn(`path not defined for ${key}`, child);
    }
    child.set(key, this.get(path));
  }
}

Polymer(thingDisplay);

