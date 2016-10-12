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
    };
  }

  get behaviors(){
    return [mwcMixin];
  }

  toast(arg) {
    this.$.paper_toast.hide();
    this.async(()=> {
      this.$.paper_toast.show(arg);
    }, 400);
  }

  tracker() {
    if (Meteor.status().connected) {
      if (this.$.paper_toast.text != "server connected") {
        this.toast("server connected");
      }
    } else {
      if (this.$.paper_toast.text != "lost server connection") {
        this.toast("lost server connection");
      }
    }
  }
};

Polymer(globalToast);
