
// var API = {
// /**
//  * Send data to Grow-IoT server.
//  * @param      {Object}  data
//  * @param      {Function} callback
//  */
// sendData (data, callback) {
//   if (!this.ddpclient || !this.uuid || !this.token) {
//     callback("Invalid connection state.");
//     return;
//   }

//   this.ddpclient.call(
//     'Device.sendData',
//     [{uuid: this.uuid, token: this.token}, data],
//     function (error, result) {
//       if (error) console.log(error);

//       if (!_.isUndefined(callback)) {
//         callback(null, result);
//       }
//     }
//   );
// },

// /**
//  * Emit device event to Grow-IoT server.
//  * @param      {Object}  event
//  * @param      {Function} callback
//  */
// emitEvent (eventMessage, callback) {
  

//   var body = eventMessage;
//   body.timestamp = new Date();

//   this.ddpclient.call(
//     'Device.emitEvent',
//     [{uuid: this.uuid, token: this.token}, body],
//     function (error, result) {
//       if (!_.isUndefined(callback)) {
//         callback(error, result);
//       }
//     }
//   );
// },


// // TODO: split this into two functions... it sucks.

//  * Update device property on Grow-IoT server.
//  * @param {String} componentName  Name of the component you want to update.
//  * @param {String} propertyKey  Name of the of the property you wish to update
//  * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
//  * @param {Function} callback  An optional callback.
 
// updateProperty(componentName, propertyKey, value, callback) {
  

//   var thing = this.config;

//   // Find properties in top level thing object
//   for (var key in thing) {
//     // Find properties in components 
//     if (key === "components") {
//       for (var item in thing.components) {
//         if (thing.components[item].name === componentName) {
//           thing.components[item][propertyKey] = value;
//         }
//       }
//     } else if (thing[key] === componentName) {
//       thing[propertyKey] = value;
//     }
//   }

//   this.writeChangesToGrowFile();

//   this.ddpclient.call(
//     'Device.udpateProperty',
//     [{uuid: this.uuid, token: this.token}, componentName, propertyKey, value],
//     function (error, result) {
//       if (!_.isUndefined(callback)) {
//         callback(error, result);
//       }
//     }
//   );
// }


// }

// export default API;
