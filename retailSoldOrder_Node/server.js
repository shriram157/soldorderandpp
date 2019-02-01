/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var express = require("express");
var https = require("https");
var logging = require("@sap/logging");

var server = require("http").createServer();
var port = process.env.PORT || 3000;

// Initialize Express app and set up middleware
var app = express();

// Logging
var appContext = logging.createAppContext();
app.use(logging.expressMiddleware(appContext));

// Router
var router = require("./router")(app, server);

// Start server
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});