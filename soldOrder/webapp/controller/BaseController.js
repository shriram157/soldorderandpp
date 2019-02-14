sap.ui.define([
	"sap/ui/core/mvc/Controller",
	/*"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/oDataModel",*/
	"/sap/ui/model/resource/ResourceModel",
	"sap/ui/core/routing/History"
], function (Controller, ResourceModel, History) {
	"use strict";
	var basCont;
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

		handleBaseLinkPress: function (oEvent) {
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oGetText = oEvent.getSource().getText();
			if (oGetText === this.oBundle.getText("menu1")) {
				this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true); //page 1
			} else if (oGetText === this.oBundle.getText("menu2")) {
				this.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary"); //page 10
			} else if (oGetText === this.oBundle.getText("menu3")) {
				this.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder"); //page 11
			} else if (oGetText === this.oBundle.getText("menu4")) { //dicey sol, check it again 
				this.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary");
			}
			//REquired More Clarification 
			//---------------------------------------------------------------------
			// else if (oGetText === this.oBundle.getText("menu4")) { //dicey sol, check it again 
			// 	//this.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary");
			// 	if (this.requestStatus == "Pending Fulfilment") {
			// 		this.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ZoneApproval"); //page 13
			// 	} else if (this.requestStatus == "Approved") { //processed
			// 		this.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView"); // page 14
			// 	} else {
			// 		this.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary"); //page 15 
			// 	}
			// } 
			// else if (oGetText === this.oBundle.getText("menu5")) {
			// 	this.getOwnerComponent().getRouter().navTo("FleetSoldOrderDetails"); //page 16
			// } 
			// else if (oGetText === this.oBundle.getText("menu6")) {
			// 	this.getOwnerComponent().getRouter().navTo("FleetSoldOrderDetails"); //page 16
			// }
			else if (oGetText === this.oBundle.getText("menu7")) {
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
			// else if (oGetText === this.oBundle.getText("menu8")) {
			// 	this.getOwnerComponent().getRouter().navTo("NationalFleetSoldOrderView"); //page 19
			// }

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
			//console.log(isLocaleSent);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			//console.log(sSelectedLocale);
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/") {
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
		},
		/*var i18nModel;
		var sLocale;
		var oI18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: "i18n/i18n.properties"
		});
		this.getView().setModel(oI18nModel, "i18n");*/
		// sLocale = sap.ui.getCore().getConfiguration().getLanguage();
		// if (sLocale=="en"||sLocale=="en-US"){
		// 	i18nModel = new ResourceModel({
		// 	bundleName: "toyota.ca.SoldOrder.i18n.i18n_en"	
		// });
		// this.getView().setModel(i18nModel, "i18n");
		// }
		// else if (sLocale=="de"){
		// 	i18nModel = new ResourceModel({
		// 	bundleName: "toyota.ca.SoldOrder.i18n.i18n_de"	
		// });
		// this.getView().setModel(i18nModel, "i18n");
		// }
		// else{
		// 		i18nModel = new ResourceModel({
		// 	bundleName: "toyota.ca.SoldOrder.i18n.i18n_en"	
		// });
		// this.getView().setModel(i18nModel, "i18n");
		// }

		// console.log(window.location.search);
		// 	var currentImageSource = this.getView().byId("idLexusLogo");
		// 	if (window.location.search == "?language=fr") {

		// 	 i18nModel = new sap.ui.model.resource.ResourceModel({
		// 		bundleUrl: "i18n/i18n_fr.properties",
		// 		bundleLocale: ("fr")

		// 	});
		// 	this.getView().setModel(i18nModel, "i18n");
		// 	this.sCurrentLocale = 'FR';
		// 	// set the right image for logo	 - french		

		// 	currentImageSource.setProperty("src", "images/Lexus_FR.png");

		// } else {
		// 	 i18nModel = new sap.ui.model.resource.ResourceModel({
		// 		bundleUrl: "i18n/i18n_en.properties",
		// 		bundleLocale: ("en")

		// 	});
		// 	this.getView().setModel(i18nModel, "i18n");
		// 	this.sCurrentLocale = 'EN';
		// 	// set the right image for logo			
		// //	var currentImageSource = this.getView().byId("idLexusLogo");
		// 	currentImageSource.setProperty("src", "images/Lexus_EN.png");

		// }

		// var oModeli18n = this.getView().getModel("i18n");
		// this._oResourceBundle = oModeli18n.getResourceBundle();
		// console.log(this._oResourceBundle);

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			console.log(oHistory);
			sPreviousHash = oHistory.getPreviousHash();
			console.log(sPreviousHash);
			console.log(window.history);
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				basCont.getRouter().navTo("RetailSoldOrderA", {}, true); // has the value true and makes sure that the
				//	hash is replaced /*no history
			}
		}

	});
});