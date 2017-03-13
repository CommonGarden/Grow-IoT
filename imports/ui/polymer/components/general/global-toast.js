import { AppState } from '../../state';
import { setToast } from '../../actions';

class globalToast {
  beforeRegister(){
    this.is = "global-toast";

    this.properties = {
      cordova_class: {
        typr: String,
        value: ()=> {
          return (Meteor.isCordova ? "fit-bottom" : "");
        },
      },
      text: {
        type: String,
        statePath: 'toast.text',
      },
      duration: {
        type: Number,
        statePath: 'toast.duration', 
      },
      undo: {
        type: Object,
        value: {},
      },

    };
    this.actions = { setToast };
    this.observers = [
      '_toast(text, duration)',
    ];

  }

  get behaviors(){
    return [
      mwcMixin,
      AppState,
    ];
  }

  _undo() {
    this.undo = {};

    this.$.paper_toast.hide();
  }
  _toast(text, duration = 4000) {
    if (text) {
      this.$.paper_toast.hide();
      this.async(() => {
        this.$.paper_toast.show();
      }, 400);
    }
  }
  toast(text) {
    this.$.paper_toast.hide();
    this.async(() => {
      // this.$.paper_toast.text = text;
      this.dispatch('setToast', text);
      this.$.paper_toast.show();
    }, 400);
  }

  tracker() {
    if (Meteor.status().connected) {
      if (this.$.paper_toast.text !== 'server connected') {
        this.toast('server connected');
      }
    } else if (this.$.paper_toast.text !== 'lost server connection') {
      this.toast('lost server connection');
    }
  }
}

Polymer(globalToast);
