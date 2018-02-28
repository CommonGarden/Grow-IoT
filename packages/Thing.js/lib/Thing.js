const _ = require('underscore');
const EventEmitter = require('events');
const ddp = require('./ddp');
const coap = require('./coap');
const http = require('./http');
const mqtt = require('./mqtt');
const hypercore = require('hypercore');
const events = require('wildcards');

/**
 * A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
 * @extends EventEmitter
 * @param {Object} config  an object containing metadata, properties, events, and/or actions.
 * @return {Thing}   A new thing object
 */
class Thing extends EventEmitter {
    constructor(config, path_to_dat_folder) {
        super();

        _.extend(this, config);
        this.functions = _.functions(config);

        this.ddp = ddp;
        this.coap = coap;
        this.mqtt = mqtt;

        if (path_to_dat_folder) {
            this.feed = hypercore(path_to_dat_folder, {valueEncoding: 'json'});
            this.feed.on('ready', ()=> {
                events(this, '*', (event, value, ...params)=>{
                    console.log('%s %s %s', event, value, params);
                    this.feed.append({
                        type: event,
                        value: value,
                        params: params,
                        timestamp: new Date()
                    });
                });
            });
        }

        if (!this.properties) {
            this.properties = {};
        }

        // Consider implementing 'setup' rather than 'start' or 'initialize'...
        if (!_.isUndefined(this.initialize)) {
            this.initialize();
        }

        if (!_.isUndefined(this.start)) {
            this.start();
        }

        // Consider implementing a 'loop' much like in arduino...

        this._messageHandlerInstalled = false;

        // Emit 'ready' event to show that the Thing has initialized.
        this.emit('ready');
    }

    /**
     * Update a property. Emit an event.
     * @param {String} key The property to be updated.
     * @param {Object | Number | String | Boolean} value The value to update the property to.
     */
    set(key, value) {
        this.properties[key] = value;
        this.emit('property-updated', key, value);
    }

    /* Get a property by key.
     * @param {String} key Use to get the current value of a property.
     * @returns {Object | Number | String | Boolean}
     */
    get(key) {
        return this.properties[key];
    }

    /**
     * Call a method, emit event.
     * @param      {String}  method The method to call.
     * @param      {Object}  options Optional, options to call with the function.
     * @returns    {Object | Number | String | Null | Boolean}  output Returns any returns of the called method. 
     */
    call(method, options) {
        try {
            if (!_.isUndefined(options)) {
                var output = this[method](options);
            } else {
                var output = this[method]();
            }

            if (!_.isUndefined(output)) {
                this.emit(method, options, output);
                // We return any returns of called functions.
                return output;
            } else {
                this.emit(method, options);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Thing;
