sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var validateFlagA = false;
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
					url: this.sPrefix + "/zprice_protection_srv/zc_campaign_pricing",
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
			var title = this.getView().getModel("i18n").getResourceBundle().getText("title5");
			var icon = new sap.ui.core.Icon({
				src: "sap-icon://alert",
				size: "2rem"
			});
			var msg = new sap.m.HBox({
				items: [icon, new sap.m.Text({
					text: errMsg
				})]
			});

			sap.m.MessageBox.show(msg, {
				//	icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: sap.m.MessageBox.Action.OK,
				onClose: null,
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
			validateFlagA = true;
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
			var modelYearModel = new JSONModel();
			modelYearModel.setData(data);
			this.getView().byId("modelYr_RSOA").setModel(modelYearModel);
		},
		_onSubmit: function () {
			var flag1 = false;
			var flag2 = false;
			var errMsg2;
			var errMsg;
			var valModelYr = this.getView().byId("modelYr_RSOA").getValue();
			var valSuffix = this.getView().byId("Suffix_RSOA").getValue();
			var valSeries = this.getView().byId("series_RSOA").getValue();
			//	var valModelCode = this.getView().byId("modelCode_RSOA").getValue();
			var valCustName = this.getView().byId("CustName_RSOA").getValue();
			var valETATo = this.getView().byId("etaTo_RSOA").getValue();
			var valETAFrom = this.getView().byId("etaFrom_RSOA").getValue();
			var valColour = this.getView().byId("Colour_RSOA").getValue();
			var valModel = this.getView().byId("model_RSOA").getValue();
			var valApx = this.getView().byId("Apx_RSOA").getValue();
			var valSalesType = this.getView().byId("SalesType_RSOA").getValue();
			var valContractDate = this.getView().byId("ContractDate_RSOA").getValue();
			var valAddress = this.getView().byId("Address_RSOA").getValue();
			var valCity = this.getView().byId("City_RSOA").getValue();
			var valProvince = this.getView().byId("Province_RSOA").getValue();
			var valPostalCode = this.getView().byId("PostalCode_RSOA").getValue();
			var valLicense = this.getView().byId("License_RSOA").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valCustName == "" || valETATo == "" || valETAFrom == "" || valColour ==
				"" || valModel == "" || valApx == "" || valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valLicense == "") {
				flag1 = true;
			}
			if (validateFlagA == false) {
				flag2 = true;
			}

			if (flag1 == true && flag2 == false) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = this.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = this.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
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