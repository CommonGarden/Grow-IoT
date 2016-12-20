import { AppState } from '../state';
import { setToast, setError } from '../actions';

class growMainView {
  beforeRegister() {
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
      },
      limit:Number
    };
    this.actions = { setError, setToast };

  }
  get trackers (){
    return [
      "subThings(limit)",
      "setThings(limit)"
    ];
  }

  get behaviors() {
    return [
      mwcMixin, AppState
    ];
  }

  resetLayout() {
    this.$.headerPanel.resetLayout();
  }

  tracker() {
    this.set("status", Meteor.status().status);
    if(!Meteor.isCordova){
      this.notCordova = true;
    }
  }
  subThings(){
    this.subscribe('Things.list');

  }
  setThings(){
    let things = Things.find({}).fetch();
    this.set('things', things);
  }
  thingFilter(searchStr) {
    if (!searchStr) {
      // set filter to null to disable filtering
      return null;
    }
    // return a filter function for the current search string
    searchStr = searchStr.toLowerCase();
    return function(thing) {
      return ((thing.name || '').indexOf(searchStr) != -1);
    }
  }
  _deleteThisThing(e){
    const thing = e.detail.thing;
    this.set("selectedThing",thing);
    const dialog = this.$.dialog;
    const t = e.detail.target;
    dialog.sizingTarget = t;
    dialog.positionTarget = t;
    dialog.open();
  }
  _confirmDelete(e){
    const thing = this.selectedThing;
    const self = this;
    Meteor.call('Thing.delete',
      thing.uuid,
      (error, document) => {
        if (error) {
          self.dispatch('setError', error, {
            thing,
          });
        } else {
          self.dispatch('setToast', `Successfully deleted.`);
        }
      }
    );
  }
  _ifEmpty(array){
    return !!array && !!array.length;
  }
}

Polymer(growMainView);
