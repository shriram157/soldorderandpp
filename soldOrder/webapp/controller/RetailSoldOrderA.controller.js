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
			RSOA_controller = this;
			RSOA_controller.getBrowserLanguage();
			var today = new Date();
			var day1 = new Date();
			day1.setDate(today.getDate() + 1);
			RSOA_controller.getView().byId("etaFrom_RSOA").setMinDate(day1);
			RSOA_controller._newService1();
			RSOA_controller._newService2();
			RSOA_controller._newService3();
			RSOA_controller._handleServiceModel_ModelYear();
			RSOA_controller._handleServiceSuffix_Series();
			RSOA_controller._handleRSADropDown();
		},

		//1) Model Code , Model Description :-    Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL ENModelDesc  Model: "BF38KT"

		//2) Suffix  and  Suffix Description : Z_VEHICLE_CATALOGUE_SRV/zc_configuration SuffixDescriptionEN, Suffix
		//     Interior Colour Description     :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  TrimInteriorColor    

		//3)Color Code , Colour Description :  :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  ExteriorColorCode: "0218"ExteriorDescriptionEN: "BLACK"

		_newService1: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_configuration?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					console.log("Result from zc_configuration");
					console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					RSOA_controller.getView().setModel(oModel, "oModel1");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_newService2: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					console.log("Result from zc_exterior_trim");
					console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					RSOA_controller.getView().setModel(oModel, "oModel2");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_newService3: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					console.log("Result from ZC_BRAND_MODEL_DETAIL");
					console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					//	RSOA_controller.getView().byId("model_RSOA").setSizeLimit(oModel.getData().length);
					RSOA_controller.getView().setModel(oModel, "oModel3");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_handleRSADropDown: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_PIO_DIO?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					console.log("Result from ZC_PIO_DIO");
					console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					RSOA_controller.getView().setModel(oModel, "mode_Model");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		_handleServiceModel_ModelYear: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_myear?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					console.log("Result from zc_mc_year");
					console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();

					var arr = [];
					var j = 0;
					for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["ModelYear"], arr) < 0) {
								arr[j] = data.d.results[i]["ModelYear"];
								j++;

							}
						}
					}

					oModel.setData(arr);
					RSOA_controller.getView().setModel(oModel, "modelYear_Model");
					RSOA_controller.getView().getModel("modelYear_Model");
					console.log(RSOA_controller.getView().getModel("modelYear_Model").getData());

					var oModel2 = new sap.ui.model.json.JSONModel();

					var arr2 = [''];
					var k = 0;
					for (var q = 0; q < data.d.results.length; q++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["Model"], arr2) < 0) {
								arr2[k] = data.d.results[i]["Model"];
								k++;
							}
						}
					}
					console.log(arr2);
					oModel2.setData(arr2);
					RSOA_controller.getView().setModel(oModel2, "model_Model");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_handleServiceSuffix_Series: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_MODEL_DETAILS?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

					console.log("Result from ZC_MODEL_DETAILS ");
					console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();

					var arr = [];
					var j = 0;
					for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["TCISeries"], arr) < 0) {
								arr[j] = data.d.results[i]["TCISeries"];
								j++;

							}
						}
					}

					oModel.setData(arr);
					RSOA_controller.getView().setModel(oModel, "seriesModel");
					console.log(RSOA_controller.getView().getModel("seriesModel").getData());

					var oModel2 = new sap.ui.model.json.JSONModel();

					var arr2 = [''];
					var k = 0;
					for (var q = 0; q < data.d.results.length; q++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["suffix"], arr2) < 0) {
								arr2[k] = data.d.results[i]["suffix"];
								k++;
							}
						}
					}
					console.log(arr2);
					oModel2.setData(arr2);
					RSOA_controller.getView().setModel(oModel2, "suffix_Model");

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

			/*	
				Zzmoyr= RSOA_controller.getView().byId("modelYr_RSOA").getValue();
				Zzmodel= RSOA_controller.getView().byId("model_RSOA").getValue();
				Zzsuffix= RSOA_controller.getView().byId("Suffix_RSOA").getValue();
				Zzextcol= RSOA_controller.getView().byId("Colour_RSOA").getValue();
				Zzapx=RSOA_controller.getView().byId("Apx_RSOA").getValue();
				ZzreqEtaFrom:= RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
				ZzreqEtaTo= RSOA_controller.getView().byId("etaTo_RSOA").getValue();
			};*/

		},

		submitSO: function () {
			var Zzmoyr = RSOA_controller.getView().byId("modelYr_RSOA").getValue();
			var Zzmodel = RSOA_controller.getView().byId("model_RSOA").getValue();
			var Zzsuffix = RSOA_controller.getView().byId("Suffix_RSOA").getValue();
			var Zzextcol = RSOA_controller.getView().byId("Colour_RSOA").getValue();
			var Zzapx = RSOA_controller.getView().byId("Apx_RSOA").getValue();
			var ZzreqEtaFrom1 = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			console.log(ZzreqEtaFrom1);
			console.log(RSOA_controller.getView().byId("etaFrom_RSOA").getDateValue());
			var ZzreqEtaFrom2 = Date.now(ZzreqEtaFrom1);
			var ZzreqEtaFrom = "Date(" + ZzreqEtaFrom2 + ")";
			var ZzreqEtaTo1 = RSOA_controller.getView().byId("etaTo_RSOA").getValue();
			var ZzreqEtaTo2 = Date.now(ZzreqEtaTo1);
			var ZzreqEtaTo = "Date(" + ZzreqEtaTo2 + ")";
			var ZcontractDate1 = RSOA_controller.getView().byId("ContractDate_RSOA").getValue();
			var ZcontractDate2 = Date.now(ZcontractDate1);
			var ZcontractDate = "Date(" + ZcontractDate2 + ")";
			var ZsalesType = RSOA_controller.getView().byId("SalesType_RSOA").getValue();
			var ZtcciNum = RSOA_controller.getView().byId("tcciNo_RSOA").getValue();
			var Zsalesperson = RSOA_controller.getView().byId("salesperson_RSOA").getValue();
			var Zsalesmanager = RSOA_controller.getView().byId("salesMan_RSOA").getValue();
			var ZtradeModelYr = RSOA_controller.getView().byId("trademodelYear_RSOAid").getValue();
			var ZtradeMake = RSOA_controller.getView().byId("tradeInMakeYear_RSOAid").getValue();
			var host = RSOA_controller.host();
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/SOcreateSet";
			var d = {
				"ZzsoReqNo": "",
				"Zzmodel": "YZ3DCT",
				"Zzmoyr": "2018",
				"Zzsuffix": "ML",
				"Zzextcol": "01D6",
				"Zzapx": "00",
				"ZzreqEtaFrom": "20190102",
				"ZzreqEtaTo": "20180304",
				"ZcontractDate": "20180304",
				"ZsalesType": "",
				"ZtcciNum": "",
				"Zsalesperson": "",
				"Zsalesmanager": "",
				"ZtradeModelYr": "",
				"ZtradeMake": ""
					/*"ZzsoReqNo": "",
					"Zzmodel": Zzmodel, //"YZ3DCT",
					"Zzmoyr": Zzmoyr, //"2018",
					"Zzsuffix": Zzsuffix, //"ML",
					"Zzextcol": Zzextcol, //"01D6",
					"Zzapx": Zzapx, // "00",
					"ZzreqEtaFrom": ZzreqEtaFrom1, //null,
					"ZzreqEtaTo": ZzreqEtaTo1, //null,
					"ZcontractDate": ZcontractDate1, //null,
					"ZsalesType":ZsalesType, // "",
					"ZtcciNum":ZtcciNum,// "",
					"Zsalesperson":Zsalesperson,// "",
					"Zsalesmanager": Zsalesmanager, //"",
					"ZtradeModelYr":ZtradeModelYr,// "",
					"ZtradeMake":ZtradeMake, */ // ""
			};
			var dataString = JSON.stringify({
				d
			});

			$.ajax({
				type: 'POST',
				url: oURL,
				cache: false,
				data: dataString,
				dataType: 'json',
				success: function (data) {
					console.log(data);
				
					//	RSOA_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder"); //page 3
				},
				error: function (data) {
					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}

			});
		},

		_handleToDateChange: function () {
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
			RSOA_controller.getView().byId("modelYr_RSOA").setModel(modelYearModel, "codedModel");
		},

		_onSubmit: function () {
			RSOA_controller.submitSO();
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
			} else if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				//	RSOA_controller.submitSO();

			}
		},

		onAfterRendering: function () {
			RSOA_controller.listOfModelYear();
		}

	});

});