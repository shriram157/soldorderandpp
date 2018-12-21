sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var validateFlagA = false;
	var RSOA_controller;
	
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderA", {
		formatter: formatter,
		
		onInit: function () {
			RSOA_controller=this;
			RSOA_controller.getBrowserLanguage();
			var today = new Date();
			var day1 = new Date();
			day1.setDate(today.getDate() + 1);
			RSOA_controller.getView().byId("etaFrom_RSOA").setMinDate(day1);
		},
		
		_handleService: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				RSOA_controller.sPrefix = "/soldorder_node";
			} else {
				RSOA_controller.sPrefix = "";
			}
			RSOA_controller.nodeJsUrl = RSOA_controller.sPrefix + "/node";
			$.ajax({
				url: RSOA_controller.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing", //?sap-client=200&$format=json",
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oTable = PPD_DealerCont.getView().byId("table_PPD_Dealer");
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					oTable.setModel(oModel);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			/*var oToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			var oHeaders = {
				"x-csrf-token": oToken,
			};*/

			var data = [];
			var payLoad = {
				//ModelYear:
				ZZMOYR: RSOA_controller.getView().byId("modelYr_RSOA").getValue(),
				//Model:
				ZZMODEL: RSOA_controller.getView().byId("model_RSOA").getValue(),
				//Suffix:
				ZZSUFFIX: RSOA_controller.getView().byId("Suffix_RSOA").getValue(),
				//Colour:
				ZZEXTCOL: RSOA_controller.getView().byId("Colour_RSOA").getValue(),
				//RequestedETAFrom:
				ZZREQ_ETA_FROM: RSOA_controller.getView().byId("etaFrom_RSOA").getValue(),
				//RequestedETATO:
				ZZREQ_ETA_TO: RSOA_controller.getView().byId("etaTo_RSOA").getValue(),
			};
			data.push(payLoad);
			$.ajax({
				type: 'POST',
				url: oURL,
				//headers: oHeaders,
				cache: false,
				//contentType: ["csv"],
				//processData: false,
				data: data,
				success: function (data) {
					//console.log(data);
				},
				error: function (data) {
					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}

			})
		},
		
		_handleChange: function () {
			var etaFrom = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				RSOA_controller.getView().byId("etaTo_RSOA").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		
		onValidateCustomer: function () {
			var errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText("error1");
			var title = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText("title5");
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
			RSOA_controller.getView().byId("modelYr_RSOA").setModel(modelYearModel);
		},
		
		_onSubmit: function () {
			var flag1 = false;
			var flag2 = false;
			var errMsg2;
			var errMsg;
			var valModelYr = RSOA_controller.getView().byId("modelYr_RSOA").getValue();
			var valSuffix = RSOA_controller.getView().byId("Suffix_RSOA").getValue();
			var valSeries = RSOA_controller.getView().byId("series_RSOA").getValue();
			//	var valModelCode = RSOA_controller.getView().byId("modelCode_RSOA").getValue();
			var valCustName = RSOA_controller.getView().byId("CustName_RSOA").getValue();
			var valETATo = RSOA_controller.getView().byId("etaTo_RSOA").getValue();
			var valETAFrom = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			var valColour = RSOA_controller.getView().byId("Colour_RSOA").getValue();
			var valModel = RSOA_controller.getView().byId("model_RSOA").getValue();
			var valApx = RSOA_controller.getView().byId("Apx_RSOA").getValue();
			var valSalesType = RSOA_controller.getView().byId("SalesType_RSOA").getValue();
			var valContractDate = RSOA_controller.getView().byId("ContractDate_RSOA").getValue();
			var valAddress = RSOA_controller.getView().byId("Address_RSOA").getValue();
			var valCity = RSOA_controller.getView().byId("City_RSOA").getValue();
			var valProvince = RSOA_controller.getView().byId("Province_RSOA").getValue();
			var valPostalCode = RSOA_controller.getView().byId("PostalCode_RSOA").getValue();
			var valLicense = RSOA_controller.getView().byId("License_RSOA").getValue();

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
				errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		},
	
		onAfterRendering: function () {
			RSOA_controller.listOfModelYear();
		}

	});

});