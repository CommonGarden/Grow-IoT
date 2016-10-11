import { mwcRouter } from 'meteor/mwc:router';
import { mwcMixin } from 'meteor/mwc:mixin';


Polymer({
  is:"main-layout",
  behaviors:[mwcMixin,mwcRouter],
  tracker:function(){
    this.set("status",Meteor.status().status);
    if(!Meteor.isCordova){
      this.notCordova = true;
    }

    // subscribe to things list
    this.subscribe('Things.list');
    let things = Things.find({}).fetch();
    this.set('things', things);
  },

  properties:{
    mwcRoute:{
      type:Object,
      name:"landing",
      params:{"view":"home"}
    },
    status:{
      type: String
    },
    notCordova:Boolean,
    things: {
      type: Array
    }
  },

  new:function(){
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
  },

  home:function(){
    this.set("mwcRoute.params.view", "home"); 
  }
});


