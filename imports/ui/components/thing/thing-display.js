import './actions.html';
import './events.html';
import './data-viz.html';
import { Meteor } from 'meteor/meteor';
import { mwcMixin } from 'meteor/mwc:mixin';

Polymer({
  is:"thing-display",
  behaviors:[mwcMixin],
  properties:{
    name:{
      type:String,
      value:"Dr. Dose" // Temporary...
    },
    uuid: String,
    token: String
  },
  // getMeteorData:function(){
  //   this.uuid = FlowRouter.getParam('uuid');
  // },
  tracker:function(){
    // subscribe to things list
    let uuid = this.get('uuid');
    this.subscribe('Thing.one', uuid);
    debugger;
  }
})
