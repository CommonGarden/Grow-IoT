[![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org)

# Installing CommonGarden-IoT (OSX and Linux)

You need to install [Meteor](https://www.meteor.com/) if you haven't already. To do so, open your terminal and enter:
```
curl https://install.meteor.com/ | sh
```

Then clone the repo, enter the new directory, and start meteor.

```
git clone https://github.com/CommonGarden/CommonGarden-IoT
cd CommonGarden-IoT
meteor
```

And that's it! You should now have an application running on http://localhost:3000

# Making a device driver
A device driver is the birdge between a piece of hardware and the server. It is a essentially a driver script and a `config.json` file. Think of the `config.json` file as a map or blue print, and the driver as the implementation of the blue print. 

# The Grow File
### Models
Models describe the api of the device.

We can add both sensors and actuators. Each of these sensors and actuators is a model object which defines properties, events, and actions. 

Here's an example of a simple api for an actuator.


```
"model": {
    "events": {
        "turned-on": null,
        "turned-off": null
    },
    "properties": {
        "state": "off",
        "crons": [
            {
                "name": "Turn on",
                "call": "light_on",
                "cron": "* 07 * * *"
            },
            {
                "name": "Turn off",
                "call": "light_off",
                "cron": "* 19 * * *"
            }
        ]
    },
    "actions": [
        {
            "name": "Turn on",
            "call": "light_on"
        },
        {
            "name": "Turn off",
            "call": "light_off"
        }
    ]
}
```

We might attatch additional metadata, like a name or like a link to the github repository of the driver.

#### host
The host is where the device will be looking for a CommonGarden-IoT instance. If you've got an arduino plugged in via usb and using meteor on the default port, you would use the following in your grow.json file:

```
    "host": "localhost",
    "port": "3000",
```

If connecting over wifi this needs to be set to your computer's IP address.

Likewise if you are hosting in the cloud, it should be set to the instance IP address.

#### thing object
Note the "thing" object. This is where we are defining what the device or thing (as in Internet of Things) *is*, as well as information about the sensors and the information they are returning. 

The thing can contain metadata abour itself, a model describing it's api, and a list of sensor and actuators (things that comprise a bigger thing), each with their own small API's.

# Example Grow file
```
    "thing": {
        "name": "Smart Pot",
        "version": "0.1.0",
        "description": "An example growkit.",
        "type": "growkit",
        "model": {
            "properties": [
                {
                    "numberOfPlants": 1,
                    "state": "No plants"
                }
            ],
        },
        "sensors": [
            {
                "name": "Light sensor",
                "type": "light",
                "chart": "line",
                "unit": "milivolts",
                "model": {
                    "properties": [
                        {
                            "crons": [
                                {
                                    "name": "logData",
                                    "text": "Log data",
                                    "cron": "* * * * *"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "name": "Temperature sensor",
                "type": "temperature",
                "chart": "line",
                "unit": "Celcius",
                "model": {
                    "properties": [
                        {
                            "crons": [
                                {
                                    "name": "logData",
                                    "text": "Log data",
                                    "cron": "* * * * *"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "name": "pH sensor",
                "type": "ph",
                "chart": "line",
                "unit": "Celcius",
                "model": {
                    "properties": [
                        {
                            "crons": [
                                {
                                    "name": "logData",
                                    "text": "Log data",
                                    "cron": "* * * * *"
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "actuators": [
            {
                "name": "Water pump",
                "type": "water-pump",
                "model": {
                    "events": {
                        "turned-on": null,
                        "turned-off": null
                    },
                    "properties": [
                        {
                            "state": "off",
                            "crons": [
                                {
                                    "name": "waterPlant",
                                    "text": "Water plant",
                                    "cron": "* * * * *",
                                    "duration": 20000
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "Turn on",
                            "call": "waterpump_on"
                        },
                        {
                            "name": "Turn off",
                            "call": "waterpump_off"
                        }
                    ]
                }
            },
            {
                "name": "Light",
                "type": "relay",
                "model": {
                    "events": {
                        "turned-on": null,
                        "turned-off": null
                    },
                    "properties": [
                        {
                            "state": "off",
                            "crons": [
                                {
                                    "name": "lightsOn",
                                    "text": "Lights on",
                                    "cron": "* * * * *"
                                },
                                {
                                    "name": "lightsOff",
                                    "text": "Lights off",
                                    "cron": "0 19 * * *"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "name": "On",
                            "call": "light_on"
                        },
                        {
                            "name": "off",
                            "call": "light_off"
                        }
                    ]
                }
            }
        ]
    }
}

```

## Contributing

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### Reach out
Get involved with our community in any way you are interested:

* [Join us on Slack](http://slack.commongarden.org) — Collaboration and real time discussions.
* [Forum](http://forum.commongarden.org/) — General discussion and support by the Common Garden community.

### Acknowledgements
Special thanks to @mitar for contributing the starting point for this library. This work was also inspired by work the W3C interest group on the internet of things.

## License
Meteor-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
