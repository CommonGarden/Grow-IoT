//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Hook;

(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/callback-hook/hook.js                                               //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// XXX This pattern is under development. Do not add more callsites             // 1
// using this package for now. See:                                             // 2
// https://meteor.hackpad.com/Design-proposal-Hooks-YxvgEW06q6f                 // 3
//                                                                              // 4
// Encapsulates the pattern of registering callbacks on a hook.                 // 5
//                                                                              // 6
// The `each` method of the hook calls its iterator function argument           // 7
// with each registered callback.  This allows the hook to                      // 8
// conditionally decide not to call the callback (if, for example, the          // 9
// observed object has been closed or terminated).                              // 10
//                                                                              // 11
// Callbacks are bound with `Meteor.bindEnvironment`, so they will be           // 12
// called with the Meteor environment of the calling code that                  // 13
// registered the callback.                                                     // 14
//                                                                              // 15
// Registering a callback returns an object with a single `stop`                // 16
// method which unregisters the callback.                                       // 17
//                                                                              // 18
// The code is careful to allow a callback to be safely unregistered            // 19
// while the callbacks are being iterated over.                                 // 20
//                                                                              // 21
// If the hook is configured with the `exceptionHandler` option, the            // 22
// handler will be called if a called callback throws an exception.             // 23
// By default (if the exception handler doesn't itself throw an                 // 24
// exception, or if the iterator function doesn't return a falsy value          // 25
// to terminate the calling of callbacks), the remaining callbacks              // 26
// will still be called.                                                        // 27
//                                                                              // 28
// Alternatively, the `debugPrintExceptions` option can be specified            // 29
// as string describing the callback.  On an exception the string and           // 30
// the exception will be printed to the console log with                        // 31
// `Meteor._debug`, and the exception otherwise ignored.                        // 32
//                                                                              // 33
// If an exception handler isn't specified, exceptions thrown in the            // 34
// callback will propagate up to the iterator function, and will                // 35
// terminate calling the remaining callbacks if not caught.                     // 36
                                                                                // 37
Hook = function (options) {                                                     // 38
  var self = this;                                                              // 39
  options = options || {};                                                      // 40
  self.nextCallbackId = 0;                                                      // 41
  self.callbacks = {};                                                          // 42
                                                                                // 43
  if (options.exceptionHandler)                                                 // 44
    self.exceptionHandler = options.exceptionHandler;                           // 45
  else if (options.debugPrintExceptions) {                                      // 46
    if (! _.isString(options.debugPrintExceptions))                             // 47
      throw new Error("Hook option debugPrintExceptions should be a string");   // 48
    self.exceptionHandler = options.debugPrintExceptions;                       // 49
  }                                                                             // 50
};                                                                              // 51
                                                                                // 52
_.extend(Hook.prototype, {                                                      // 53
  register: function (callback) {                                               // 54
    var self = this;                                                            // 55
                                                                                // 56
    callback = Meteor.bindEnvironment(                                          // 57
      callback,                                                                 // 58
      self.exceptionHandler || function (exception) {                           // 59
        // Note: this relies on the undocumented fact that if bindEnvironment's // 60
        // onException throws, and you are invoking the callback either in the  // 61
        // browser or from within a Fiber in Node, the exception is propagated. // 62
        throw exception;                                                        // 63
      }                                                                         // 64
    );                                                                          // 65
                                                                                // 66
    var id = self.nextCallbackId++;                                             // 67
    self.callbacks[id] = callback;                                              // 68
                                                                                // 69
    return {                                                                    // 70
      stop: function () {                                                       // 71
        delete self.callbacks[id];                                              // 72
      }                                                                         // 73
    };                                                                          // 74
  },                                                                            // 75
                                                                                // 76
  // For each registered callback, call the passed iterator function            // 77
  // with the callback.                                                         // 78
  //                                                                            // 79
  // The iterator function can choose whether or not to call the                // 80
  // callback.  (For example, it might not call the callback if the             // 81
  // observed object has been closed or terminated).                            // 82
  //                                                                            // 83
  // The iteration is stopped if the iterator function returns a falsy          // 84
  // value or throws an exception.                                              // 85
  //                                                                            // 86
  each: function (iterator) {                                                   // 87
    var self = this;                                                            // 88
                                                                                // 89
    // Invoking bindEnvironment'd callbacks outside of a Fiber in Node doesn't  // 90
    // run them to completion (and exceptions thrown from onException are not   // 91
    // propagated), so we need to be in a Fiber.                                // 92
    Meteor._nodeCodeMustBeInFiber();                                            // 93
                                                                                // 94
    var ids = _.keys(self.callbacks);                                           // 95
    for (var i = 0;  i < ids.length;  ++i) {                                    // 96
      var id = ids[i];                                                          // 97
      // check to see if the callback was removed during iteration              // 98
      if (_.has(self.callbacks, id)) {                                          // 99
        var callback = self.callbacks[id];                                      // 100
                                                                                // 101
        if (! iterator(callback))                                               // 102
          break;                                                                // 103
      }                                                                         // 104
    }                                                                           // 105
  }                                                                             // 106
});                                                                             // 107
                                                                                // 108
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['callback-hook'] = {
  Hook: Hook
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;

(function () {

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/localstorage/localstorage.js                                            //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
// Meteor._localStorage is not an ideal name, but we can change it later.           // 1
                                                                                    // 2
// Let's test to make sure that localStorage actually works. For example, in        // 3
// Safari with private browsing on, window.localStorage exists but actually         // 4
// trying to use it throws.                                                         // 5
// Accessing window.localStorage can also immediately throw an error in IE (#1291). // 6
                                                                                    // 7
var key = '_localstorage_test_' + Random.id();                                      // 8
var retrieved;                                                                      // 9
try {                                                                               // 10
  if (window.localStorage) {                                                        // 11
    window.localStorage.setItem(key, key);                                          // 12
    retrieved = window.localStorage.getItem(key);                                   // 13
    window.localStorage.removeItem(key);                                            // 14
  }                                                                                 // 15
} catch (e) {                                                                       // 16
  // ... ignore                                                                     // 17
}                                                                                   // 18
if (key === retrieved) {                                                            // 19
  Meteor._localStorage = {                                                          // 20
    getItem: function (key) {                                                       // 21
      return window.localStorage.getItem(key);                                      // 22
    },                                                                              // 23
    setItem: function (key, value) {                                                // 24
      window.localStorage.setItem(key, value);                                      // 25
    },                                                                              // 26
    removeItem: function (key) {                                                    // 27
      window.localStorage.removeItem(key);                                          // 28
    }                                                                               // 29
  };                                                                                // 30
}                                                                                   // 31
                                                                                    // 32
if (!Meteor._localStorage) {                                                        // 33
  Meteor._debug(                                                                    // 34
    "You are running a browser with no localStorage or userData "                   // 35
      + "support. Logging in from one tab will not cause another "                  // 36
      + "tab to be logged in.");                                                    // 37
                                                                                    // 38
  Meteor._localStorage = {                                                          // 39
    _data: {},                                                                      // 40
                                                                                    // 41
    setItem: function (key, val) {                                                  // 42
      this._data[key] = val;                                                        // 43
    },                                                                              // 44
    removeItem: function (key) {                                                    // 45
      delete this._data[key];                                                       // 46
    },                                                                              // 47
    getItem: function (key) {                                                       // 48
      var value = this._data[key];                                                  // 49
      if (value === undefined)                                                      // 50
        return null;                                                                // 51
      else                                                                          // 52
        return value;                                                               // 53
    }                                                                               // 54
  };                                                                                // 55
}                                                                                   // 56
                                                                                    // 57
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.localstorage = {};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Random = Package.random.Random;
var Hook = Package['callback-hook'].Hook;
var DDP = Package.ddp.DDP;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var Accounts, AccountsTest, EXPIRE_TOKENS_INTERVAL_MS, CONNECTION_CLOSE_DELAY_MS, getTokenLifetimeMs, onLoginHook, onLoginFailureHook, autoLoginEnabled, tokenRegex, match, makeClientLoggedOut, makeClientLoggedIn, storeLoginToken, unstoreLoginToken, storedLoginToken, storedLoginTokenExpires;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/accounts_common.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * @namespace Accounts                                                                                               // 2
 * @summary The namespace for all accounts-related methods.                                                          // 3
 */                                                                                                                  // 4
Accounts = {};                                                                                                       // 5
                                                                                                                     // 6
// Currently this is read directly by packages like accounts-password                                                // 7
// and accounts-ui-unstyled.                                                                                         // 8
Accounts._options = {};                                                                                              // 9
                                                                                                                     // 10
// how long (in days) until a login token expires                                                                    // 11
var DEFAULT_LOGIN_EXPIRATION_DAYS = 90;                                                                              // 12
// Clients don't try to auto-login with a token that is going to expire within                                       // 13
// .1 * DEFAULT_LOGIN_EXPIRATION_DAYS, capped at MIN_TOKEN_LIFETIME_CAP_SECS.                                        // 14
// Tries to avoid abrupt disconnects from expiring tokens.                                                           // 15
var MIN_TOKEN_LIFETIME_CAP_SECS = 3600; // one hour                                                                  // 16
// how often (in milliseconds) we check for expired tokens                                                           // 17
EXPIRE_TOKENS_INTERVAL_MS = 600 * 1000; // 10 minutes                                                                // 18
// how long we wait before logging out clients when Meteor.logoutOtherClients is                                     // 19
// called                                                                                                            // 20
CONNECTION_CLOSE_DELAY_MS = 10 * 1000;                                                                               // 21
                                                                                                                     // 22
// Set up config for the accounts system. Call this on both the client                                               // 23
// and the server.                                                                                                   // 24
//                                                                                                                   // 25
// XXX we should add some enforcement that this is called on both the                                                // 26
// client and the server. Otherwise, a user can                                                                      // 27
// 'forbidClientAccountCreation' only on the client and while it looks                                               // 28
// like their app is secure, the server will still accept createUser                                                 // 29
// calls. https://github.com/meteor/meteor/issues/828                                                                // 30
//                                                                                                                   // 31
// @param options {Object} an object with fields:                                                                    // 32
// - sendVerificationEmail {Boolean}                                                                                 // 33
//     Send email address verification emails to new users created from                                              // 34
//     client signups.                                                                                               // 35
// - forbidClientAccountCreation {Boolean}                                                                           // 36
//     Do not allow clients to create accounts directly.                                                             // 37
// - restrictCreationByEmailDomain {Function or String}                                                              // 38
//     Require created users to have an email matching the function or                                               // 39
//     having the string as domain.                                                                                  // 40
// - loginExpirationInDays {Number}                                                                                  // 41
//     Number of days since login until a user is logged out (login token                                            // 42
//     expires).                                                                                                     // 43
                                                                                                                     // 44
/**                                                                                                                  // 45
 * @summary Set global accounts options.                                                                             // 46
 * @locus Anywhere                                                                                                   // 47
 * @param {Object} options                                                                                           // 48
 * @param {Boolean} options.sendVerificationEmail New users with an email address will receive an address verification email.
 * @param {Boolean} options.forbidClientAccountCreation Calls to [`createUser`](#accounts_createuser) from the client will be rejected. In addition, if you are using [accounts-ui](#accountsui), the "Create account" link will not be available.
 * @param {String | Function} options.restrictCreationByEmailDomain If set to a string, only allows new users if the domain part of their email address matches the string. If set to a function, only allows new users if the function returns true.  The function is passed the full email address of the proposed new user.  Works with password-based sign-in and external services that expose email addresses (Google, Facebook, GitHub). All existing users still can log in after enabling this option. Example: `Accounts.config({ restrictCreationByEmailDomain: 'school.edu' })`.
 * @param {Number} options.loginExpirationInDays The number of days from when a user logs in until their token expires and they are logged out. Defaults to 90. Set to `null` to disable login expiration.
 * @param {String} options.oauthSecretKey When using the `oauth-encryption` package, the 16 byte key using to encrypt sensitive account credentials in the database, encoded in base64.  This option may only be specifed on the server.  See packages/oauth-encryption/README.md for details.
 */                                                                                                                  // 54
Accounts.config = function(options) {                                                                                // 55
  // We don't want users to accidentally only call Accounts.config on the                                            // 56
  // client, where some of the options will have partial effects (eg removing                                        // 57
  // the "create account" button from accounts-ui if forbidClientAccountCreation                                     // 58
  // is set, or redirecting Google login to a specific-domain page) without                                          // 59
  // having their full effects.                                                                                      // 60
  if (Meteor.isServer) {                                                                                             // 61
    __meteor_runtime_config__.accountsConfigCalled = true;                                                           // 62
  } else if (!__meteor_runtime_config__.accountsConfigCalled) {                                                      // 63
    // XXX would be nice to "crash" the client and replace the UI with an error                                      // 64
    // message, but there's no trivial way to do this.                                                               // 65
    Meteor._debug("Accounts.config was called on the client but not on the " +                                       // 66
                  "server; some configuration options may not take effect.");                                        // 67
  }                                                                                                                  // 68
                                                                                                                     // 69
  // We need to validate the oauthSecretKey option at the time                                                       // 70
  // Accounts.config is called. We also deliberately don't store the                                                 // 71
  // oauthSecretKey in Accounts._options.                                                                            // 72
  if (_.has(options, "oauthSecretKey")) {                                                                            // 73
    if (Meteor.isClient)                                                                                             // 74
      throw new Error("The oauthSecretKey option may only be specified on the server");                              // 75
    if (! Package["oauth-encryption"])                                                                               // 76
      throw new Error("The oauth-encryption package must be loaded to set oauthSecretKey");                          // 77
    Package["oauth-encryption"].OAuthEncryption.loadKey(options.oauthSecretKey);                                     // 78
    options = _.omit(options, "oauthSecretKey");                                                                     // 79
  }                                                                                                                  // 80
                                                                                                                     // 81
  // validate option keys                                                                                            // 82
  var VALID_KEYS = ["sendVerificationEmail", "forbidClientAccountCreation",                                          // 83
                    "restrictCreationByEmailDomain", "loginExpirationInDays"];                                       // 84
  _.each(_.keys(options), function (key) {                                                                           // 85
    if (!_.contains(VALID_KEYS, key)) {                                                                              // 86
      throw new Error("Accounts.config: Invalid key: " + key);                                                       // 87
    }                                                                                                                // 88
  });                                                                                                                // 89
                                                                                                                     // 90
  // set values in Accounts._options                                                                                 // 91
  _.each(VALID_KEYS, function (key) {                                                                                // 92
    if (key in options) {                                                                                            // 93
      if (key in Accounts._options) {                                                                                // 94
        throw new Error("Can't set `" + key + "` more than once");                                                   // 95
      } else {                                                                                                       // 96
        Accounts._options[key] = options[key];                                                                       // 97
      }                                                                                                              // 98
    }                                                                                                                // 99
  });                                                                                                                // 100
                                                                                                                     // 101
  // If the user set loginExpirationInDays to null, then we need to clear the                                        // 102
  // timer that periodically expires tokens.                                                                         // 103
  if (Meteor.isServer)                                                                                               // 104
    maybeStopExpireTokensInterval();                                                                                 // 105
};                                                                                                                   // 106
                                                                                                                     // 107
if (Meteor.isClient) {                                                                                               // 108
  // The connection used by the Accounts system. This is the connection                                              // 109
  // that will get logged in by Meteor.login(), and this is the                                                      // 110
  // connection whose login state will be reflected by Meteor.userId().                                              // 111
  //                                                                                                                 // 112
  // It would be much preferable for this to be in accounts_client.js,                                               // 113
  // but it has to be here because it's needed to create the                                                         // 114
  // Meteor.users collection.                                                                                        // 115
  Accounts.connection = Meteor.connection;                                                                           // 116
                                                                                                                     // 117
  if (typeof __meteor_runtime_config__ !== "undefined" &&                                                            // 118
      __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL) {                                                           // 119
    // Temporary, internal hook to allow the server to point the client                                              // 120
    // to a different authentication server. This is for a very                                                      // 121
    // particular use case that comes up when implementing a oauth                                                   // 122
    // server. Unsupported and may go away at any point in time.                                                     // 123
    //                                                                                                               // 124
    // We will eventually provide a general way to use account-base                                                  // 125
    // against any DDP connection, not just one special one.                                                         // 126
    Accounts.connection = DDP.connect(                                                                               // 127
      __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL)                                                             // 128
  }                                                                                                                  // 129
}                                                                                                                    // 130
                                                                                                                     // 131
// Users table. Don't use the normal autopublish, since we want to hide                                              // 132
// some fields. Code to autopublish this is in accounts_server.js.                                                   // 133
// XXX Allow users to configure this collection name.                                                                // 134
                                                                                                                     // 135
/**                                                                                                                  // 136
 * @summary A [Mongo.Collection](#collections) containing user documents.                                            // 137
 * @locus Anywhere                                                                                                   // 138
 * @type {Mongo.Collection}                                                                                          // 139
 */                                                                                                                  // 140
Meteor.users = new Mongo.Collection("users", {                                                                       // 141
  _preventAutopublish: true,                                                                                         // 142
  connection: Meteor.isClient ? Accounts.connection : Meteor.connection                                              // 143
});                                                                                                                  // 144
// There is an allow call in accounts_server that restricts this                                                     // 145
// collection.                                                                                                       // 146
                                                                                                                     // 147
// loginServiceConfiguration and ConfigError are maintained for backwards compatibility                              // 148
Meteor.startup(function () {                                                                                         // 149
  var ServiceConfiguration =                                                                                         // 150
    Package['service-configuration'].ServiceConfiguration;                                                           // 151
  Accounts.loginServiceConfiguration = ServiceConfiguration.configurations;                                          // 152
  Accounts.ConfigError = ServiceConfiguration.ConfigError;                                                           // 153
});                                                                                                                  // 154
                                                                                                                     // 155
// Thrown when the user cancels the login process (eg, closes an oauth                                               // 156
// popup, declines retina scan, etc)                                                                                 // 157
Accounts.LoginCancelledError = function(description) {                                                               // 158
  this.message = description;                                                                                        // 159
};                                                                                                                   // 160
                                                                                                                     // 161
// This is used to transmit specific subclass errors over the wire. We should                                        // 162
// come up with a more generic way to do this (eg, with some sort of symbolic                                        // 163
// error code rather than a number).                                                                                 // 164
Accounts.LoginCancelledError.numericError = 0x8acdc2f;                                                               // 165
Accounts.LoginCancelledError.prototype = new Error();                                                                // 166
Accounts.LoginCancelledError.prototype.name = 'Accounts.LoginCancelledError';                                        // 167
                                                                                                                     // 168
getTokenLifetimeMs = function () {                                                                                   // 169
  return (Accounts._options.loginExpirationInDays ||                                                                 // 170
          DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;                                                      // 171
};                                                                                                                   // 172
                                                                                                                     // 173
Accounts._tokenExpiration = function (when) {                                                                        // 174
  // We pass when through the Date constructor for backwards compatibility;                                          // 175
  // `when` used to be a number.                                                                                     // 176
  return new Date((new Date(when)).getTime() + getTokenLifetimeMs());                                                // 177
};                                                                                                                   // 178
                                                                                                                     // 179
Accounts._tokenExpiresSoon = function (when) {                                                                       // 180
  var minLifetimeMs = .1 * getTokenLifetimeMs();                                                                     // 181
  var minLifetimeCapMs = MIN_TOKEN_LIFETIME_CAP_SECS * 1000;                                                         // 182
  if (minLifetimeMs > minLifetimeCapMs)                                                                              // 183
    minLifetimeMs = minLifetimeCapMs;                                                                                // 184
  return new Date() > (new Date(when) - minLifetimeMs);                                                              // 185
};                                                                                                                   // 186
                                                                                                                     // 187
// Callback exceptions are printed with Meteor._debug and ignored.                                                   // 188
onLoginHook = new Hook({                                                                                             // 189
  debugPrintExceptions: "onLogin callback"                                                                           // 190
});                                                                                                                  // 191
onLoginFailureHook = new Hook({                                                                                      // 192
  debugPrintExceptions: "onLoginFailure callback"                                                                    // 193
});                                                                                                                  // 194
                                                                                                                     // 195
                                                                                                                     // 196
/**                                                                                                                  // 197
 * @summary Register a callback to be called after a login attempt succeeds.                                         // 198
 * @locus Anywhere                                                                                                   // 199
 * @param {Function} func The callback to be called when login is successful.                                        // 200
 */                                                                                                                  // 201
Accounts.onLogin = function (func) {                                                                                 // 202
  return onLoginHook.register(func);                                                                                 // 203
};                                                                                                                   // 204
                                                                                                                     // 205
/**                                                                                                                  // 206
 * @summary Register a callback to be called after a login attempt fails.                                            // 207
 * @locus Anywhere                                                                                                   // 208
 * @param {Function} func The callback to be called after the login has failed.                                      // 209
 */                                                                                                                  // 210
Accounts.onLoginFailure = function (func) {                                                                          // 211
  return onLoginFailureHook.register(func);                                                                          // 212
};                                                                                                                   // 213
                                                                                                                     // 214
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/url_client.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// By default, allow the autologin process to happen                                                                 // 1
autoLoginEnabled = true;                                                                                             // 2
                                                                                                                     // 3
// All of the special hash URLs we support for accounts interactions                                                 // 4
var accountsPaths = ["reset-password", "verify-email", "enroll-account"];                                            // 5
                                                                                                                     // 6
// Separate out this functionality for testing                                                                       // 7
var attemptToMatchHash = function (hash, success) {                                                                  // 8
  _.each(accountsPaths, function (urlPart) {                                                                         // 9
    var token;                                                                                                       // 10
                                                                                                                     // 11
    tokenRegex = new RegExp("^\\#\\/" + urlPart + "\\/(.*)$");                                                       // 12
    match = hash.match(tokenRegex);                                                                                  // 13
                                                                                                                     // 14
    if (match) {                                                                                                     // 15
      token = match[1];                                                                                              // 16
                                                                                                                     // 17
      // XXX COMPAT WITH 0.9.3                                                                                       // 18
      if (urlPart === "reset-password") {                                                                            // 19
        Accounts._resetPasswordToken = token;                                                                        // 20
      } else if (urlPart === "verify-email") {                                                                       // 21
        Accounts._verifyEmailToken = token;                                                                          // 22
      } else if (urlPart === "enroll-account") {                                                                     // 23
        Accounts._enrollAccountToken = token;                                                                        // 24
      }                                                                                                              // 25
    } else {                                                                                                         // 26
      return;                                                                                                        // 27
    }                                                                                                                // 28
                                                                                                                     // 29
    // Do some stuff with the token we matched                                                                       // 30
    success(token, urlPart);                                                                                         // 31
  });                                                                                                                // 32
};                                                                                                                   // 33
                                                                                                                     // 34
// We only support one callback per URL                                                                              // 35
var accountsCallbacks = {};                                                                                          // 36
                                                                                                                     // 37
// The UI flow will call this when done to log in the existing person                                                // 38
var enableAutoLogin = function () {                                                                                  // 39
  Accounts._enableAutoLogin();                                                                                       // 40
};                                                                                                                   // 41
                                                                                                                     // 42
// Actually call the function, has to happen in the top level so that we can                                         // 43
// mess with autoLoginEnabled.                                                                                       // 44
attemptToMatchHash(window.location.hash, function (token, urlPart) {                                                 // 45
  // put login in a suspended state to wait for the interaction to finish                                            // 46
  autoLoginEnabled = false;                                                                                          // 47
                                                                                                                     // 48
  // reset the URL                                                                                                   // 49
  window.location.hash = "";                                                                                         // 50
                                                                                                                     // 51
  // wait for other packages to register callbacks                                                                   // 52
  Meteor.startup(function () {                                                                                       // 53
    // if a callback has been registered for this kind of token, call it                                             // 54
    if (accountsCallbacks[urlPart]) {                                                                                // 55
      accountsCallbacks[urlPart](token, enableAutoLogin);                                                            // 56
    }                                                                                                                // 57
  });                                                                                                                // 58
});                                                                                                                  // 59
                                                                                                                     // 60
// Export for testing                                                                                                // 61
AccountsTest = {                                                                                                     // 62
  attemptToMatchHash: attemptToMatchHash                                                                             // 63
};                                                                                                                   // 64
                                                                                                                     // 65
// XXX these should be moved to accounts-password eventually. Right now                                              // 66
// this is prevented by the need to set autoLoginEnabled=false, but in                                               // 67
// some bright future we won't need to do that anymore.                                                              // 68
                                                                                                                     // 69
/**                                                                                                                  // 70
 * @summary Register a function to call when a reset password link is clicked                                        // 71
 * in an email sent by                                                                                               // 72
 * [`Accounts.sendResetPasswordEmail`](#accounts_sendresetpasswordemail).                                            // 73
 * This function should be called in top-level code, not inside                                                      // 74
 * `Meteor.startup()`.                                                                                               // 75
 * @param  {Function} callback The function to call. It is given two arguments:                                      // 76
 *                                                                                                                   // 77
 * 1. `token`: A password reset token that can be passed to                                                          // 78
 * [`Accounts.resetPassword`](#accounts_resetpassword).                                                              // 79
 * 2. `done`: A function to call when the password reset UI flow is complete. The normal                             // 80
 * login process is suspended until this function is called, so that the                                             // 81
 * password for user A can be reset even if user B was logged in.                                                    // 82
 * @locus Client                                                                                                     // 83
 */                                                                                                                  // 84
Accounts.onResetPasswordLink = function (callback) {                                                                 // 85
  if (accountsCallbacks["reset-password"]) {                                                                         // 86
    Meteor._debug("Accounts.onResetPasswordLink was called more than once. " +                                       // 87
      "Only one callback added will be executed.");                                                                  // 88
  }                                                                                                                  // 89
                                                                                                                     // 90
  accountsCallbacks["reset-password"] = callback;                                                                    // 91
};                                                                                                                   // 92
                                                                                                                     // 93
/**                                                                                                                  // 94
 * @summary Register a function to call when an email verification link is                                           // 95
 * clicked in an email sent by                                                                                       // 96
 * [`Accounts.sendVerificationEmail`](#accounts_sendverificationemail).                                              // 97
 * This function should be called in top-level code, not inside                                                      // 98
 * `Meteor.startup()`.                                                                                               // 99
 * @param  {Function} callback The function to call. It is given two arguments:                                      // 100
 *                                                                                                                   // 101
 * 1. `token`: An email verification token that can be passed to                                                     // 102
 * [`Accounts.verifyEmail`](#accounts_verifyemail).                                                                  // 103
 * 2. `done`: A function to call when the email verification UI flow is complete.                                    // 104
 * The normal login process is suspended until this function is called, so                                           // 105
 * that the user can be notified that they are verifying their email before                                          // 106
 * being logged in.                                                                                                  // 107
 * @locus Client                                                                                                     // 108
 */                                                                                                                  // 109
Accounts.onEmailVerificationLink = function (callback) {                                                             // 110
  if (accountsCallbacks["verify-email"]) {                                                                           // 111
    Meteor._debug("Accounts.onEmailVerificationLink was called more than once. " +                                   // 112
      "Only one callback added will be executed.");                                                                  // 113
  }                                                                                                                  // 114
                                                                                                                     // 115
  accountsCallbacks["verify-email"] = callback;                                                                      // 116
};                                                                                                                   // 117
                                                                                                                     // 118
/**                                                                                                                  // 119
 * @summary Register a function to call when an account enrollment link is                                           // 120
 * clicked in an email sent by                                                                                       // 121
 * [`Accounts.sendEnrollmentEmail`](#accounts_sendenrollmentemail).                                                  // 122
 * This function should be called in top-level code, not inside                                                      // 123
 * `Meteor.startup()`.                                                                                               // 124
 * @param  {Function} callback The function to call. It is given two arguments:                                      // 125
 *                                                                                                                   // 126
 * 1. `token`: A password reset token that can be passed to                                                          // 127
 * [`Accounts.resetPassword`](#accounts_resetpassword) to give the newly                                             // 128
 * enrolled account a password.                                                                                      // 129
 * 2. `done`: A function to call when the enrollment UI flow is complete.                                            // 130
 * The normal login process is suspended until this function is called, so that                                      // 131
 * user A can be enrolled even if user B was logged in.                                                              // 132
 * @locus Client                                                                                                     // 133
 */                                                                                                                  // 134
Accounts.onEnrollmentLink = function (callback) {                                                                    // 135
  if (accountsCallbacks["enroll-account"]) {                                                                         // 136
    Meteor._debug("Accounts.onEnrollmentLink was called more than once. " +                                          // 137
      "Only one callback added will be executed.");                                                                  // 138
  }                                                                                                                  // 139
                                                                                                                     // 140
  accountsCallbacks["enroll-account"] = callback;                                                                    // 141
};                                                                                                                   // 142
                                                                                                                     // 143
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/accounts_client.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
///                                                                                                                  // 1
/// CURRENT USER                                                                                                     // 2
///                                                                                                                  // 3
                                                                                                                     // 4
// This is reactive.                                                                                                 // 5
                                                                                                                     // 6
/**                                                                                                                  // 7
 * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.                      // 8
 * @locus Anywhere but publish functions                                                                             // 9
 */                                                                                                                  // 10
Meteor.userId = function () {                                                                                        // 11
  return Accounts.connection.userId();                                                                               // 12
};                                                                                                                   // 13
                                                                                                                     // 14
var loggingIn = false;                                                                                               // 15
var loggingInDeps = new Tracker.Dependency;                                                                          // 16
// This is mostly just called within this file, but Meteor.loginWithPassword                                         // 17
// also uses it to make loggingIn() be true during the beginPasswordExchange                                         // 18
// method call too.                                                                                                  // 19
Accounts._setLoggingIn = function (x) {                                                                              // 20
  if (loggingIn !== x) {                                                                                             // 21
    loggingIn = x;                                                                                                   // 22
    loggingInDeps.changed();                                                                                         // 23
  }                                                                                                                  // 24
};                                                                                                                   // 25
                                                                                                                     // 26
/**                                                                                                                  // 27
 * @summary True if a login method (such as `Meteor.loginWithPassword`, `Meteor.loginWithFacebook`, or `Accounts.createUser`) is currently in progress. A reactive data source.
 * @locus Client                                                                                                     // 29
 */                                                                                                                  // 30
Meteor.loggingIn = function () {                                                                                     // 31
  loggingInDeps.depend();                                                                                            // 32
  return loggingIn;                                                                                                  // 33
};                                                                                                                   // 34
                                                                                                                     // 35
// This calls userId, which is reactive.                                                                             // 36
                                                                                                                     // 37
/**                                                                                                                  // 38
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.                  // 39
 * @locus Anywhere but publish functions                                                                             // 40
 */                                                                                                                  // 41
Meteor.user = function () {                                                                                          // 42
  var userId = Meteor.userId();                                                                                      // 43
  if (!userId)                                                                                                       // 44
    return null;                                                                                                     // 45
  return Meteor.users.findOne(userId);                                                                               // 46
};                                                                                                                   // 47
                                                                                                                     // 48
///                                                                                                                  // 49
/// LOGIN METHODS                                                                                                    // 50
///                                                                                                                  // 51
                                                                                                                     // 52
// Call a login method on the server.                                                                                // 53
//                                                                                                                   // 54
// A login method is a method which on success calls `this.setUserId(id)` and                                        // 55
// `Accounts._setLoginToken` on the server and returns an object with fields                                         // 56
// 'id' (containing the user id), 'token' (containing a resume token), and                                           // 57
// optionally `tokenExpires`.                                                                                        // 58
//                                                                                                                   // 59
// This function takes care of:                                                                                      // 60
//   - Updating the Meteor.loggingIn() reactive data source                                                          // 61
//   - Calling the method in 'wait' mode                                                                             // 62
//   - On success, saving the resume token to localStorage                                                           // 63
//   - On success, calling Accounts.connection.setUserId()                                                           // 64
//   - Setting up an onReconnect handler which logs in with                                                          // 65
//     the resume token                                                                                              // 66
//                                                                                                                   // 67
// Options:                                                                                                          // 68
// - methodName: The method to call (default 'login')                                                                // 69
// - methodArguments: The arguments for the method                                                                   // 70
// - validateResult: If provided, will be called with the result of the                                              // 71
//                 method. If it throws, the client will not be logged in (and                                       // 72
//                 its error will be passed to the callback).                                                        // 73
// - userCallback: Will be called with no arguments once the user is fully                                           // 74
//                 logged in, or with the error on error.                                                            // 75
//                                                                                                                   // 76
Accounts.callLoginMethod = function (options) {                                                                      // 77
  options = _.extend({                                                                                               // 78
    methodName: 'login',                                                                                             // 79
    methodArguments: [{}],                                                                                           // 80
    _suppressLoggingIn: false                                                                                        // 81
  }, options);                                                                                                       // 82
  // Set defaults for callback arguments to no-op functions; make sure we                                            // 83
  // override falsey values too.                                                                                     // 84
  _.each(['validateResult', 'userCallback'], function (f) {                                                          // 85
    if (!options[f])                                                                                                 // 86
      options[f] = function () {};                                                                                   // 87
  });                                                                                                                // 88
  // Prepare callbacks: user provided and onLogin/onLoginFailure hooks.                                              // 89
  var loginCallbacks = _.once(function (error) {                                                                     // 90
    if (!error) {                                                                                                    // 91
      onLoginHook.each(function (callback) {                                                                         // 92
        callback();                                                                                                  // 93
      });                                                                                                            // 94
    } else {                                                                                                         // 95
      onLoginFailureHook.each(function (callback) {                                                                  // 96
        callback();                                                                                                  // 97
      });                                                                                                            // 98
    }                                                                                                                // 99
    options.userCallback.apply(this, arguments);                                                                     // 100
  });                                                                                                                // 101
                                                                                                                     // 102
  var reconnected = false;                                                                                           // 103
                                                                                                                     // 104
  // We want to set up onReconnect as soon as we get a result token back from                                        // 105
  // the server, without having to wait for subscriptions to rerun. This is                                          // 106
  // because if we disconnect and reconnect between getting the result and                                           // 107
  // getting the results of subscription rerun, we WILL NOT re-send this                                             // 108
  // method (because we never re-send methods whose results we've received)                                          // 109
  // but we WILL call loggedInAndDataReadyCallback at "reconnect quiesce"                                            // 110
  // time. This will lead to makeClientLoggedIn(result.id) even though we                                            // 111
  // haven't actually sent a login method!                                                                           // 112
  //                                                                                                                 // 113
  // But by making sure that we send this "resume" login in that case (and                                           // 114
  // calling makeClientLoggedOut if it fails), we'll end up with an accurate                                         // 115
  // client-side userId. (It's important that livedata_connection guarantees                                         // 116
  // that the "reconnect quiesce"-time call to loggedInAndDataReadyCallback                                          // 117
  // will occur before the callback from the resume login call.)                                                     // 118
  var onResultReceived = function (err, result) {                                                                    // 119
    if (err || !result || !result.token) {                                                                           // 120
      Accounts.connection.onReconnect = null;                                                                        // 121
    } else {                                                                                                         // 122
      Accounts.connection.onReconnect = function () {                                                                // 123
        reconnected = true;                                                                                          // 124
        // If our token was updated in storage, use the latest one.                                                  // 125
        var storedToken = storedLoginToken();                                                                        // 126
        if (storedToken) {                                                                                           // 127
          result = {                                                                                                 // 128
            token: storedToken,                                                                                      // 129
            tokenExpires: storedLoginTokenExpires()                                                                  // 130
          };                                                                                                         // 131
        }                                                                                                            // 132
        if (! result.tokenExpires)                                                                                   // 133
          result.tokenExpires = Accounts._tokenExpiration(new Date());                                               // 134
        if (Accounts._tokenExpiresSoon(result.tokenExpires)) {                                                       // 135
          makeClientLoggedOut();                                                                                     // 136
        } else {                                                                                                     // 137
          Accounts.callLoginMethod({                                                                                 // 138
            methodArguments: [{resume: result.token}],                                                               // 139
            // Reconnect quiescence ensures that the user doesn't see an                                             // 140
            // intermediate state before the login method finishes. So we don't                                      // 141
            // need to show a logging-in animation.                                                                  // 142
            _suppressLoggingIn: true,                                                                                // 143
            userCallback: function (error) {                                                                         // 144
              var storedTokenNow = storedLoginToken();                                                               // 145
              if (error) {                                                                                           // 146
                // If we had a login error AND the current stored token is the                                       // 147
                // one that we tried to log in with, then declare ourselves                                          // 148
                // logged out. If there's a token in storage but it's not the                                        // 149
                // token that we tried to log in with, we don't know anything                                        // 150
                // about whether that token is valid or not, so do nothing. The                                      // 151
                // periodic localStorage poll will decide if we are logged in or                                     // 152
                // out with this token, if it hasn't already. Of course, even                                        // 153
                // with this check, another tab could insert a new valid token                                       // 154
                // immediately before we clear localStorage here, which would                                        // 155
                // lead to both tabs being logged out, but by checking the token                                     // 156
                // in storage right now we hope to make that unlikely to happen.                                     // 157
                //                                                                                                   // 158
                // If there is no token in storage right now, we don't have to                                       // 159
                // do anything; whatever code removed the token from storage was                                     // 160
                // responsible for calling `makeClientLoggedOut()`, or the                                           // 161
                // periodic localStorage poll will call `makeClientLoggedOut`                                        // 162
                // eventually if another tab wiped the token from storage.                                           // 163
                if (storedTokenNow && storedTokenNow === result.token) {                                             // 164
                  makeClientLoggedOut();                                                                             // 165
                }                                                                                                    // 166
              }                                                                                                      // 167
              // Possibly a weird callback to call, but better than nothing if                                       // 168
              // there is a reconnect between "login result received" and "data                                      // 169
              // ready".                                                                                             // 170
              loginCallbacks(error);                                                                                 // 171
            }});                                                                                                     // 172
        }                                                                                                            // 173
      };                                                                                                             // 174
    }                                                                                                                // 175
  };                                                                                                                 // 176
                                                                                                                     // 177
  // This callback is called once the local cache of the current-user                                                // 178
  // subscription (and all subscriptions, in fact) are guaranteed to be up to                                        // 179
  // date.                                                                                                           // 180
  var loggedInAndDataReadyCallback = function (error, result) {                                                      // 181
    // If the login method returns its result but the connection is lost                                             // 182
    // before the data is in the local cache, it'll set an onReconnect (see                                          // 183
    // above). The onReconnect will try to log in using the token, and *it*                                          // 184
    // will call userCallback via its own version of this                                                            // 185
    // loggedInAndDataReadyCallback. So we don't have to do anything here.                                           // 186
    if (reconnected)                                                                                                 // 187
      return;                                                                                                        // 188
                                                                                                                     // 189
    // Note that we need to call this even if _suppressLoggingIn is true,                                            // 190
    // because it could be matching a _setLoggingIn(true) from a                                                     // 191
    // half-completed pre-reconnect login method.                                                                    // 192
    Accounts._setLoggingIn(false);                                                                                   // 193
    if (error || !result) {                                                                                          // 194
      error = error || new Error(                                                                                    // 195
        "No result from call to " + options.methodName);                                                             // 196
      loginCallbacks(error);                                                                                         // 197
      return;                                                                                                        // 198
    }                                                                                                                // 199
    try {                                                                                                            // 200
      options.validateResult(result);                                                                                // 201
    } catch (e) {                                                                                                    // 202
      loginCallbacks(e);                                                                                             // 203
      return;                                                                                                        // 204
    }                                                                                                                // 205
                                                                                                                     // 206
    // Make the client logged in. (The user data should already be loaded!)                                          // 207
    makeClientLoggedIn(result.id, result.token, result.tokenExpires);                                                // 208
    loginCallbacks();                                                                                                // 209
  };                                                                                                                 // 210
                                                                                                                     // 211
  if (!options._suppressLoggingIn)                                                                                   // 212
    Accounts._setLoggingIn(true);                                                                                    // 213
  Accounts.connection.apply(                                                                                         // 214
    options.methodName,                                                                                              // 215
    options.methodArguments,                                                                                         // 216
    {wait: true, onResultReceived: onResultReceived},                                                                // 217
    loggedInAndDataReadyCallback);                                                                                   // 218
};                                                                                                                   // 219
                                                                                                                     // 220
makeClientLoggedOut = function() {                                                                                   // 221
  unstoreLoginToken();                                                                                               // 222
  Accounts.connection.setUserId(null);                                                                               // 223
  Accounts.connection.onReconnect = null;                                                                            // 224
};                                                                                                                   // 225
                                                                                                                     // 226
makeClientLoggedIn = function(userId, token, tokenExpires) {                                                         // 227
  storeLoginToken(userId, token, tokenExpires);                                                                      // 228
  Accounts.connection.setUserId(userId);                                                                             // 229
};                                                                                                                   // 230
                                                                                                                     // 231
/**                                                                                                                  // 232
 * @summary Log the user out.                                                                                        // 233
 * @locus Client                                                                                                     // 234
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                                  // 236
Meteor.logout = function (callback) {                                                                                // 237
  Accounts.connection.apply('logout', [], {wait: true}, function(error, result) {                                    // 238
    if (error) {                                                                                                     // 239
      callback && callback(error);                                                                                   // 240
    } else {                                                                                                         // 241
      makeClientLoggedOut();                                                                                         // 242
      callback && callback();                                                                                        // 243
    }                                                                                                                // 244
  });                                                                                                                // 245
};                                                                                                                   // 246
                                                                                                                     // 247
/**                                                                                                                  // 248
 * @summary Log out other clients logged in as the current user, but does not log out the client that calls this function.
 * @locus Client                                                                                                     // 250
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                                  // 252
Meteor.logoutOtherClients = function (callback) {                                                                    // 253
  // We need to make two method calls: one to replace our current token,                                             // 254
  // and another to remove all tokens except the current one. We want to                                             // 255
  // call these two methods one after the other, without any other                                                   // 256
  // methods running between them. For example, we don't want `logout`                                               // 257
  // to be called in between our two method calls (otherwise the second                                              // 258
  // method call would return an error). Another example: we don't want                                              // 259
  // logout to be called before the callback for `getNewToken`;                                                      // 260
  // otherwise we would momentarily log the user out and then write a                                                // 261
  // new token to localStorage.                                                                                      // 262
  //                                                                                                                 // 263
  // To accomplish this, we make both calls as wait methods, and queue                                               // 264
  // them one after the other, without spinning off the event loop in                                                // 265
  // between. Even though we queue `removeOtherTokens` before                                                        // 266
  // `getNewToken`, we won't actually send the `removeOtherTokens` call                                              // 267
  // until the `getNewToken` callback has finished running, because they                                             // 268
  // are both wait methods.                                                                                          // 269
  Accounts.connection.apply(                                                                                         // 270
    'getNewToken',                                                                                                   // 271
    [],                                                                                                              // 272
    { wait: true },                                                                                                  // 273
    function (err, result) {                                                                                         // 274
      if (! err) {                                                                                                   // 275
        storeLoginToken(Meteor.userId(), result.token, result.tokenExpires);                                         // 276
      }                                                                                                              // 277
    }                                                                                                                // 278
  );                                                                                                                 // 279
  Accounts.connection.apply(                                                                                         // 280
    'removeOtherTokens',                                                                                             // 281
    [],                                                                                                              // 282
    { wait: true },                                                                                                  // 283
    function (err) {                                                                                                 // 284
      callback && callback(err);                                                                                     // 285
    }                                                                                                                // 286
  );                                                                                                                 // 287
};                                                                                                                   // 288
                                                                                                                     // 289
                                                                                                                     // 290
///                                                                                                                  // 291
/// LOGIN SERVICES                                                                                                   // 292
///                                                                                                                  // 293
                                                                                                                     // 294
var loginServicesHandle =                                                                                            // 295
  Accounts.connection.subscribe("meteor.loginServiceConfiguration");                                                 // 296
                                                                                                                     // 297
// A reactive function returning whether the loginServiceConfiguration                                               // 298
// subscription is ready. Used by accounts-ui to hide the login button                                               // 299
// until we have all the configuration loaded                                                                        // 300
//                                                                                                                   // 301
Accounts.loginServicesConfigured = function () {                                                                     // 302
  return loginServicesHandle.ready();                                                                                // 303
};                                                                                                                   // 304
                                                                                                                     // 305
// Some login services such as the redirect login flow or the resume                                                 // 306
// login handler can log the user in at page load time.  The                                                         // 307
// Meteor.loginWithX functions have a callback argument, but the                                                     // 308
// callback function instance won't be in memory any longer if the                                                   // 309
// page was reloaded.  The `onPageLoadLogin` function allows a                                                       // 310
// callback to be registered for the case where the login was                                                        // 311
// initiated in a previous VM, and we now have the result of the login                                               // 312
// attempt in a new VM.                                                                                              // 313
                                                                                                                     // 314
var pageLoadLoginCallbacks = [];                                                                                     // 315
var pageLoadLoginAttemptInfo = null;                                                                                 // 316
                                                                                                                     // 317
// Register a callback to be called if we have information about a                                                   // 318
// login attempt at page load time.  Call the callback immediately if                                                // 319
// we already have the page load login attempt info, otherwise stash                                                 // 320
// the callback to be called if and when we do get the attempt info.                                                 // 321
//                                                                                                                   // 322
Accounts.onPageLoadLogin = function (f) {                                                                            // 323
  if (pageLoadLoginAttemptInfo)                                                                                      // 324
    f(pageLoadLoginAttemptInfo);                                                                                     // 325
  else                                                                                                               // 326
    pageLoadLoginCallbacks.push(f);                                                                                  // 327
};                                                                                                                   // 328
                                                                                                                     // 329
                                                                                                                     // 330
// Receive the information about the login attempt at page load time.                                                // 331
// Call registered callbacks, and also record the info in case                                                       // 332
// someone's callback hasn't been registered yet.                                                                    // 333
//                                                                                                                   // 334
Accounts._pageLoadLogin = function (attemptInfo) {                                                                   // 335
  if (pageLoadLoginAttemptInfo) {                                                                                    // 336
    Meteor._debug("Ignoring unexpected duplicate page load login attempt info");                                     // 337
    return;                                                                                                          // 338
  }                                                                                                                  // 339
  _.each(pageLoadLoginCallbacks, function (callback) { callback(attemptInfo); });                                    // 340
  pageLoadLoginCallbacks = [];                                                                                       // 341
  pageLoadLoginAttemptInfo = attemptInfo;                                                                            // 342
};                                                                                                                   // 343
                                                                                                                     // 344
                                                                                                                     // 345
///                                                                                                                  // 346
/// HANDLEBARS HELPERS                                                                                               // 347
///                                                                                                                  // 348
                                                                                                                     // 349
// If our app has a Blaze, register the {{currentUser}} and {{loggingIn}}                                            // 350
// global helpers.                                                                                                   // 351
if (Package.blaze) {                                                                                                 // 352
  /**                                                                                                                // 353
   * @global                                                                                                         // 354
   * @name  currentUser                                                                                              // 355
   * @isHelper true                                                                                                  // 356
   * @summary Calls [Meteor.user()](#meteor_user). Use `{{#if currentUser}}` to check whether the user is logged in. // 357
   */                                                                                                                // 358
  Package.blaze.Blaze.Template.registerHelper('currentUser', function () {                                           // 359
    return Meteor.user();                                                                                            // 360
  });                                                                                                                // 361
                                                                                                                     // 362
  /**                                                                                                                // 363
   * @global                                                                                                         // 364
   * @name  loggingIn                                                                                                // 365
   * @isHelper true                                                                                                  // 366
   * @summary Calls [Meteor.loggingIn()](#meteor_loggingin).                                                         // 367
   */                                                                                                                // 368
  Package.blaze.Blaze.Template.registerHelper('loggingIn', function () {                                             // 369
    return Meteor.loggingIn();                                                                                       // 370
  });                                                                                                                // 371
}                                                                                                                    // 372
                                                                                                                     // 373
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/localstorage_token.js                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// This file deals with storing a login token and user id in the                                                     // 1
// browser's localStorage facility. It polls local storage every few                                                 // 2
// seconds to synchronize login state between multiple tabs in the same                                              // 3
// browser.                                                                                                          // 4
                                                                                                                     // 5
var lastLoginTokenWhenPolled;                                                                                        // 6
                                                                                                                     // 7
// Login with a Meteor access token. This is the only public function                                                // 8
// here.                                                                                                             // 9
Meteor.loginWithToken = function (token, callback) {                                                                 // 10
  Accounts.callLoginMethod({                                                                                         // 11
    methodArguments: [{resume: token}],                                                                              // 12
    userCallback: callback});                                                                                        // 13
};                                                                                                                   // 14
                                                                                                                     // 15
// Semi-internal API. Call this function to re-enable auto login after                                               // 16
// if it was disabled at startup.                                                                                    // 17
Accounts._enableAutoLogin = function () {                                                                            // 18
  autoLoginEnabled = true;                                                                                           // 19
  pollStoredLoginToken();                                                                                            // 20
};                                                                                                                   // 21
                                                                                                                     // 22
                                                                                                                     // 23
///                                                                                                                  // 24
/// STORING                                                                                                          // 25
///                                                                                                                  // 26
                                                                                                                     // 27
// Key names to use in localStorage                                                                                  // 28
var loginTokenKey = "Meteor.loginToken";                                                                             // 29
var loginTokenExpiresKey = "Meteor.loginTokenExpires";                                                               // 30
var userIdKey = "Meteor.userId";                                                                                     // 31
                                                                                                                     // 32
// Call this from the top level of the test file for any test that does                                              // 33
// logging in and out, to protect multiple tabs running the same tests                                               // 34
// simultaneously from interfering with each others' localStorage.                                                   // 35
Accounts._isolateLoginTokenForTest = function () {                                                                   // 36
  loginTokenKey = loginTokenKey + Random.id();                                                                       // 37
  userIdKey = userIdKey + Random.id();                                                                               // 38
};                                                                                                                   // 39
                                                                                                                     // 40
storeLoginToken = function(userId, token, tokenExpires) {                                                            // 41
  Meteor._localStorage.setItem(userIdKey, userId);                                                                   // 42
  Meteor._localStorage.setItem(loginTokenKey, token);                                                                // 43
  if (! tokenExpires)                                                                                                // 44
    tokenExpires = Accounts._tokenExpiration(new Date());                                                            // 45
  Meteor._localStorage.setItem(loginTokenExpiresKey, tokenExpires);                                                  // 46
                                                                                                                     // 47
  // to ensure that the localstorage poller doesn't end up trying to                                                 // 48
  // connect a second time                                                                                           // 49
  lastLoginTokenWhenPolled = token;                                                                                  // 50
};                                                                                                                   // 51
                                                                                                                     // 52
unstoreLoginToken = function() {                                                                                     // 53
  Meteor._localStorage.removeItem(userIdKey);                                                                        // 54
  Meteor._localStorage.removeItem(loginTokenKey);                                                                    // 55
  Meteor._localStorage.removeItem(loginTokenExpiresKey);                                                             // 56
                                                                                                                     // 57
  // to ensure that the localstorage poller doesn't end up trying to                                                 // 58
  // connect a second time                                                                                           // 59
  lastLoginTokenWhenPolled = null;                                                                                   // 60
};                                                                                                                   // 61
                                                                                                                     // 62
// This is private, but it is exported for now because it is used by a                                               // 63
// test in accounts-password.                                                                                        // 64
//                                                                                                                   // 65
storedLoginToken = Accounts._storedLoginToken = function() {                                                         // 66
  return Meteor._localStorage.getItem(loginTokenKey);                                                                // 67
};                                                                                                                   // 68
                                                                                                                     // 69
storedLoginTokenExpires = function () {                                                                              // 70
  return Meteor._localStorage.getItem(loginTokenExpiresKey);                                                         // 71
};                                                                                                                   // 72
                                                                                                                     // 73
var storedUserId = function() {                                                                                      // 74
  return Meteor._localStorage.getItem(userIdKey);                                                                    // 75
};                                                                                                                   // 76
                                                                                                                     // 77
var unstoreLoginTokenIfExpiresSoon = function () {                                                                   // 78
  var tokenExpires = Meteor._localStorage.getItem(loginTokenExpiresKey);                                             // 79
  if (tokenExpires && Accounts._tokenExpiresSoon(new Date(tokenExpires)))                                            // 80
    unstoreLoginToken();                                                                                             // 81
};                                                                                                                   // 82
                                                                                                                     // 83
///                                                                                                                  // 84
/// AUTO-LOGIN                                                                                                       // 85
///                                                                                                                  // 86
                                                                                                                     // 87
if (autoLoginEnabled) {                                                                                              // 88
  // Immediately try to log in via local storage, so that any DDP                                                    // 89
  // messages are sent after we have established our user account                                                    // 90
  unstoreLoginTokenIfExpiresSoon();                                                                                  // 91
  var token = storedLoginToken();                                                                                    // 92
  if (token) {                                                                                                       // 93
    // On startup, optimistically present us as logged in while the                                                  // 94
    // request is in flight. This reduces page flicker on startup.                                                   // 95
    var userId = storedUserId();                                                                                     // 96
    userId && Accounts.connection.setUserId(userId);                                                                 // 97
    Meteor.loginWithToken(token, function (err) {                                                                    // 98
      if (err) {                                                                                                     // 99
        Meteor._debug("Error logging in with token: " + err);                                                        // 100
        makeClientLoggedOut();                                                                                       // 101
      }                                                                                                              // 102
      Accounts._pageLoadLogin({                                                                                      // 103
        type: "resume",                                                                                              // 104
        allowed: !err,                                                                                               // 105
        error: err,                                                                                                  // 106
        methodName: "login",                                                                                         // 107
        // XXX This is duplicate code with loginWithToken, but                                                       // 108
        // loginWithToken can also be called at other times besides                                                  // 109
        // page load.                                                                                                // 110
        methodArguments: [{resume: token}]                                                                           // 111
      });                                                                                                            // 112
    });                                                                                                              // 113
  }                                                                                                                  // 114
}                                                                                                                    // 115
                                                                                                                     // 116
// Poll local storage every 3 seconds to login if someone logged in in                                               // 117
// another tab                                                                                                       // 118
lastLoginTokenWhenPolled = token;                                                                                    // 119
var pollStoredLoginToken = function() {                                                                              // 120
  if (! autoLoginEnabled)                                                                                            // 121
    return;                                                                                                          // 122
                                                                                                                     // 123
  var currentLoginToken = storedLoginToken();                                                                        // 124
                                                                                                                     // 125
  // != instead of !== just to make sure undefined and null are treated the same                                     // 126
  if (lastLoginTokenWhenPolled != currentLoginToken) {                                                               // 127
    if (currentLoginToken) {                                                                                         // 128
      Meteor.loginWithToken(currentLoginToken, function (err) {                                                      // 129
        if (err)                                                                                                     // 130
          makeClientLoggedOut();                                                                                     // 131
      });                                                                                                            // 132
    } else {                                                                                                         // 133
      Meteor.logout();                                                                                               // 134
    }                                                                                                                // 135
  }                                                                                                                  // 136
  lastLoginTokenWhenPolled = currentLoginToken;                                                                      // 137
};                                                                                                                   // 138
                                                                                                                     // 139
setInterval(pollStoredLoginToken, 3000);                                                                             // 140
                                                                                                                     // 141
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-base'] = {
  Accounts: Accounts,
  AccountsTest: AccountsTest
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var ServiceConfiguration;

(function () {

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/service-configuration/service_configuration_common.js                     //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
if (typeof ServiceConfiguration === 'undefined') {                                    // 1
  ServiceConfiguration = {};                                                          // 2
}                                                                                     // 3
                                                                                      // 4
                                                                                      // 5
// Table containing documents with configuration options for each                     // 6
// login service                                                                      // 7
ServiceConfiguration.configurations = new Mongo.Collection(                           // 8
  "meteor_accounts_loginServiceConfiguration", {                                      // 9
    _preventAutopublish: true,                                                        // 10
    connection: Meteor.isClient ? Accounts.connection : Meteor.connection             // 11
  });                                                                                 // 12
// Leave this collection open in insecure mode. In theory, someone could              // 13
// hijack your oauth connect requests to a different endpoint or appId,               // 14
// but you did ask for 'insecure'. The advantage is that it is much                   // 15
// easier to write a configuration wizard that works only in insecure                 // 16
// mode.                                                                              // 17
                                                                                      // 18
                                                                                      // 19
// Thrown when trying to use a login service which is not configured                  // 20
ServiceConfiguration.ConfigError = function (serviceName) {                           // 21
  if (Meteor.isClient && !Accounts.loginServicesConfigured()) {                       // 22
    this.message = "Login service configuration not yet loaded";                      // 23
  } else if (serviceName) {                                                           // 24
    this.message = "Service " + serviceName + " not configured";                      // 25
  } else {                                                                            // 26
    this.message = "Service not configured";                                          // 27
  }                                                                                   // 28
};                                                                                    // 29
ServiceConfiguration.ConfigError.prototype = new Error();                             // 30
ServiceConfiguration.ConfigError.prototype.name = 'ServiceConfiguration.ConfigError'; // 31
                                                                                      // 32
////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['service-configuration'] = {
  ServiceConfiguration: ServiceConfiguration
};

})();
/* Imports for global scope */

Accounts = Package['accounts-base'].Accounts;

