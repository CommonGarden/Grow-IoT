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

`npm install raspi-io johnny-five`

# Scheduling

To make sure your schedules run on time, make sure your Raspberry pi's clock is set correctly!



