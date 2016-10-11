class growMainView {
  beforeRegister(){
    this.is = "grow-main-view";
    this.properties = {
      things: {
        type: Array
      },
      status:{
        type: String
      },
      notCordova:Boolean,
      mwcRoute:{
        type:Object,
        name:"dashboard",
        params:{"view":"home"}
      }
    };
  }

  get behaviors(){
    return [
      mwcMixin, mwcRouter
    ];
  }

  resetLayout(){
    this.$.headerPanel.resetLayout();
  }

  tracker() {
    this.set("status",Meteor.status().status);
    if(!Meteor.isCordova){
      this.notCordova = true;
    }
    this.subscribe('Things.list');
    let things = Things.find({}).fetch();
    if (things.length === 0) {
      // TODO: empty state
      this.set("mwcRoute.params.view", "new");
    }
    this.set('things', things);
  }

  new() {
    this.set("mwcRoute.params.view", "new");
    Meteor.call('Thing.new',
      (error, document) => {
        if (error) {
          console.error("New deviceerror", error);
          return alert(`New deviceerror: ${error.reason || error}`);
        }

        let things = this.get('things');
        things.push(document);

        this.set('things', things);
      }
    );
  }
}

Polymer(growMainView);
