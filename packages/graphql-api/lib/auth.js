import passport from 'passport';
let LocalStrategy = require('passport-local').Strategy;
import { User } from 'grow-mongoose-models';

passport.use('local', new LocalStrategy(
  function(username, password, done) {
    let checkPassword = User.login(username, password);
    let getUser = checkPassword.then( (is_login_valid) => {
      if(is_login_valid){
        return User.findOne( { username: username });
      } else {
        throw new Error('invalid username or password');
      }
    })
      .then( ( user ) => {
        return done(null, user);
      })
      .catch( (err) => {
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id} , (user, err) => {
    return done(err, user);
  });
});
