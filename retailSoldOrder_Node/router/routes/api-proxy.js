/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var express = require("express");
var log = require("cf-nodejs-logging-support");
var request = require("request");
var xsenv = require("@sap/xsenv");

module.exports = function () {
	var router = express.Router();

	// TODO: provide service name via environment variable instead
	var apimServiceName = "RETAIL_SOLD_ORDER_APIM_CUPS";
	var options = {};
	options = Object.assign(options, xsenv.getServices({
		api: {
			name: apimServiceName
		}
	}));
	log.logMessage("debug", "Properties of APIM user-provided service '%s' : %s", apimServiceName, JSON.stringify(options));

	var url = options.api.host;
	var APIKey = options.api.APIKey;
	var s4Client = options.api.client;
	var s4User = options.api.user;
	var s4Password = options.api.password;
	var apicClientId = options.api.apicClientId;
	var apicClientSecret = options.api.apicClientSecret;

	// Add router middleware for CORS
	router.use(function (req, res, next) {
		// TODO: should allow only the UI module in the MTA
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
		next();
	});

	var cachedCsrfToken;

	router.all("/*", function (req, res, next) {
		var proxiedMethod = req.method;
		var proxiedReqHeaders = {
			"APIKey": APIKey,
			"Content-Type": req.get("Content-Type")
		};
		var proxiedUrl = url + req.url;

		// Proxied call is to IBM APIC
		if (req.url.startsWith("/tci/internal")) {
			proxiedReqHeaders["x-ibm-client-id"] = apicClientId;
			proxiedReqHeaders["x-ibm-client-secret"] = apicClientSecret;

			req.logMessage("debug", "Proxied Method: %s", proxiedMethod);
			req.logMessage("debug", "Proxied request headers: %s", JSON.stringify(proxiedReqHeaders));
			req.logMessage("debug", "Proxied URL: %s", proxiedUrl);

			let proxiedReq = request({
				headers: proxiedReqHeaders,
				method: proxiedMethod,
				url: proxiedUrl
			});
			req.pipe(proxiedReq);
			proxiedReq.on("response", proxiedRes => {
				req.logMessage("verbose", "Proxied call %s %s successful.", proxiedMethod, proxiedUrl);
				delete proxiedRes.headers.cookie;
				proxiedReq.pipe(res);
			}).on("error", error => {
				req.logMessage("error", "Proxied call %s %s FAILED: %s", proxiedMethod, proxiedUrl, error);
				next(error);
			});
		}

		// Proxied call is to S4/HANA
		else {
			proxiedReqHeaders.Authorization = "Basic " + new Buffer(s4User + ":" + s4Password).toString("base64");
			if (proxiedMethod === "GET") {
				proxiedReqHeaders["x-csrf-token"] = "Fetch";
			} else if (proxiedMethod === "DELETE" || proxiedMethod === "HEAD" || proxiedMethod === "POST" || proxiedMethod === "PUT") {
				proxiedReqHeaders["x-csrf-token"] = cachedCsrfToken;
			}

			req.logMessage("debug", "Proxied Method: %s", proxiedMethod);
			req.logMessage("debug", "Proxied request headers: %s", JSON.stringify(proxiedReqHeaders));
			req.logMessage("debug", "Proxied URL: %s", proxiedUrl);

			let proxiedReq = request({
				headers: proxiedReqHeaders,
				method: proxiedMethod,
				url: proxiedUrl
			});
			req.pipe(proxiedReq);
			proxiedReq.on("response", proxiedRes => {
				req.logMessage("verbose", "Proxied call %s %s successful.", proxiedMethod, proxiedUrl);
				delete proxiedRes.headers.cookie;

				// Cache fetched CSRF token
				var proxiedResCsrfToken = proxiedRes.headers["x-csrf-token"];
				if (proxiedResCsrfToken && proxiedResCsrfToken !== "Required") {
					req.logMessage("debug", "Received CSRF token: %s", proxiedResCsrfToken);
					cachedCsrfToken = proxiedResCsrfToken;
				} else {
					req.logMessage("error", "Proxied call %s %s FAILED due to invalid or missing CSRF token.", proxiedMethod, proxiedUrl);
				}

				proxiedReq.pipe(res);
			}).on("error", error => {
				req.logMessage("error", "Proxied call %s %s FAILED: %s", proxiedMethod, proxiedUrl, error);
				next(error);
			});
		}
	});
	return router;
};