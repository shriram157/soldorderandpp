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
			console.log(isLocaleSent);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			console.log(sSelectedLocale);
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr"||sSelectedLocale == "fr/") {
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

		},

		/*bindData:function(){
			console.log("entered bind");
			var port="https://sapui5.netweaver.ondemand.com";
		var url=port+"/sdk/test-resources/sap/ui/demokit/explored/products.json";
		
		var oDataModel=new sap.ui.model.odata.v2.ODataModel(url,true);
		var oJsonModel=new	sap.ui.model.json.JSONModel();
		oDataModel.read("/",null, null,true, function(oData,response){
			oJsonModel.setData(oData);
			console.log(oData);
		});
		sap.ui.getCore().setModel(oJsonModel);
		},*/

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				basCont.getRouter().navTo("view1", {}, true); // has the value true and makes sure that the
				//	hash is replaced /*no history
			}
		}

	});
});