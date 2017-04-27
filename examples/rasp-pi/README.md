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

You're almost ready to go!

### Hardware setup.
For Hydroponics, Aquaponics, Fermentation, or Aquariums we recommend the [Tentacle hat from Whitebox labs](https://www.whiteboxes.ch/shop/tentacle-t3-for-raspberry-pi/)! Currently we support [Atlas Scientific sensors](https://www.atlas-scientific.com/), but we're looking for cheaper open source alternatives for pH and Conductivity especially.

This is how your hat should look like when it's put together (no soldering required):
[Example image](https://cloud.githubusercontent.com/assets/521978/25507754/dfcd09dc-2b62-11e7-9fc7-c8e0cfe3b0e6.JPG)

In the Grow.js directory run the tentacle example with:

```
sudo node examples/rasp-pi/t3.js
```




