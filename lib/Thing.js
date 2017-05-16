const _ = require('underscore');
const EventEmitter = require('events');
const DDPClient = require('ddp');
const coap = require('coap');
const url = require('url');

/**
 * A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
 * @extends EventEmitter
 * @param {Object} config  an object containing metadata, properties, events, and/or actions.
 * @param {Function} callback  an optional callback
 * @return {Thing}   A new thing object
 */
class Thing extends EventEmitter {
  constructor(config) {
    super();

    if (!this.properties) {
      this.properties = {};
    }

    if (!this.uuid && !this.token) {
      new Error('UUID and token are required to connect to a Grow-IoT instance.');
    }

    this._messageHandlerInstalled = false;

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      this.config = config;
      _.extend(this, config);
      this.functions = _.functions(config);
    }

    if (!_.isUndefined(this.initialize)) {
      this.initialize();
    }

    if (!_.isUndefined(this.start)){
      this.start();
    }
    
    // Emit 'ready' event to show that the Thing has initialized.
    this.emit('ready');
  }

  /**
   * Update a property. Emit an event.
   * @param {String} key The property to be updated.
   * @param {Object | Number | String | Boolean} value The value to update the property to.
   */
  set (key, value) {
    this.properties[key] = value;
    this.emit('property-updated', key);
  }

  /* Get a property by key.
   * @param {String} key Use to get the current value of a property.
   * @returns {Object | Number | String | Boolean}
   */
  get (key) {
    return this.properties[key];
  }

  /**
   * Call a method, emit event.
   * @param      {String}  method The method to call.
   * @param      {Object}  options Optional, options to call with the function.
   * @returns    {Object | Number | String | Null | Boolean}  output Returns any returns of the called method. 
   */
  call (method, options) {
    try {
      if (!_.isUndefined(options)) {
        var output = this[method](options);
      }
      else {
        var output = this[method]();
      }

      if (!_.isUndefined(output)) {
        this.emit(method, options, output);
        // We return any returns of called functions.
        return output;
      } else {
        this.emit(method, options);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  /**
   * Connects to Grow-IoT server over DDP. Help us support more protocols (like CoAP)! ; )
   * @param {Object}  options  Connection options
   */
  connect (options) {
    this.ddpclient = new DDPClient(_.defaults(options, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.ddpclient.connect((error, wasReconnect) => {
      if (error) {
        console.log(error)
      }

      if (wasReconnect) {
        console.log('Reestablishment of a Grow server connection.');
      } else {
        console.log('Grow server connection established.');
      }

      this.ddpclient.call(
        'Thing.register',
        [{uuid: this.uuid, token: this.token}, this.config],
        (error, result) => {
          if (error) {
            console.log(error);
          }

          this.afterConnect(result);
        }
      );
    });

    this.afterConnect = (result) => {
      this.ddpclient.subscribe(
        'Thing.messages',
        [{uuid: this.uuid, token: this.token}],
        (error) => {
          if (error) return console.log(error);

          if (!this._messageHandlerInstalled) {
            this._messageHandlerInstalled = true;

            this.ddpclient.on('message', (data)=> {
              data = JSON.parse(data);

              if (data.msg !== 'added' || data.collection !== 'Things.messages') {
                return;
              }

              let command = data.fields.body;
              let opts = command.options;
              let type = command.type;
              if (type === 'setProperty') {
                this.set(opts.key, opts.value);
              } else if (opts) {
                this.call(type, opts);
              } else {
                this.call(type);
              }
            });
          }
        }
      );
    };

    /**
     * Sends an image (buffer) to the Grow-IoT server.
     * @param {Object}  
     */
    this.sendImage = (buffer) => {
      this.ddpclient.call(
        'Image.new',
        [{uuid: this.uuid, token: this.token}, buffer],
        function (error, result) {
          if (error) {
            console.log(error, result);
          }
        }
      );
    }

    /**
     * Emits event to Grow-IoT server. Adds a timestamp to the event
     * since the API expects a timestamped object.
     * @param {Object}  event  The event to emit
     * @return  this
     */
    this.emit = (event, message) => {
      if (typeof event === 'object') {
        event.timestamp = new Date();
        super.emit(event.type, event);
      }

      else if (typeof event === 'string') {
        super.emit(event, message);
        event = {
          type: event,
          message,
          timestamp: new Date()
        }
      }

      this.ddpclient.call(
        'Thing.emit',
        [{uuid: this.uuid, token: this.token}, event],
        function (error, result) {
          if (error) {
            console.log(error, result);
          }
        }
      );

      return this;
    }

    /**
     * Update thing property on thing and Grow-IoT server.
     * @param {String} key  Key of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @return  this
     */
    this.set = (key, value) => {
      this.properties[key] = value;
      this.emit('property-updated', key);

      if (this.ddpclient) {
        this.ddpclient.call(
          'Thing.setProperty',
          [{uuid: this.uuid, token: this.token}, key, value],
          function (error, result) {
            if (error) {
              console.log(error);
            }
          }
        );
      }

      return this;
    }
  }

  /**
   * Create a CoAP server (Needs work... see: https://github.com/mcollina/node-coap)
   * Don't use in production yet... but do help us get it to the point where we can.
   */
  listen (options) {
    // todo pass options into server...
    this.server = coap.createServer((req, res)=> {      
      var urlParts = url.parse(req.url, true);

      try {
        // Remove slashes from path.
        let method = urlParts.pathname.replace(/\//g, '');
        
        if (method === 'set') {
          // should be called with a key, value query
          let key = urlParts.query.key;
          let value = urlParts.query.value;
          this.set(key, value);
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({key: value}));
        }

        else if (method === 'get') {
          let key = urlParts.query.key;
          let property = this.get(key);
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({value: property}));
        }

        // emit?

        else {
          var output = this.call(method, urlParts.query);
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({output}));
        }
      }

      catch (error) {
        console.log(error);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end(error);
      }
    }).listen();

    return this;
  }

  /**
   * Connect to a CoAP server (Needs work... see: https://github.com/mcollina/node-coap)
   * Don't use in production yet... but do help us get it to the point where we can.
   * @param {Object}  options  Connection options
   */
  coapConnect (options) {
    this.register = (options) => {
      let req = coap.request({
        pathname: 'register',
        observe: true
      });
      
      req.write(JSON.stringify(this));

      req.on('response', (res)=> {
        let command = JSON.parse(res.payload.toString()).body;
        let opts = command.options;
        let type = command.type;
        if (type === 'setProperty') {
          this.set(opts.key, opts.value);
        } else if (opts) {
          this.call(type, opts);
        } else {
          this.call(type);
        }
      });

      req.end();
    }

    this.register(options);

    this._messageHandlerInstalled = true;

    /**
     * Emits a timestamped event to CoAP server.
     * Emits event to CoAP server.
     * @param {Object}  event  The event to emit
     * @return  this
     */
    this.emit = (event) => {
      super.emit(event);

      if (typeof event === 'object') {
        event.timestamp = new Date();
      }

      else if (typeof event === 'string') {
        event = {
          event,
          timestamp: new Date()
        }
      }

      let req = coap.request({
        pathname: 'emit'
      })
      
      req.write(JSON.stringify({
        uuid: this.uuid,
        token: this.token,
        event
      }));

      req.on('response', function(res) {
        res.pipe(process.stdout)
      })

      req.end();

      return this;
    };

    /**
     * Update thing property on thing and CoAP server.
     * @param {String} key  Key of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @return  this
     */
    this.set = (key, value) => {
      // this.set(key, value);
      let req = coap.request({
        pathname: 'setProperty'
      });
      
      req.write(JSON.stringify({
        uuid: this.uuid,
        token: this.token,
        key: key,
        value: value
      }));

      req.on('response', function(res) {
        res.pipe(process.stdout)
      });

      req.end();

      return this;
    };

    return this;
  }
};

module.exports = Thing;
