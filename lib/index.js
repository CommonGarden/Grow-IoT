import Thing from 'Thing.js';
import SetupStreams from './streams'
import API from './api'
import DDP from './connect'

const _ = require('underscore');
const assert = require('assert');
const util = require('util');
const Duplex = require('stream').Duplex;
const fs = require('fs');
const RSVP = require('rsvp');
const later = require('later');

// Use local time.
later.date.localTime();

class Grow {
  // callAction: Actions.callAction,
  constructor(config) {

    this.thing = new Thing(config);
    
    // What does this do?
    Duplex.call(this, _.defaults(this.thing, {objectMode: true, readableObjectMode: true, writableObjectMode: true}));

    this.uuid = this.thing.uuid || null;
    this.token = this.thing.token || null;

    // Remove?
    this._messageHandlerInstalled = false;


    // TODO: test to make sure actions are registered even when there is no connection.
    DDP.connect(function(error, data) {
      if (error) {
        console.log(error);

        // TODO: register actions and make attempt to make reconnection.
        // The idea is that if connection is lost the program shouldn't stop,
        // but should also try to reconnect.
      }

      // // These should register reguardless of whether device connects.
      // var actionsRegistered = new RSVP.Promise(function(resolve, reject) {
      //   try {
      //     resolve(self.registerActions(config));
      //   }
      //   catch (error) {
      //     reject(error);
      //   }
      // });

      // // These should register reguardless of whether device connects.
      // var eventsRegistered = new RSVP.Promise(function(resolve, reject) {
      //   try {
      //     resolve(self.registerEvents(config));
      //   }
      //   catch (error) {
      //     reject(error);
      //   }
      // });


      // actionsRegistered.then(function(value) {
      //   self.pipeInstance();

      //   if (!_.isUndefined(callback)) {
      //     callback(null, self);
      //   }
      // });
    });
  }

  // On _write, call API.sendData()
  _write(chunk, encoding, callback) {
    API.sendData(chunk, callback);
  }

  /*
   * We are pushing data to a stream as commands are arriving and are leaving
     to the stream to buffer them. So we simply ignore requests for more data.
   */
  _read(size) {}
};

export default Grow;
