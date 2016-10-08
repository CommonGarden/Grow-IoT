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
    // let uuid = this.get('uuid');
    // console.log(uuid);
    // this.subscribe('Thing.one', uuid);
    // debugger;
    // console.log(Things.findOne({
    //   'uuid': uuid
    // }));
  }
})

// // OLD CODE: for reference...
// class DisplayComponent extends CommonComponent {
//   onCreated() {
//     super.onCreated();

//     this.currentDeviceUuid = new ComputedField(() => {
//       return FlowRouter.getParam('uuid');
//     });

//     this.device = new ComputedField(() => {
//       return Device.documents.findOne(
//         {
//           uuid: this.currentDeviceUuid()
//         }
//       );
//     });

//     this.autorun(computation => {
//       let deviceUuid = this.currentDeviceUuid();
//       if (!deviceUuid) { return; }

//       this.subscribe('Device.one', deviceUuid);

//       this.subscribe('Data.points', deviceUuid);

//       return this.subscribe('Data.events', deviceUuid);
//     });

//     return this.autorun(computation => {
//       if (!this.subscriptionsReady()) { return; }

//       let device = Device.documents.findOne(
//         {
//           uuid: this.currentDeviceUuid()
//         }
//       , {
//         fields: {
//           thing: 1
//         }
//       });

//       // Set page title to device name.
//       document.title = device.thing.name;

//       return device;
//     });
//   }

//   device() {
//     return this.device();
//   }

//   thing() {
//     return this.device().thing;
//   }

//   components() {
//     return (this.device().thing.components != null);
//   }
  
//   datapoints() {
//     return Data.documents.find(
//       {
//         'device._id': this.device()._id
//       }
//     );
//   }

//   events() {
//     return super.events().concat({
//       'click .remove': this.remove
//     });
//   }

//   notFound() {
//     return this.subscriptionsReady() && !this.device();
//   }

//   remove() {
//     let device = this.device();
//     if (window.confirm("Are you sure you want to delete this device?")) {
//       return Meteor.call('Device.remove',
//         this.currentDeviceUuid(),
//         (error, documentId) => {
//           if (error) {
//             console.error("New deviceerror", error);
//             return alert(`New deviceerror: ${error.reason || error}`);
//           } else {
//             Bert.alert('Device deleted.', 'success', 'growl-top-right');
//             return FlowRouter.go('Dashboard');
//           }
//         }
//       );
//     }
//   }
// };

// DisplayComponent.register('DisplayComponent');
