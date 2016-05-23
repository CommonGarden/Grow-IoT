/**
 * Writes any changes to the state.json file. The state.json file is used for state. 
 * In case the device looses internet connnection or power and needs to reset, the grow file contains the instructions such as schedules, where the device is supposed to connect to.
 */

const fs = require('fs');

var writeChangesToState = () => {
  fs.writeFile('./state.json', JSON.stringify(this, null, 4), function (error) {
    if (error) return console.log('Error', error);
  });
};

export default writeChangesToState;
