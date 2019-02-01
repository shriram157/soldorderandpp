/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var express = require("express");
var request = require("request");
var xsenv = require("@sap/xsenv");

module.exports = function () {
	var router = express.Router();

	var options = {};
	options = Object.assign(options, xsenv.getServices({
		api: {
			// TODO: provide service name via environment variable instead
			name: "RETAIL_SOLD_ORDER_APIM_CUPS"
		}
	}));

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
			let proxiedReq = request({
				headers: proxiedReqHeaders,
				method: proxiedMethod,
				url: proxiedUrl
			});
			req.pipe(proxiedReq);
			proxiedReq.on("response", proxiedRes => {
				delete proxiedRes.headers.cookie;
				proxiedReq.pipe(res);
			}).on("error", error => {
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
			let proxiedReq = request({
				headers: proxiedReqHeaders,
				method: proxiedMethod,
				url: proxiedUrl
			});
			req.pipe(proxiedReq);
			proxiedReq.on("response", proxiedRes => {
				delete proxiedRes.headers.cookie;

				// Cache fetched CSRF token
				var proxiedResCsrfToken = proxiedRes.headers["x-csrf-token"];
				if (proxiedResCsrfToken && proxiedResCsrfToken !== "Required") {
					cachedCsrfToken = proxiedResCsrfToken;
				}

				proxiedReq.pipe(res);
			}).on("error", error => {
				next(error);
			});
		}
	});
	return router;
};