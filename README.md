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

By default mongo url is set as mongodb://localhost:3001/meteor

If you want to change it to something else use set environment variable MONGO_URL

```sh
npm start
```

[http://localhost:8080/api/things/](http://localhost:8080/api/things/)

Use [postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)

## Generate auth token

`http://localhost:8080/api/authenticate/?username=<username>&password=<password>`

## Get Things

`http://localhost:8080/api/things?token=<token>`

`http://localhost:8080/api/things/:thing_id?token=<token>`

## Get Events

`http://localhost:8080/api/events?token=<token>`

`http://localhost:8080/api/events/:event_id?token=<token>`
