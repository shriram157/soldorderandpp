sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderA", {
		formatter: formatter,
		onInit: function () {
			this.getBrowserLanguage();

			var today = new Date();
			var day1 = new Date();
			day1.setDate(today.getDate() + 1);
			this.getView().byId("etaFrom_RSOA").setMinDate(day1);

		/*	var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");
			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
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
			}*/

			/*	var sLocation = window.location.host;
				console.log(sLocation);
				var sLocation_conf = sLocation.search("webide");
				console.log(sLocation_conf);
				if (sLocation_conf == 0) {
					this.sPrefix = "/soldOrder_node";
				} else {
					this.sPrefix = "";
				}
				this.nodeJsUrl = this.sPrefix + "/node";
				console.log(this.nodeJsUrl);
				$.ajax({
					url: this.sPrefix + "/userDetails/attributes",
					//url: getUrlTable_Driver,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
					//	console.log("safety manager service getting called");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						//console.log("safety manager ERROR service getting called");
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});*/
		},
		_handleChange: function () {
			var etaFrom = this.getView().byId("etaFrom_RSOA").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				this.getView().byId("etaTo_RSOA").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		onValidateCustomer: function () {
			var errMsg = this.getView().getModel("i18n").getResourceBundle().getText("error1");
			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Customer Conformation", sap.m.MessageBox.Action.OK, null, null);
		},
		listOfModelYear: function () {
			//	var omodelYearModel;
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var previousModelYear = currentModelYear - 1;
			var nextModelYear = currentModelYear + 1;

			var data = {
				"modelYear": [{
					"key": "1",
					"text": previousModelYear
				}, {
					"key": "2",
					"text": currentModelYear
				}, {
					"key": "3",
					"text": nextModelYear
				}]
			};
			var modelYearModel = new JSONModel(); //this.getOwnerComponent().getModel('modelYearModel');
			modelYearModel.setData(data);
			//	sap.ui.getCore().setModel(modelYearModel,"omodelYearModel");
			this.getView().byId("modelYrId").setModel(modelYearModel);
			//	console.log(modelYearModel);
			//	this.getView().setModel(modelYearModel);
			//	this.getView().getModel().updateBindings(true);
		},

		//	onBeforeRendering: function() {
		//
		//	},

		onAfterRendering: function () {
			this.listOfModelYear();
		}

		//	onExit: function() {
		//
		//	}

	});

});