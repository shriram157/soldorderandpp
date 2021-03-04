/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

module.exports = function (appContext) {
	var express = require("express");
	var request = require("request");
	var xsenv = require("@sap/xsenv");

	var router = express.Router();

	var mockUserMode = false;
	if (process.env.MOCK_USER_MODE === "true" || process.env.MOCK_USER_MODE === "TRUE") {
		mockUserMode = true;
	}
	var mockUserOrigin = process.env.MOCK_USER_ORIGIN;

	// Get UPS name from env var UPS_NAME
	var apimServiceName = process.env.UPS_NAME;
	var options = {};
	options = Object.assign(options, xsenv.getServices({
		apim: {
			name: apimServiceName
		}
	}));

	var xsuaaService = xsenv.getServices({
		xsuaa: {
			tag: "xsuaa"
		}
	}).xsuaa;

	var url = options.apim.host;
	var APIKey = options.apim.APIKey;
	var s4Client = options.apim.client;
	var s4User = options.apim.user;
	var s4Password = options.apim.password;

	router.get("/attributes", (req, res) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/Attributes");
		var tracer = req.loggingContext.getTracer(__filename);
		var userProfile = req.user;
		var userAttributes = req.authInfo.userAttributes;
		tracer.debug("User profile from JWT: %s", JSON.stringify(userProfile));
		tracer.debug("User attributes from JWT: %s", JSON.stringify(userAttributes));

		// If there is no user type, it is most probably a call from Neo, in which case we can fake the data as TCI user
		if (mockUserMode && mockUserOrigin === req.authInfo.origin) {
			userAttributes = {
				Language: ["English"],
				UserType: ["National"]
			};
			tracer.debug("Mock user mode is enabled and JWT is from origin %s, switch to mock user attributes: %s", req.authInfo.origin, JSON.stringify(
				userAttributes));
		}

		var resBody = {
			"attributes": [],
			"userProfile": userProfile,
			"samlAttributes": userAttributes,
			legacyDealer: "",
			legacyDealerName: "",
			"sales": []
		};

		var userType = userAttributes.UserType[0];
		var dealerCode = null;
		var zone = null;
		var bpZone = null;
		var bpReqUrl = null;

		// Dealer user
		if (userType === "Dealer") {
			dealerCode = userAttributes.DealerCode[0];
			bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json&$filter=SearchTerm2 eq '" +
				dealerCode + "'&$expand=to_Customer";
		}

		// Zone user
		else if (userType === "Zone") {
			zone = userAttributes.Zone[0];
			if (zone === "1") {
				bpZone = "1000";
			} else if (zone === "2") {
				bpZone = "2000";
			} else if (zone === "3") {
				bpZone = "3000";
			} else if (zone === "4") {
				bpZone = "5000";
			} else if (zone === "5") {
				bpZone = "4000";
			} else if (zone === "7") {
				bpZone = "9000";
			} else {
				logger.warning("Unrecognized zone ID: %s", zone);
				return res.type("plain/text").status(400).send("Unknown zone ID.");
			}

			bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json" +
				"&$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004')" +
				"and zstatus ne 'X' &$orderby=BusinessPartner asc &$select=BusinessPartner,BusinessPartnerName,BusinessPartnerType,OrganizationBPName1,SearchTerm2,to_Customer/Attribute1,to_Customer/to_CustomerSalesArea/SalesOffice,to_Customer/to_CustomerSalesArea/Customer,to_Customer/to_CustomerSalesArea/SalesOrganization,to_Customer/to_CustomerSalesArea/DistributionChannel,to_Customer/to_CustomerSalesArea/Division,to_Customer/to_CustomerSalesArea/SalesGroup";
		}

		// National user (TCI user)
		else {
			bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json" +
				"&$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004')" +
				"and zstatus ne 'X' &$orderby=BusinessPartner asc &$select=BusinessPartner,BusinessPartnerName,BusinessPartnerType,OrganizationBPName1,SearchTerm2,to_Customer/Attribute1,to_Customer/to_CustomerSalesArea/SalesOffice,to_Customer/to_CustomerSalesArea/Customer,to_Customer/to_CustomerSalesArea/SalesOrganization,to_Customer/to_CustomerSalesArea/DistributionChannel,to_Customer/to_CustomerSalesArea/Division,to_Customer/to_CustomerSalesArea/SalesGroup";
		}

		tracer.debug("BP URL: %s", bpReqUrl);
		var bpReqHeaders = {
			"APIKey": APIKey,
			"Authorization": "Basic " + new Buffer(s4User + ":" + s4Password).toString("base64"),
			"Content-Type": "application/json"
		};
		request({
			url: bpReqUrl,
			headers: bpReqHeaders
		}, function (bpErr, bpRes, bpResBodyStr) {
			var toCustomerAttr1 = null;
			var bpAttributes = null;

			tracer.debug("Response body from proxied BP call: %s", bpResBodyStr);

			if (!bpErr && bpRes.statusCode === 200) {
				var bpResBody = JSON.parse(bpResBodyStr);
				var bpResults = bpResBody.d.results;

				if (userType === "Zone") {
					bpResults = bpResults.filter(o => {
						if (!o.to_Customer) {
							return false;
						}
						var customerSalesArea = o.to_Customer.to_CustomerSalesArea;
						if (!customerSalesArea) {
							return false;
						}
						var filtered = false;
						for (var i = 0; i < customerSalesArea.results.length; i++) {
							if (customerSalesArea.results[i].SalesOffice === bpZone) {
								filtered = true;
								if (customerSalesArea.results[i].SalesOrganization == "6000" && customerSalesArea.results[i].DistributionChannel == "10" &&
									customerSalesArea.results[i].SalesGroup != "T99" && customerSalesArea.results[i].Customer !== "2400500000") {
									resBody.sales.push(customerSalesArea.results[i]); //to fetch sales data
								}
							}
						}
						return filtered;
					});
				}
				if (userType === "National") {
					bpResults = bpResults.filter(o => {
						if (!o.to_Customer) {
							return false;
						}
						var customerSalesArea = o.to_Customer.to_CustomerSalesArea;
						if (!customerSalesArea) {
							return false;
						}
						var filtered = false;
						for (var i = 0; i < customerSalesArea.results.length; i++) {
							if ((customerSalesArea.results[i].SalesOffice === "1000" || customerSalesArea.results[i].SalesOffice === "2000" ||
									customerSalesArea.results[i].SalesOffice === "3000" || customerSalesArea.results[i].SalesOffice === "4000" ||
									customerSalesArea.results[i].SalesOffice === "5000" || customerSalesArea.results[i].SalesOffice === "7000" ||
									customerSalesArea.results[i].SalesOffice === "9000" || customerSalesArea.results[i].SalesOffice === "8000") && ((
									customerSalesArea.results[i].SalesOrganization == "6000") && (customerSalesArea.results[i].DistributionChannel == "10" &&
									customerSalesArea.results[i].SalesGroup != "T99"))) {
								filtered = true;
								resBody.sales.push(customerSalesArea.results[i]); //to fetch sales data
							}
						}
						return filtered;
					});
				}

				for (var i = 0; i < bpResults.length; i++) {
					var bpLength = bpResults[i].BusinessPartner.length;
					bpAttributes = {
						BusinessPartnerName: bpResults[i].OrganizationBPName1,
						BusinessPartnerKey: bpResults[i].BusinessPartner,
						BusinessPartner: bpResults[i].BusinessPartner.substring(5, bpLength),
						BusinessPartnerType: bpResults[i].BusinessPartnerType,
						SearchTerm2: bpResults[i].SearchTerm2,
						BPDivision: bpResults[i].to_Customer.Attribute1
					};
					try {
						toCustomerAttr1 = bpResults[i].to_Customer.Attribute1;
					} catch (e) {
						logger.error("The Data is sent without Attribute value for the BP: %s", bpResults[i].BusinessPartner);
					}

					if (userType === "Dealer") {
						if (bpAttributes.BusinessPartner === dealerCode || bpAttributes.SearchTerm2 === dealerCode) {
							resBody.legacyDealer = bpAttributes.BusinessPartner;
							resBody.legacyDealerName = bpAttributes.BusinessPartnerName;
							resBody.attributes.push(bpAttributes);

							// Dealer should only return one BP result anyway, but break here just in case
							break;
						}
					} else {
						resBody.attributes.push(bpAttributes);
					}
				}
				tracer.debug("Response body: %s", JSON.stringify(resBody));
				return res.type("application/json").status(200).send(resBody);
			} else {
				logger.error("Proxied BP call %s FAILED: %s", bpReqUrl, bpErr);
				return res.type("application/json").status(400).send(bpResBody);
			}
		});
	});

	router.get("/currentScopesForUser", (req, res) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/CurrentScopesForUser");
		var tracer = req.loggingContext.getTracer(__filename);
		var xsAppName = xsuaaService.xsappname;
		var scopes = req.authInfo.scopes;
		var userAttributes = req.authInfo.userAttributes;

		tracer.debug("Scopes from JWT: %s", JSON.stringify(scopes));
		tracer.debug("User attributes from JWT: %s", JSON.stringify(userAttributes));

		// If there is no user type, it is most probably a call from Neo, in which case we can fake the data as TCI user
		if (mockUserMode && mockUserOrigin === req.authInfo.origin) {
			tracer.debug("Mock user mode is enabled and JWT is from origin %s, switch to mock user type.", req.authInfo.origin);
			return res.type("application/json").status(200).send(JSON.stringify({
				loggedUserType: ["TCI_User"]
			}));
		}

		var role = "Unknown";
		var approveFleetSoldOrder = false;
		var approvePriceProtection = false;
		var manageFleetSoldOrder = false;
		var manageRetailSoldOrder = false;
		var viewFleetSoldOrder = false;
		var viewPriceProtection = false;
		var viewRetailSoldOrder = false;

		for (var i = 0; i < scopes.length; i++) {
			if (scopes[i] === xsAppName + ".Approve_Fleet_Sold_Order") {
				approveFleetSoldOrder = true;
			} else if (scopes[i] === xsAppName + ".Approve_Price_Protection") {
				approvePriceProtection = true;
			} else if (scopes[i] === xsAppName + ".Manage_Fleet_Sold_Order") {
				manageFleetSoldOrder = true;
			} else if (scopes[i] === xsAppName + ".Manage_Retail_Sold_Order") {
				manageRetailSoldOrder = true;
			} else if (scopes[i] === xsAppName + ".View_Fleet_Sold_Order") {
				viewFleetSoldOrder = true;
			} else if (scopes[i] === xsAppName + ".View_Price_Protection") {
				viewPriceProtection = true;
			} else if (scopes[i] === xsAppName + ".View_Retail_Sold_Order") {
				viewRetailSoldOrder = true;
			} else {
				tracer.warning("Unrecognized scope: %s", scopes[i]);
			}
		}

		var scopeLogMessage = "approveFleetSoldOrder: " + approveFleetSoldOrder + "\n";
		scopeLogMessage += "approvePriceProtection: " + approvePriceProtection + "\n";
		scopeLogMessage += "manageFleetSoldOrder: " + manageFleetSoldOrder + "\n";
		scopeLogMessage += "manageRetailSoldOrder: " + manageRetailSoldOrder + "\n";
		scopeLogMessage += "viewFleetSoldOrder: " + viewFleetSoldOrder + "\n";
		scopeLogMessage += "viewPriceProtection: " + viewPriceProtection + "\n";
		scopeLogMessage += "viewRetailSoldOrder: " + viewRetailSoldOrder + "\n";
		tracer.debug(scopeLogMessage);

		if (!approveFleetSoldOrder && !approvePriceProtection && manageFleetSoldOrder && manageRetailSoldOrder && !viewFleetSoldOrder &&
			viewPriceProtection &&
			!viewRetailSoldOrder) {
			role = "Dealer_User";
		} else if (approveFleetSoldOrder && approvePriceProtection && !manageFleetSoldOrder && !manageRetailSoldOrder && viewFleetSoldOrder &&
			viewPriceProtection &&
			viewRetailSoldOrder) {
			role = userAttributes.National ? "National_Fleet_User" : "TCI_User";
		
		}else if (approveFleetSoldOrder && !approvePriceProtection && !manageFleetSoldOrder && !manageRetailSoldOrder && viewFleetSoldOrder &&
			viewPriceProtection &&
			viewRetailSoldOrder) {
			role = "TCI_Zone_User";
		}
		tracer.debug("role: %s", role);

		return res.type("application/json").status(200).send(JSON.stringify({
			loggedUserType: [
				role
			]
		}));
	});

	router.get("/fleetCustomers", (req, res) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/FleetCustomers");
		var tracer = req.loggingContext.getTracer(__filename);

		var resBody = {
			"attributes": []
		};

		var bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json" +
			"&$expand=to_Customer&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z002') " +
			"and zstatus ne 'X'&$orderby=BusinessPartner asc &$select=BusinessPartner,OrganizationBPName1,SearchTerm2,to_Customer/CustomerAccountGroup";

		tracer.debug("BP URL: %s", bpReqUrl);
		var bpReqHeaders = {
			"APIKey": APIKey,
			"Authorization": "Basic " + new Buffer(s4User + ":" + s4Password).toString("base64"),
			"Content-Type": "application/json"
		};
		request({
			url: bpReqUrl,
			headers: bpReqHeaders
		}, function (bpErr, bpRes, bpResBodyStr) {
			var toCustomerAttr1 = null;
			var bpAttributes = null;

			tracer.debug("Response body from proxied BP call: %s", bpResBodyStr);

			if (!bpErr && bpRes.statusCode === 200) {
				var bpResBody = JSON.parse(bpResBodyStr);
				var bpResults = bpResBody.d.results;

				bpResults = bpResults.filter(o => {
					return (o.to_Customer && o.to_Customer.CustomerAccountGroup === "Z007");
				});

				for (var i = 0; i < bpResults.length; i++) {
					bpAttributes = {
						BusinessPartnerName: bpResults[i].OrganizationBPName1,
						BusinessPartnerKey: bpResults[i].BusinessPartner,
						SearchTerm2: bpResults[i].SearchTerm2
					};
					resBody.attributes.push(bpAttributes);
				}
				tracer.debug("Response body: %s", JSON.stringify(resBody));
				return res.type("application/json").status(200).send(resBody);
			} else {
				logger.error("Proxied BP call %s FAILED: %s", bpReqUrl, bpErr);
				return res.type("application/json").status(400).send(bpResBody);
			}
		});
	});

	return router;
};