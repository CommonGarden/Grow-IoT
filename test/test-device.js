// const Thing = require('Grow.js');


// const testDevice = new Thing({
//   // PUT YOUR UUID AND TOKEN HERE OR SUPPLY THEM AS ARGUMENTS
//   uuid: 'u',
//   token: 't',
//   component: 'TestDevice',

//   properties: {
//     state: 'off',
//     interval: 3000
//   },

//   start: function () {
//     setInterval(()=> {
//       testDevice.call('temp_data');
//     }, this.get('interval'));
//   },

//   turn_on: function () {
//     console.log('on');
//     testDevice.set('state', 'on');
//   },

//   turn_off: function () {
//     console.log('off');
//     testDevice.set('state', 'off');
//   },

//   temp_data: function () {
//     let temp = Math.random() * 100;

//     console.log(temp);

//     testDevice.emit('temperature', temp);
//   }
// });

// testDevice.connect();
