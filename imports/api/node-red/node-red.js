var express = require("express");
var RED = require("node-red");

// TODO
//var growPlugin = require("node-red-grow-plugin");

// Create an Express app
var app = express();

// See node-red configuration documentation for options.
var settings = {
    httpRoot:"/red",
    httpNodeRoot: "/api",
    adminAuth: require("./user-authentication"),
    editorTheme: {
        projects: {
            enabled: true
        }
    },
    functionGlobalContext: { }    // enables global context
};

// Initialise the runtime with Meteor http server and settings
RED.init(WebApp.httpServer, settings);

// Serve the editor UI from /red
app.use(settings.httpRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

WebApp.connectHandlers.use('/', app);

RED.start();
