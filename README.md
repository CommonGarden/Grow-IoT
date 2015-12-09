[![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org)

# Meteor IoT
Meteor IoT is meant to be a starter internet of things project. It handles messaging between server and client devices, registering and claiming devices under user accounts, providing a basic but extensible UI for managing devices.

# Installing Meteor IoT

First, you need to install meteor on your OS, which you can do by fallowing [the simple instructions on the Meteor website]().

Next, open up Terminal clone the repository:

```
git clone https://github.com/CommonGarden/Meteor-IoT
cd Meteor-IoT
meteor
```

And that's it! You should now have an application running on http://localhost:3000

# Making a device driver
A device driver is the birdge between a piece of hardware and the server. It is a essentially a driver script and a `config.json` file. 

# The Config File
The config file contains information like the following:

```
{
    "host": "192.168.0.106",
    "port": "3000",
    "thing": {
        "name": "Climate sensor",
        "description": "A temperature and humidity sensor",
        "url": "https://commongarden.org/39014832410",
        "sensors": [
            {
                "name": "temperature",
                "unit": "f",
                "type": "temperature"
            },
            {
                "name": "humidity",
                "unit": "'%RH'",
                "type": "humidity"
            }
        ]
    }
}

```

We describe the "host" (i.e. where it is looking for a CommonGarden-IoT instance).

Note the "thing" object. This is where we are defining what the device or thing (as in Internet of Things) *is*, as well as information about the sensors and the information they are returning.

We might attatch additional metadata, like a link to the github repository
for the driver.

# Drivers

Checkout a few of our example drivers:
* Temperature / Humidty Sensor
* Ph sensor
* Relay

To connect to a common garden instance you can use the node-common-garden-connect library.

An example:
```
    // import requirements
    // commongarden is a npm library for connecting to a commongarden instance
    var CommonGarden = require('commongarden');
    var _ = require('underscore');
    var fs = require('fs');
    var Readable = require('stream').Readable;
    
    // import device specific requirements
    // You may for example use Johnny five!
    // Here we're using the Tessel 2
    var tessel = require('tessel');
    var climatelib = require('climate-si7020');

    // import the config
    var config = require('./config.json');

    // Not specifying a UUID/token auto-registers a new device.
    var instance = new CommonGarden(config);

    // Here, a ddp connection will be established with the `host` specified in 
    // `config.json`.
    instance.connect(function (error, data) {
        if (error) return console.log("Error", error);

        /* Now check to see if we have a stored UUID.
         - If no UUID is specified, store a new UUID. */
        if (_.isUndefined(config.uuid) || _.isUndefined(config.token)) {
            config.uuid = data.uuid;
            config.token = data.token;
            fs.writeFile('./config.json', JSON.stringify(config, null, 4), function (error) {
                if (error) return console.log("Error", error);

                console.log("New configration was saved with a uuid of: " + data.uuid);
            });  
        }

        // Make a new readable stream
        var readableStream = new Readable({objectMode: true});

        // We are pushing data when sensor measures it so we do not do anything
        // when we get a request for more data. We just ignore it.
        readableStream._read = function () {};

        // We catch any errors
        readableStream.on('error', function (error) {
          console.log("Error", error.message);
        });


        // No we get to our specific example implementation
        var climate = climatelib.use(tessel.port['A']);

        climate.on('ready', function () {
            console.log('Connected to si7020');

            // Loop forever
            setImmediate(function loop () {
              climate.readTemperature('f', function (err, temp) {
                climate.readHumidity(function (err, humid) {
                  
                  // Here we push data to the readable stream
                  readableStream.push({
                    readings: [
                      {
                        type: "temperature",
                        unit: "f",
                        value: temp.toFixed(4)
                      }, 
                      {
                        type: "humidity",
                        unit: "%RH",
                        value: humid.toFixed(4)
                      }
                    ],
                    timestamp: new Date()
                  });
                  
                  // This variable could be set by the config file.
                  setTimeout(loop, 5000);
                });
              });
            });
        });

        climate.on('error', function(err) {
            console.log('error connecting module', err);
        });
        // End climate sensor specific code.

        // We pipe our readable stream to the instance.
        readableStream.pipe(instance);
    });
```

## Contributing

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### Reach out
Get involved with our community in any way you are interested:

* [Join us on Slack](http://slack.commongarden.org) — Collaboration and real time discussions.
* [Forum](http://forum.commongarden.org/) — General discussion and support by the Common Garden community.

## License

Meteor-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
