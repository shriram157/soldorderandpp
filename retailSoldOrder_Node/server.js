/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var cors = require("cors");
var express = require("express");
var https = require("https");
var log = require("cf-nodejs-logging-support");

var server = require("http").createServer();
var port = process.env.PORT || 3000;

// Initialize Express app and set up middleware
var app = express();

// Logging
log.setLoggingLevel(process.env.XS_APP_LOG_LEVEL || "info");
app.use(log.logNetwork);

// CORS
app.use(cors());

// Router
var router = require("./router")(app, server);

// Start server
server.on("request", app);
server.listen(port, function () {
	log.logMessage("info", "Server is listening on port %d", port);
});