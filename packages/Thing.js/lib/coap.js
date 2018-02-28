const coap = require('coap');
const url = require('url');

/**
 * Connect to Grow-IoT's CoAP server
 * @param {Object}  options  Connection options
 */
exports.connect = (options) => {
    this.register = options => {
        let req = coap.request({
            pathname: 'register',
            observe: true
        });

        req.write(JSON.stringify(this.uuid));

        req.on('response', res => {
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
    };

    this.register(options);

    this._messageHandlerInstalled = true;

    /**
     * Emits a timestamped event to CoAP server.
     * Emits event to CoAP server.
     * @param {Object}  event  The event to emit
     * @return  this
     */
    this.emit = (event, message, ...args) => {
        this.emit(event, message, ...args);

        event = {
            type: event,
            message,
            args,
            timestamp: new Date()
        };

        let req = coap.request({
            pathname: 'emit'
        });

        req.write(JSON.stringify({
            uuid: this.uuid,
            token: this.token,
            event
        }));

        req.on('response', function (res) {
            res.pipe(process.stdout);
        });

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
        this.properties[key] = value;

        this.emit('property-updated', key);

        let req = coap.request({
            pathname: 'setProperty'
        });

        req.write(JSON.stringify({
            uuid: this.uuid,
            token: this.token,
            key: key,
            value: value
        }));

        req.on('response', function (res) {
            res.pipe(process.stdout);
        });

        req.end();

        return this;
    };

    return this;
};

/**
 * Create CoAP server
 */
exports.listen = (options) => {
    this.server = coap.createServer((req, res) => {
        var urlParts = url.parse(req.url, true);

        try {
            // Remove slashes from path.
            let method = urlParts.pathname.replace(/\//g, '');

            if (method === 'set') {
                // should be called with a key, value query
                let key = urlParts.query.key;
                let value = urlParts.query.value;
                this.set(key, value);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ key: value }));
            } else if (method === 'get') {
                let key = urlParts.query.key;
                let property = this.get(key);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ value: property }));
            } else {
                var output = this.call(method, req.payload.toString());
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ output }));
            }
        } catch (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(error);
        }
    }).listen(options);
}
