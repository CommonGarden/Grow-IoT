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

# The Config File
The config file contains information like the following:

```
{
    "host": "localhost",
    "port": "3000",
    "thing": {
        "name": "Light sensor",
        "description": "A simple light sensor sensor",
        "sensors": [
            {
                "name": "Light sensor",
                "type": "light"
            }
        ],
        "actuators": [
            {
                "name": "Yellow light",
                "model": {
                    "events": {
                        "turned-on": null,
                        "turned-off": null
                    },
                    "properties": {
                        "is_on": "boolean",
                        "is_off": "boolean"
                    },
                    "actions": [
                        {
                            "name": "on"
                        },
                        {
                            "name": "off"
                        }
                    ]
                }
            }
        ]
    }
}

```

#### host
We describe the "host" (i.e. where it is looking for a CommonGarden-IoT instance). If connecting over wifi this needs to be set to you computer's IP address. Likewise if you are hosting in the cloud.

#### thing
Note the "thing" object. This is where we are defining what the device or thing (as in Internet of Things) *is*, as well as information about the sensors and the information they are returning. 

#### sensors and actuators
We can add both sensors and actuators. Each of these sensors and actuators supports a model object which defines properties, events, and actions. Here is an example for a simple light:

```
"model": {
    "events": {
        "turned-on": null,
        "turned-off": null
    },
    "properties": {
        "is_on": "boolean",
        "is_off": "boolean"
    },
    "actions": [
        {
            "name": "on"
        },
        {
            "name": "off"
        }
    ]
}
```

We might attatch additional metadata, like a name or like a link to the github repository of the driver.

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
