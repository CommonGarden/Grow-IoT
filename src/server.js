import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Things from './app/models/things';
import Events from './app/models/events';
import * as _ from 'lodash';

const app = express();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:3001/meteor';
mongoose.connect(MONGO_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('request recieved.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'welcome to grow-iot api!' });
});

router.route('/things')
// create a thing (POST http://localhost:8080/api/things)
// TODO needed more work
// .post(function(req, res) {
// const thing = new Things();
// thing.name = req.body.name;
// // save the thing and check for errors
// thing.save(function(err) {
// if (err)
// res.send(err);
// res.json({ message: 'Successful!' });
// });
// })
// all things (GET http://localhost:8080/api/things)
  .get(function(req, res) {
    Things.find(function(err, things) {
      if (err) {
        res.send(err);
      }
      res.json(things);
    });
  });

router.route('/things/:thing_id')

// get the thing with that id (GET http://localhost:8080/api/things/:thing_id)
  .get(function(req, res) {
    Things.findById(req.params.thing_id, function(err, thing) {
      if (err)
        res.send(err);
      res.json(thing);
    });
  });

router.route('/events')
// all events (GET http://localhost:8080/api/events)
  .get(function(req, res) {
    Events.find(function(err, events) {
      if (err) {
        res.send(err);
      }
      res.json(events);
    });
  });

router.route('/events/:event_id')

// get the event with that id (GET http://localhost:8080/api/events/:event_id)
  .get(function(req, res) {
    Events.findById(req.params.event_id, function(err, event) {
      if (err)
        res.send(err);
      res.json(event);
    });
  });



app.use('/api', router);

app.listen(port);
console.log('app opened at ' + port);
