# Grow.js on Raspberry pi 3

Setup your raspberry pi by following these instructions.

Install the latest version of Node. Todo this, either search for an article to help walk you through it or run the following:

```bash
wget https://nodejs.org/dist/v7.9.0/node-v7.9.0-linux-armv7l.tar.xz
tar -xvf node-v7.9.0-linux-armv7l.tar.gz 
cd node-v7.9.0-linux-armv7l

```
Then copy to /usr/local:

```
sudo cp -R * /usr/local/
```

Test that's it's working with `node -v`.

Then clone the Grow.js repo and additionally install the following packages.

```bash
git clone https://github.com/CommonGarden/Grow.js
cd Grow.js
npm install
npm install raspi-io johnny-five
```

You're ready to go! Connect to your Grow-IoT intance and create a new device.

You will be given auth credentials, a `uuid` and `token`.

Add those to `examples/rasp-pi/t3.js` and proceed to hardware setup!

### Hardware setup.
For Hydroponics, Aquaponics, Fermentation, or Aquariums we recommend the Tentacle hat from Whitebox labs! Currently we support Atlas Scientific sensors only, but we're looking for cheaper open source alternatives.

This is how your hat should look like when it's plugged in and on: 
[Insert Picture]

Note the blue lights on the Atlas Scientific sensors, this means there in I2C mode. If they are not in I2C the code won't work. Also note, the hats are stackable if you want to have sensors for everything. ; )

Once all looks good you're ready to go, run it with:

```
sudo node examples/rasp-pi/t3.js
```



#### Scheduling
To make sure your schedules run on time, make sure your Raspberry pi's clock is set correctly!



