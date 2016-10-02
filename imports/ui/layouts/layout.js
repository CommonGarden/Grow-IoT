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
    notCordova:Boolean

  },
  new:function(){
    this.set("mwcRoute.params.view", "new");
    // TODO:
    // Select device (eventually we'll add other things like plants and rooms)
    // Get UUID
  },
  home:function(){
    this.set("mwcRoute.params.view", "home"); 
  }
});


