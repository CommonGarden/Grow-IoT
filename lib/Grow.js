const Thing = require('Thing.js');
const DDPClient = require('ddp');
const EJSON = require('ddp-ejson');
const _ = require('underscore');
const http = require('http');
const url = require('url');
const coap = require('coap');


/**
 * Grow is an extension of a Thing (which is basically a fancy event emitter).
 * See [Thing.js](https://github.com/CommonGarden/Thing.js) for more info on Things...
 * @param {Object} config  The thing object.
 * @return     A new grow instance.
 */
class Grow extends Thing {
  constructor(config) {
    super(config);

    this.config = config;

    if (!this.uuid && !this.token) {
      new Error('UUID and token are required to connect to a Grow-IoT instance.');
    }

    this._messageHandlerInstalled = false;
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
        // Emit reconnected event?
      } else {
        console.log('Grow server connection established.');
        // Emit a connected event?
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
              data = EJSON.parse(data);

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
     * Emits event to Grow-IoT server.
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
          message: event,
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
      super.set(key, value);

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
   * Create simple http server on a specified port
   * @param {String} port  The port to listen on
   * @return  this
   */
  listen (port) {
    var self = this;
    var server = http.createServer(function(request, response) {
      var urlParts = url.parse(request.url, true);

      try {
        // Remove slashes from path.
        let method = urlParts.pathname.replace(/\//g, '');
        
        // TODO: fully implement thing api.
        if (method === 'set') {
          // should be called with a key, value query
          let key = urlParts.query.key;
          let value = urlParts.query.value;
          self.set(key, value);
          response.writeHead(200, {'Content-Type': 'application/json'});
          // Todo: better response.
          response.end(JSON.stringify({ok: true}));
        }

        else if (method === 'get') {
          let key = urlParts.query.key;
          let property = self.get(key);
          // response with key
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(JSON.stringify({value: property}));
        }

        else {
          self.call(method, urlParts.query);
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(JSON.stringify({ok: true}));
        }
      }

      catch (error) {
        console.log(error);
        // TODO: include error in response.
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end();
      }
    });

    if (_.isUndefined(port)) {
      const port = 8080;
    }

    server.listen(port);

    return this;
  }

  /**
   * Create a CoAP server (Needs work... see: https://github.com/mcollina/node-coap)
   */
  coap (options) {
    var self = this;
    var server = coap.createServer(options);
    
    server.on('request', function(req, res) {
      var urlParts = url.parse(req.url, true);

      console.log(urlParts);

      try {
        // Remove slashes from path.
        let method = urlParts.pathname.replace(/\//g, '');
        
        // TODO: fully implement thing api.
        if (method === 'set') {
          // should be called with a key, value query
          let key = urlParts.query.key;
          let value = urlParts.query.value;
          self.set(key, value);
          res.writeHead(200, {'Content-Type': 'application/json'});
          // Todo: better response.
          res.end(JSON.stringify({ok: true}));
        }

        else if (method === 'get') {
          let key = urlParts.query.key;
          let property = self.get(key);
          // response with key
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({value: property}));
        }

        // emit?

        else {
          self.call(method, urlParts.query);
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({ok: true}));
        }
      }

      catch (error) {
        console.log(error);

        // TODO: include error in response.
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end();
      }
    });

    // the default CoAP port is 5683
    server.listen();
  }

  coapClient () {
    // Client
    const coap  = require('coap');
    // make this an argument
    var req   = coap.request('coap://localhost/jake');

    req.on('response', function(res) {
      res.pipe(process.stdout)
    });

    req.end();
  }
};

export default Grow;
