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

    let things = [];

    // subscribe to things list
    this.subscribe('Things.list')
    // Things is an array of thing objects which might be composed of things.
    this.set("things", things);
  },
  properties:{
    mwcRoute:{
      type:Object,
      name:"landing",
      params:{"view":"home"}
    },
    status:{
      type:String
    },
    notCordova:Boolean,
    things: Array
  },
  new:function(){
    this.set("mwcRoute.params.view", "new");
    Meteor.call('Thing.new',
      (error, document) => {
        if (error) {
          console.error("New deviceerror", error);
          return alert(`New deviceerror: ${error.reason || error}`);
        }

        this.things.push(document);
        console.log(this.things);
      }
    );
  },
  home:function(){
    this.set("mwcRoute.params.view", "home"); 
  },
  openToast: function() {
    this.$.toast.open();
  }
});


