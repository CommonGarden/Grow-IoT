const DDPClient = require('ddp');

/**
 * Connects to Grow-IoT server over DDP.
 * @param {Object}  options  Connection options
 */
exports.connect(options) {
    if (!this.uuid && !this.token) {
        throw new Error('UUID and token are required to connect to a Grow-IoT instance.');
    }

    this.ddpclient = new DDPClient(_.defaults(options, {
        host: 'localhost',
        port: 3000,
        ssl: false,
        maintainCollections: true
    }));

    this.ddpclient.connect((error, wasReconnect) => {
        if (error) {
            console.log(error);
        }

        if (wasReconnect) {
            console.log('Reestablishment of a Grow server connection.');
        } else {
            console.log('Grow server connection established.');
        }

        this.ddpclient.call('Thing.register', [{ uuid: this.uuid, token: this.token }, this.config], (error, result) => {
            if (error) {
                console.log(error);
            }

            this.afterConnect(result);
        });
    });

    this.afterConnect = result => {
        this.ddpclient.subscribe('Thing.messages', [{ uuid: this.uuid, token: this.token }], error => {
            if (error) return console.log(error);

            if (!this._messageHandlerInstalled) {
                this._messageHandlerInstalled = true;

                this.ddpclient.on('message', data => {
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
        });
    };

    /**
     * Sends an image (buffer) to the Grow-IoT server.
     * @param {Object}
     */
    this.sendImage = buffer => {
        this.ddpclient.call('Image.new', [{ uuid: this.uuid, token: this.token }, buffer], function (error, result) {
            if (error) {
                console.log(error, result);
            }
        });
    };

    /**
     * Emits event to Grow-IoT server. Adds a timestamp to the event
     * since the API expects a timestamped object.
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

        this.ddpclient.call('Thing.emit', [{ uuid: this.uuid, token: this.token }, event], function (error, result) {
            if (error) {
                console.log(error, result);
            }
        });

        return this;
    };

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
            this.ddpclient.call('Thing.setProperty', [{ uuid: this.uuid, token: this.token }, key, value], function (error, result) {
                if (error) {
                    console.log(error);
                }
            });
        }

        return this;
    };
}
