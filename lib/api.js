// /**
//  * Send data to Grow-IoT server.
//  * @param      {Object}  data
//  * @param      {Function} callback
//  */
// GROWJS.prototype.sendData = function (data, callback) {
//   var self = this;

//   if (!self.ddpclient || !self.uuid || !self.token) {
//     callback("Invalid connection state.");
//     return;
//   }

//   self.ddpclient.call(
//     'Device.sendData',
//     [{uuid: self.uuid, token: self.token}, data],
//     function (error, result) {
//       if (error) console.log(error);

//       if (!_.isUndefined(callback)) {
//         callback(null, result);
//       }
//     }
//   );
// };

// /**
//  * Emit device event to Grow-IoT server.
//  * @param      {Object}  event
//  * @param      {Function} callback
//  */
// GROWJS.prototype.emitEvent = function (eventMessage, callback) {
//   var self = this;

//   var body = eventMessage;
//   body.timestamp = new Date();

//   self.ddpclient.call(
//     'Device.emitEvent',
//     [{uuid: self.uuid, token: self.token}, body],
//     function (error, result) {
//       if (!_.isUndefined(callback)) {
//         callback(error, result);
//       }
//     }
//   );
// };


// // TODO: split this into two functions.
// *
//  * Update device property on Grow-IoT server.
//  * @param {String} componentName  Name of the component you want to update.
//  * @param {String} propertyKey  Name of the of the property you wish to update
//  * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
//  * @param {Function} callback  An optional callback.
 
// GROWJS.prototype.updateProperty = function (componentName, propertyKey, value, callback) {
//   var self = this;

//   var thing = self.config;

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

//   self.writeChangesToGrowFile();

//   self.ddpclient.call(
//     'Device.udpateProperty',
//     [{uuid: self.uuid, token: self.token}, componentName, propertyKey, value],
//     function (error, result) {
//       if (!_.isUndefined(callback)) {
//         callback(error, result);
//       }
//     }
//   );
// };
