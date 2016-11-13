# Hardware
* Next Thing Co. [C.H.I.P.](https://getchip.com/) board
* A pot (or 5 gallon bucket)
* A basket lid
* Any sensors you want to add.

TODO: add video.

# Getting started.

First you need to flash your chip, there are a variety of ways to do so mentioned in the C.H.I.P. documentation... but the easiest is to use https://flash.getchip.com and the Chrome web browser.

Put your chip in flash mode with a jumper wire like so:
![Image of Chip in flash mode. A jumper cable connects the ground port to the FEL port]()

Follow the on screen instructions from https://flash.getchip.com and you should soon be up and running.

When finished remove the jumper cable, then unplug and replug your freshly flashed chip.

# Connecting to chip:

Run the following command in terminal: 

`ls /dev/tty*`

You should see the chip listed somewhere. Insert the correct path for the command below.

`screen /dev/tty* 115200`

If this was successful you can login in with the default username: `chip` and password: `chip`.

Alternatively you can do the next steps with a screen and a keyboard.

### Connecting to wifi

List networks:
`nmcli device wifi list`

Connect to a wifi network:
`sudo nmcli device wifi connect '(your wifi network name/SSID)' password '(your wifi password)' ifname wlan0`

See the following for more info on connecting to wifi: http://docs.getchip.com/chip.html#wifi-connection


# Installing node.js
To use Dr. Dose, we need to install node.js:

Note: version 6 might be too far ahead....

```
mkdir /tmp/node
cd /tmp/node
wget https://nodejs.org/dist/v6.3.1/node-v6.3.1-linux-armv7l.tar.xz
tar -xvf node-v6.3.1-linux-armv7l.tar.xz
cd node-v6.3.1-linux-armv7l
sudo cp -R * /usr/local/
```

Test with the command `node -v`, you should see the version number. If you have trouble checkout [this video](https://www.youtube.com/watch?v=mnbwLp9POWo).


# Updating C.H.I.P.

These commands update the package manager, update any outdated packages, and install any major updates.

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
```

This may take a little while... have a :coffee:.

When it's finished we need to install build essential and git: 

`sudo apt-get install build-essential git`

Clone the library.

```
npm install
```

Note if this fails, sometimes it's because the internal clock of your new chip is off. Type `date` into the command line. If it is wrong you can manually reset it with:

`sudo date --set Year-Month-Day`
`sudo date --set hour:minute:second`

See the [chip-io](https://github.com/sandeepmistry/node-chip-io) Johnny-Five plugin for more info.

