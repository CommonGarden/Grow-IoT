# grow-rest-api
Rest API for [Grow-IoT](https://github.com/CommonGarden/Grow-IoT/) project

# Installation

```sh
git clone git@github.com:aruntk/grow-rest-api.git
npm install
npm run compile
```

# Running

Start your meteor app(if you are using external mongo then ensure it is running).

By default mongo url is set as mongodb://localhost:3001/meteor ([config.js](src/config.js))

If you want to change it to something else use set environment variable MONGO_URL

Set super secret key for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (Default -> grow-iot-secret. inside [config.js](src/config.js)) env variable APP_SECRET

```sh
export APP_SECRET = super_secret_key
```

```sh
npm start
```

[http://localhost:8080/api/things/](http://localhost:8080/api/things/)

Use [postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)

## Generate auth token

`http://localhost:8080/api/authenticate/?username=<username>&password=<password>`

![token](screenshots/auth.png)

## Get Things

`http://localhost:8080/api/things?token=<token>`

`http://localhost:8080/api/things/:thing_id?token=<token>`

![things](screenshots/things.png)

## Get Events

`http://localhost:8080/api/events?token=<token>`

`http://localhost:8080/api/events/:event_id?token=<token>`
