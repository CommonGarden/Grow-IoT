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
      mwcMixin, mwcRouter, AppState
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
  _deleteThisThing(e){
    const thing = e.detail.thing;
    this.set("selectedThing",thing);
    const dialog = this.$.dialog;
    dialog.sizingTarget = e.target;
    dialog.positionTarget = e.target;
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
