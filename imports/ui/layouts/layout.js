import './layout.html';
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
    // this.subscribe('Things.list');
    // debugger;
    // console.log(Things.find({}));
    // this.set('things', Things.find({}).fetch());
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

        // this.set('things', [document]);
        // console.log(this.things);
      }
    );
  },
  home:function(){
    this.set("mwcRoute.params.view", "home"); 
  }
});


