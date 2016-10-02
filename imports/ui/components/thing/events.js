Polymer({
  is:"thing-actions",
  properties:{
    name:{
      type:String,
      value:"Arun Kumar"
    },
    nickname:{
      type:String,
      value:"tkay"
    },
    show:{
      type:String,
      value:"show"
    },
    nndHidden:{
      type:Boolean,
      value:true
    }
  },
  showNickName:function(){
    this.nndHidden = !this.nndHidden;
    this.show = this.nndHidden ? "show" : "hide";
  }

})

// Device.EventComponent = class EventComponent extends Device.DisplayComponent {
//   onCreated() {
//     return super.onCreated();
//   }

//   eventsList() {
//     let device = this.device();
//     if (device.thing.events) {
//       var eventlist = [];
//       _.each(device.thing.events, (value, key, list) => {
//         value.id = key;
//         eventlist.push(value);
//       });
//     }
//     return eventlist;
//   }
// }

// Device.EventComponent.register('Device.EventComponent');
