import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as _ from 'lodash';
import morgan from 'morgan';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify token
import Things from './app/models/things';
import Events from './app/models/events';
import config from './config';
import User from './app/models/user';

const app = express();

const MONGO_URL = process.env.MONGO_URL || config.database;
const APP_SECRET = process.env.APP_SECRET || config.secret;
mongoose.connect(MONGO_URL);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

const port = process.env.PORT || 8080;

const router = express.Router();

router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        const token = jwt.sign(user, app.get('superSecret'), {
          expiresIn : 60*60*24
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Use this token as param in your future requests!',
          token: token
        });
      }

    }

  });
});

// middleware to use for all requests
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

// test route to make sure everything is working (GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'welcome to grow-iot api!' });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
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
