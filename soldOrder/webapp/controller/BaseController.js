sap.ui.define([
	"sap/ui/core/mvc/Controller",

	"sap/ui/model/resource/ResourceModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, ResourceModel, History, JSONModel) {
	"use strict";
	var basCont, sDiv;
	return Controller.extend("toyota.ca.SoldOrder.controller.BaseController", {

		onInit: function () {
			basCont = this;
			var r = basCont.getRouter();
			r.attachBypassed(function (evt) {
				var hash = evt.getParameter('hash');
				jQuery.sap.log.info("sorry invalid hash " + hash + ". Try valid hash");

			});
			r.attachRouteMatched(function (evt) {
				var name = evt.getParameter('name');
				jQuery.sap.log.info("Route name is : " + name);
			});
			// this.getDealer();
		},

		host: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			return this.nodeJsUrl;
		},

		appDivision: function () {
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			var div = "";
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				if (this.sDivision == '10') 
				{
					div = "TOY";
				} else { 
					div = "LEX";
				}
			}
			return div;
		},

		handleBaseLinkPress: function (oEvent) {
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			// this.getDealer();
			var oGetText = oEvent.getSource().getText();
			if (oGetText === this.oBundle.getText("menu1")) {
				this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true); //page 1
			} else if (oGetText === this.oBundle.getText("menu2")) {
				this.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary"); //page 10
			} else if (oGetText === this.oBundle.getText("menu3")) {
				this.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder"); //page 11
			} else if (oGetText === this.oBundle.getText("menu4")) { //dicey sol, check it again 
				this.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary");
			} else if (oGetText === this.oBundle.getText("menu5")) {
				this.getOwnerComponent().getRouter().navTo("FleetSoldOrderDetails"); //page 16
			} else if (oGetText === this.oBundle.getText("menu9")) {
				this.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer"); //page 16
			} else if (oGetText === this.oBundle.getText("menu11")) {
				this.getOwnerComponent().getRouter().navTo("CapSoldOrder"); //page 16
			} else if (oGetText === this.oBundle.getText("menu7")) {
				this.getOwnerComponent().getRouter().navTo("RetailSoldOrderB", {
					modelyear: '2018',
					modelkey: 'YZ3DCT',
					serieskey: 'SIE',
					suffixkey: 'BB',
					apxkey: '00',
					colorkey: '0070',
					vtnn: '1234',
					fromdate: '20181212',
					todate: '20181224'
				}, true); //page 2
			}
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(basCont);
		},
		notfound: function () {
			basCont.getRouter().getTargets().display("notFound", { //go to not found
				fromTarget: "RetailSoldOrderA" //go to view 1 from not found 
			});
		},

		getBrowserLanguage: function () {
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			////console.log(isLocaleSent);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			var i18nModel;
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/") {
				this.sCurrentLocale = 'FR';
				i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr"),
					Lang: this.sCurrentLocale
				});
				this.getView().setModel(i18nModel, "i18n");
				sap.ui.getCore().setModel(i18nModel, "i18n");

			} else {
				this.sCurrentLocale = 'EN';
				i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en"),
					Lang: this.sCurrentLocale
				});
				this.getView().setModel(i18nModel, "i18n");
				sap.ui.getCore().setModel(i18nModel, "i18n");
			}
		},
		returnBrowserLanguage: function () {
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			//console.log(isLocaleSent);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			//console.log(sSelectedLocale);
			//selected language. 
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/" || sSelectedLocale == "FR" || sSelectedLocale == "FR/") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
			return this.sCurrentLocale;
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			//console.log(oHistory);
			sPreviousHash = oHistory.getPreviousHash();
			//console.log(sPreviousHash);
			//console.log(window.history);
			if (sPreviousHash !== undefined) {
				if (sPreviousHash == "page11") {
					this.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder"); //page 11

				} else {
					window.history.go(-1);
				}
			} else {
				basCont.getRouter().navTo("RetailSoldOrderA", {}, true); // has the value true and makes sure that the
				//	hash is replaced /*no history
			}
		},
		getDealer: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			var sPrefix;
			if (sLocation_conf == 0) {
				sPrefix = "/soldorder_node";
				this.attributeUrl = "/userDetails/attributes";
				// this.attributeUrl = "/userDetails/attributesforlocaltesting";
			} else {
				sPrefix = "";
				this.attributeUrl = "/userDetails/attributes";
			}

			//======================================================================================================================//			
			//  on init method,  get the token attributes and authentication details to the UI from node layer.  - begin
			//======================================================================================================================//		

			var that = this;
			$.ajax({
				url: sPrefix + "/userDetails/currentScopesForUser",
				type: "GET",
				dataType: "json",
				async: false,
				success: function (oData) {
					var LoginUserModel = new sap.ui.model.json.JSONModel();
					sap.ui.getCore().setModel(LoginUserModel, "LoginUserModel");

					// oData.loggedUserType[0] = "TCI_Zone_User"; //for local testing, comment while deploying
					var userType = oData.loggedUserType[0];
					// //console.log("logged in user dealer");
					that.getView().getModel("LoginUserModel").setSizeLimit(750);
					sap.ui.getCore().getModel("LoginUserModel").setSizeLimit(750);
					that.getView().getModel("LoginUserModel").setProperty("/UserType", oData.loggedUserType[0]);
					sap.ui.getCore().getModel("LoginUserModel").setProperty("/UserType", oData.loggedUserType[0]);
					sap.ui.getCore().getModel("LoginUserModel").updateBindings(true);
					switch (userType) {
					case "Dealer_Parts_Admin":
						// //console.log("Dealer Parts");
						break;
					case "Dealer_Services_Admin":
						// //console.log("Dealer_Services_Admin");
						break;
					case "Dealer_User":
						// //console.log("Dealer_User");
						break;
					case "TCI_Admin":
						// //console.log("TCI_Admin");
						break;
					case "TCI_User":
						// //console.log("TCI_User");
						break;
					case "Zone_User":
						// //console.log("Zone_User");
						break;
					default:
						// raise a message, because this should not be allowed. 
						// //console.log("Dealer_User");

					}
				}
			});

			// get the attributes and BP Details  Copyied from Minkashi 
			var that = this;
			$.ajax({
				url: sPrefix + this.attributeUrl,
				type: "GET",
				dataType: "json",
				async: false,
				success: function (oData) {
					//console.log("initial BP load", oData);
					/*	var SignatureModel = new sap.ui.model.json.JSONModel();
						SignatureModel.setData(oData);
						sap.ui.getCore().setModel(SignatureModel, "SignatureModel");*/
					var Signaturetype = oData.userProfile.id;
					var BpDealerArr = [],
						BpDealer = [];
					//var signature;
					var userAttributes = [];
					var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
					if (isDivisionSent) {
						sDiv = window.location.search.match(/Division=([^&]*)/i)[1];
					}
					if (sDiv == "10") {
						this.Div = "01";
					} else if (sDiv == "20") {
						this.Div = "02";
					}
					$.each(oData.attributes, function (i, item) {
						var BpLength = item.BusinessPartner.length;
						//console.log("Div", that.Div);
						if (item.BPDivision == "03" && sDiv == "10") {
							item.BPDivision = "01";
						} else if (item.BPDivision == "03" && sDiv == "20") {
							item.BPDivision = "02";
						}
						if (item.BPDivision == that.Div) {
							BpDealerArr.push({
								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
								"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
								"BPDivision": item.BPDivision,
								"BusinessPartnerType": item.BusinessPartnerType,
								"searchTermReceivedDealerName": item.SearchTerm2
							});
						}
					});
					if (oData.samlAttributes.UserType[0] == "Dealer") {
						BpDealer = BpDealerArr;
					} else {
						var aBusinessPartnerKey = oData.sales.reduce(function (obj, hash) {
							obj[hash.Customer] = true;
							return obj;
						}, {});
						for (var i = 0; i < BpDealerArr.length; i++) {
							if (aBusinessPartnerKey[BpDealerArr[i].BusinessPartnerKey]) {
								BpDealer.push(BpDealerArr[i]);
							}
						}
					}
					//console.log("BpDealer", BpDealer);
					that.getView().getModel("LoginUserModel").setSizeLimit(750);
					sap.ui.getCore().getModel("LoginUserModel").setSizeLimit(750);

					that.getView().getModel("LoginUserModel").setProperty("/Signaturetype", Signaturetype);
					sap.ui.getCore().getModel("LoginUserModel").setProperty("/Signaturetype", Signaturetype);
					that.getView().getModel("LoginUserModel").setProperty("/BpDealerModel", BpDealer);
					sap.ui.getCore().getModel("LoginUserModel").setProperty("/BpDealerModel", BpDealer);
					sap.ui.getCore().getModel("LoginUserModel").updateBindings(true);
				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			}).done(function (data, textStatus, jqXHR) {
				that.getView().getModel("LoginUserModel").setProperty("/BPDealerDetails", data.attributes[0]);
				sap.ui.getCore().getModel("LoginUserModel").setProperty("/BPDealerDetails", data.attributes[0]);
			});
		},
	});
});