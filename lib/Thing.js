const _ = require('underscore');
const EventEmitter = require('events');
const coap = require('coap');
const url = require('url');

/**
 * A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
 * @extends EventEmitter
 * @param {Object} config  an object containing metadata, properties, events, and/or actions.
 * @param {Function} callback  an optional callback
 * @return     A new thing object
 */
class Thing extends EventEmitter {
  constructor(config, callback) {
    super();

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
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
   * @param {String} property The property of the component to be update.
   * @param {String} value The value to update the property to.
   * @param {String} key  Optional. Use to update the property of an event or action.
   */
  set (key, value) {
    this.properties[key] = value;
    this.emit('property-updated', key);
  }

  /* Get a property by key.
   * @param {String} property
   * @returns {String} key  Optional. Use to get an event or action property.
   */
  get (key) {
    return this.properties[key];
  }

  /**
   * Call a method, emit event.
   * @param      {String}  method The method to call.
   * @param      {Object}  options Optional, options to call with the function.
   * @returns    {Object}  output Returns any returns of the called method. 
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
  connect (options) {
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
