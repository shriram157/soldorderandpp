sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var validateFlagA = false;
	var RSOA_controller, Zcustomer_No, input_ref;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderA", {
		formatter: formatter,

		onInit: function () {
			RSOA_controller = this;
			AppController.RSOA="true";
			// RSOA_controller.getBrowserLanguage();
			// var language = RSOA_controller.returnBrowserLanguage();
			RSOA_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);

			var salesTypeModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if (language == "EN") {
				Obj = {
					"SalesType": [{
						"key": "1",
						"text": "CASH"
					}, {
						"key": "2",
						"text": "LEASE"
					}, {
						"key": "3",
						"text": "FINANCE"
					}],
				};
			} else {
				Obj = {

					"SalesType": [{
						"key": "1",
						"text": "ENCAISSER"
					}, {
						"key": "2",
						"text": "BAIL"
					}, {
						"key": "3",
						"text": "LA FINANCE"
					}],

				};
			}

			salesTypeModel.setData(Obj);
			salesTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(salesTypeModel, "salesTypeModel");
			this.getView().setModel(sap.ui.getCore().getModel("salesTypeModel"), "salesTypeModel");
			console.log(sap.ui.getCore().getModel("salesTypeModel"));
			// var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			// 	pattern: "yyyy-MM-ddTHH:mm:ss"
			// });
			// var today = new Date();
			// var day1 = new Date();
			var num = 0;
			var endDate = new Date();
			var day5 = new Date();
			// day1.setDate(today.getDate()); //+ 1
			// var cDate = zdateFormat.parse(day1);
			while (num < 5) {
				endDate = new Date(day5.setDate(day5.getDate() + 1));
				if (endDate.getDay() != 0 && endDate.getDay() != 6) {
					//Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
					num++;
				}
			}
			var todayDate = new Date();
			RSOA_controller.getView().byId("etaFrom_RSOA").setMinDate(day5);
			RSOA_controller.getView().byId("ContractDate_RSOA").setMaxDate(todayDate);

			// RSOA_controller._newService1();
			// RSOA_controller._newService2();
			// RSOA_controller._newService3();
			// RSOA_controller._handleServiceModel_ModelYear();
			// RSOA_controller._handleServiceSuffix_Series();
			// RSOA_controller._handleRSADropDown();
			// this.getDealer();
			this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this._onObjectMatched, this);
			var model = new JSONModel({});
			var seriesCB = RSOA_controller.getView().byId("series_RSOA");
			RSOA_controller.getView().setModel(model, 'Customer');
			var host = RSOA_controller.host();
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			var brand;
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					brand = "TOY";

				} else { // set the lexus logo
					brand = "LEX";

					// }
				}
			}
			var url = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					if (seriesCB.getValue() !== "") {
						//seriesCB.setValue(" ");
						seriesCB.setSelectedKey(null);
					}
					//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					RSOA_controller.getView().setModel(oModel, "seriesModel");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_onObjectMatched: function (oEvent) {
			validateFlagA = false;
			var submitBtn = RSOA_controller.getView().byId("Btn_submit_RSOA")
			if (validateFlagA == true) {
				submitBtn.setEnabled(true);
			} else {
				submitBtn.setEnabled(false);
			}
			this.getView().byId("idmenu1").setType('Emphasized');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Transparent');

		},
		//1) Model Code , Model Description :-    Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL ENModelDesc  Model: "BF38KT"

		//2) Suffix  and  Suffix Description : Z_VEHICLE_CATALOGUE_SRV/zc_configuration SuffixDescriptionEN, Suffix
		//     Interior Colour Description     :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  TrimInteriorColor    

		//3)Color Code , Colour Description :  :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  ExteriorColorCode: "0218"ExteriorDescriptionEN: "BLACK"
		_newService1: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_configuration?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					// console.log("Result from zc_configuration");
					// console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					RSOA_controller.getView().setModel(oModel, "oModel1");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_newService2: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					// console.log("Result from zc_exterior_trim");
					// console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					RSOA_controller.getView().setModel(oModel, "oModel2");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_newService3: function () {
			var host = RSOA_controller.host();
			// ZC_BRAND_MODEL_DETAIL
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_model?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					// console.log("Result from ZC_BRAND_MODEL_DETAIL");
					// console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					//	RSOA_controller.getView().byId("model_RSOA").setSizeLimit(oModel.getData().length);
					RSOA_controller.getView().setModel(oModel, "oModel3");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_handleRSADropDown: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_PIO_DIO?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					// console.log("Result from ZC_PIO_DIO");
					// console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					RSOA_controller.getView().setModel(oModel, "mode_Model");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		_handleServiceModel_ModelYear: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_myear?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					// console.log("Result from zc_mc_year");
					// console.log(data.d.results);
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
					// console.log(RSOA_controller.getView().getModel("modelYear_Model").getData());

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
					// console.log(arr2);
					oModel2.setData(arr2);
					RSOA_controller.getView().setModel(oModel2, "model_Model");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_handleServiceSuffix_Series: function () {
			var host = RSOA_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/SoldOrderSeriesSet?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

					// console.log("Result from ZC_MODEL_DETAILS ");
					// console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();

					var arr = [];
					var j = 0;
					for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["Zzseries"], arr) < 0) {
								arr[j] = data.d.results[i]["Zzseries"];
								j++;

							}
						}
					}

					oModel.setData(arr);
					RSOA_controller.getView().setModel(oModel, "seriesModel");
					// console.log(RSOA_controller.getView().getModel("seriesModel").getData());

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
					// console.log(arr2);
					oModel2.setData(arr2);
					RSOA_controller.getView().setModel(oModel2, "suffix_Model");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
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
			// Ayad editing to handle the creation method
			// ="yyyy-MM-ddTHH:mm:ss"
			var CustModel = RSOA_controller.getView().getModel('Customer').getData();
			var Zzmoyr = RSOA_controller.getView().byId("modelYr_RSOA").getValue();
			var Zzseries = RSOA_controller.getView().byId("series_RSOA").getSelectedKey();
			var Zzmodel = RSOA_controller.getView().byId("model_RSOA").getSelectedKey();
			var Zzsuffix = RSOA_controller.getView().byId("Suffix_RSOA").getSelectedKey();
			var Zzapx = RSOA_controller.getView().byId("Apx_RSOA").getSelectedKey();
			var Zzextcol = RSOA_controller.getView().byId("Colour_RSOA").getSelectedKey();
			var ZzreqEtaFrom1 = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			// console.log(ZzreqEtaFrom1);
			// console.log(RSOA_controller.getView().byId("etaFrom_RSOA").getDateValue());
			// var ZzreqEtaFrom2 = Date.now(ZzreqEtaFrom1);
			// var ZzreqEtaFrom = "Date(" + ZzreqEtaFrom2 + ")";
			var ZzreqEtaTo1 = RSOA_controller.getView().byId("etaTo_RSOA").getValue();
			// var ZzreqEtaTo2 = Date.now(ZzreqEtaTo1);
			// var ZzreqEtaTo = "Date(" + ZzreqEtaTo2 + ")";
			var ZcontractDate1 = RSOA_controller.getView().byId("ContractDate_RSOA").getValue();
			// var ZcontractDate2 = Date.now(ZcontractDate1);
			// var ZcontractDate = "Date(" + ZcontractDate2 + ")";
			var ZsalesType = RSOA_controller.getView().byId("SalesType_RSOA").getSelectedKey();
			var ZtcciNum = RSOA_controller.getView().byId("tcciNo_RSOA").getValue();
			var Zsalesperson = RSOA_controller.getView().byId("salesperson_RSOA").getValue();
			var Zsalesmanager = RSOA_controller.getView().byId("salesMan_RSOA").getValue();
			var ZtradeModelYr = RSOA_controller.getView().byId("trademodelYear_RSOAid").getValue();
			var ZtradeModel = RSOA_controller.getView().byId("trademodel_RSOAid").getValue();
			var ZtradeMake = RSOA_controller.getView().byId("tradeInMakeYear_RSOAid").getSelectedKey();
			var comment = RSOA_controller.getView().byId("Comment").getValue();

			var host = RSOA_controller.host();
			// SOcreateSet;
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet";
			var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			var _data = {
				"ZzsoReqNo": "RS",
				"Zzmodel": Zzmodel, //"YZ3DCT",
				"Zzmoyr": Zzmoyr, //"2018",
				"Zzseries": Zzseries,
				"Zzsuffix": Zzsuffix, //"ML",
				"Zzextcol": Zzextcol, //"01D6",
				"Zzapx": Zzapx, // "00",
				"ZzreqEtaFrom": ZzreqEtaFrom1, //null,
				"ZzreqEtaTo": ZzreqEtaTo1, //null,
				"ZcontractDate": ZcontractDate1, //null,
				"ZsalesType": ZsalesType, // "",
				"ZtcciNum": ZtcciNum, // "",
				"Zsalesperson": Zsalesperson, // "",
				"Zsalesmanager": Zsalesmanager, //"",
				"ZtradeModelYr": ZtradeModelYr, // "",
				"ZtradeModel": ZtradeModel,
				"ZtradeMake": ZtradeMake, // ""
				"Comment": comment,
				"ZzdealerCode": dealer_no,
				"Zzendcu": Zcustomer_No,
				"ZdriverLiNum": CustModel.DriveLic
			};
			if (Zcustomer_No) {
				RSOA_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Zcustomer_No", Zcustomer_No);
			}
			var dataString = JSON.stringify(
				_data
			);
			//--------------------------------------------------------------------------
			//----Checking if there is no Token , it will refresh to get another one---- 
			//---------------------------------------------------------------------------
			if (!RSOA_controller.getView().getModel('mainservices').getSecurityToken()) {
				RSOA_controller.getView().getModel('mainservices').refreshSecurityToken();
			}
			RSOA_controller.getView().getModel('mainservices').create('/Retail_Sold_OrderSet', _data, {
				success: function (data, oResponse) {
					RSOA_controller.getView().byId("modelYr_RSOA").setValue("");
					RSOA_controller.getView().byId("Suffix_RSOA").setSelectedKey(null);
					RSOA_controller.getView().byId("series_RSOA").setSelectedKey(null);
					//	var valModelCode = RSOA_controller.getView().byId("modelCode_RSOA").getValue();
					RSOA_controller.getView().byId("CustName_RSOA").setValue("");
					RSOA_controller.getView().byId("CustName_SSOA").setValue("");
					RSOA_controller.getView().byId("etaTo_RSOA").setValue("");
					RSOA_controller.getView().byId("etaFrom_RSOA").setValue("");
					RSOA_controller.getView().byId("Colour_RSOA").setSelectedKey(null);
					RSOA_controller.getView().byId("model_RSOA").setSelectedKey(null);
					RSOA_controller.getView().byId("Apx_RSOA").setSelectedKey(null);
					RSOA_controller.getView().byId("SalesType_RSOA").setValue("");
					RSOA_controller.getView().byId("ContractDate_RSOA").setValue("");
					RSOA_controller.getView().byId("tcciNo_RSOA").setValue("");
					RSOA_controller.getView().byId("salesperson_RSOA").setValue("");
					RSOA_controller.getView().byId("salesMan_RSOA").setValue("");
					RSOA_controller.getView().byId("trademodelYear_RSOAid").setValue("");
					RSOA_controller.getView().byId("trademodel_RSOAid").setValue("");
					RSOA_controller.getView().byId("tradeInMakeYear_RSOAid").setSelectedKey(null);
					RSOA_controller.getView().byId("Comment").setValue("");
					RSOA_controller.getView().byId("Address_RSOA").setValue("");
					RSOA_controller.getView().byId("License_RSOA").setValue("");
					RSOA_controller.getView().byId("Email_RSOA").setValue("");
					RSOA_controller.getView().byId("Phone_RSOA").setValue("");
					RSOA_controller.getView().byId("City_RSOA").setValue("");
					RSOA_controller.getView().byId("Province_RSOA").setValue("");
					RSOA_controller.getView().byId("PostalCode_RSOA").setValue("");
					if (data.ZzsoReqNo) {
						RSOA_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
							Soreq: data.ZzsoReqNo
						}, true);
					}

				},
				error: function (oData, oResponse) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			//---------------------------------------
			//---------Old Code-----------------------
			//---------------------------------------
			// 			$.ajax({
			// 				type: 'POST',
			// 				url: oURL,
			// 				cache: false,
			// 				data: dataString,
			// 				dataType: 'json',
			// 				headers: {
			// // 							accept: 'application/json',
			// 							// 'x-ibm-client-secret': 'D1qR2eO3hV4wR6sM8fB2gU5aE0fQ0iM7iJ4pU6iM0gQ1dF0yV1',
			// 							// 'x-ibm-client-id': 'a73cc0ac-1106-40e4-95a4-6d8f9184387e',
			// 							'content-type': 'application/json'
			// 						},
			// 				success: function (data) {
			// 					// console.log(data);
			// 					// sap.m.MessageBox.show("Successfully Request Created", sap.m.MessageBox.Icon.SUCCESS, "Success", sap.m.MessageBox.Action.OK,
			// 					// 	null, null);
			// 					if (data.d.ZzsoReqNo) {
			// 						RSOA_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
			// 							Soreq: data.d.ZzsoReqNo
			// 						}, true);
			// 					} //page 3
			// 				},
			// 				error: function (data) {
			// 					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap.m
			// 						.MessageBox.Action.OK, null, null);
			// 				}

			// 			});
		},

		_handleToDateChange: function () {
			// Handle th Validation Date "YYYYMMdd"
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var etaFrom = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			var count = 0;
			var endDate = new Date();
			var CDate = zdateFormat.parse(etaFrom);
			var day5 = new Date();
			if (etaFrom !== "") {
				while (count < 5) {
					endDate = new Date(CDate.setDate(CDate.getDate() + 1));
					if (endDate.getDay() != 0 && endDate.getDay() != 6) {
						//Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
						count++;
					}
				}

				RSOA_controller.getView().byId("etaTo_RSOA").setMinDate(CDate);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap.m.MessageBox.Action.OK, null, null);
			}

			// var etaFrom = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			// if (etaFrom !== "") {
			// 	var CDate = new Date(etaFrom);
			// 	var day5 = CDate;
			// 	day5.setDate(CDate.getDate() + 5);
			// 	RSOA_controller.getView().byId("etaTo_RSOA").setMinDate(day5);
			// } else {
			// 	var errForm = formatter.formatErrorType("SO00002");
			// 	var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
			// 	sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			// }
		},

		onValidateCustomer: function () {
			var CustModel = RSOA_controller.getView().getModel('Customer').getData();
			if (CustModel.FirstName != '' && CustModel.SecondName != '' && CustModel.FirstName && CustModel.SecondName && CustModel.Phone != '' &&
				CustModel.Phone && CustModel.City != '' && CustModel.City &&
				CustModel.Province != '' && CustModel.Province && CustModel.Address != '' && CustModel.Address && CustModel.PostCode != '' &&
				CustModel.PostCode) {

				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error1");
				var title = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("title5");
				var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});
				var msg = new sap.m.HBox({
					items: [icon, new sap.m.Text({
						text: errMsg
					})]
				});
				var oBusyDialog = new sap.m.BusyDialog({
					showCancelButton: false
				});
				var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile?postalCode=" + CustModel.PostCode + "&phone=" + CustModel.Phone +
					"&lastName=" + CustModel.SecondName;
				//lastName=" + CustModel.Name;
				var msg1 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("msgcustomer1");
				//+ "&phone=" +CustModel.Phone;
				oBusyDialog.open();
				$.ajax({
					url: url,
					headers: {
						accept: 'application/json'
							// 'x-ibm-client-secret': 'Q7gP8pI0gU5eF8wM2jQ3gB8pQ5mA8rP8nO5dR1iY8qW2kS0wA0',
							// 'x-ibm-client-id': 'd4d033d5-c49e-4394-b3e3-42564296ec65'
					},
					type: "GET",
					dataType: "json",
					// data: soapMessage,
					contentType: "text/xml; charset=\"utf-8\"",
					success: function (data, textStatus, jqXHR) {
						oBusyDialog.close();
						var phone = '';
						//Looping on all customers that we got to match b phone and first name
						for (var i = 0; i < data.customers.length; i++) {
							// Check the First Name first
							if (data.customers[i].person.firstName.toLowerCase() == CustModel.FirstName.toLowerCase()) {
								for (var z = 0; z < data.customers[i].phones.length; z++) {
									phone = data.customers[i].phones[z].areaCode + data.customers[i].phones[z].localNumber;
									// Check Phone No 
									if (phone == CustModel.Phone) {
										Zcustomer_No = data.customers[i].partyID; //customerNumber;
										Zcustomer_No = Zcustomer_No.toString();
										sap.m.MessageBox.show(msg, {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: title,
											actions: sap.m.MessageBox.Action.OK,
											onClose: null,
											styleClass: "",
											initialFocus: null,
											textDirection: sap.ui.core.TextDirection.Inherit,
											contentWidth: "10rem"
										});
										break;
									}
								}
							}
							if (Zcustomer_No && Zcustomer_No != '') {
								break;
							}
						}
						// If no one of the fetched customer matching the searching criteria select hte first one.
						if (!Zcustomer_No || Zcustomer_No == '') {
							Zcustomer_No = data.customers[0].partyID; //customerNumber;
							Zcustomer_No = Zcustomer_No.toString();

						}
					},
					error: function (request, errorText, errorCode) {
						var soapMessage = {
							"requestHeader": {
								"source": "Toyota",
								"userId": "LOAD",
								"requestLanguage": "fr_CA"
							},
							"type": "NewProfile",
							"customer": {
								"person": {
									"firstName": CustModel.FirstName,
									"familyName": CustModel.SecondName
								},
								"addresses": [{
									"line1": CustModel.Address,
									"city": CustModel.City,
									"provinceCode": CustModel.Province,
									"countryCode": "CA",
									"postalCode": CustModel.PostCode,
									"addressType": "BUSINESS"
								}],
								"phones": [{
									"localNumber": CustModel.Phone.substr(3, 7),
									"areaCode": CustModel.Phone.substr(0, 3),
									"useCode": "WORK"
								}],
								"preferredLanguageCode": "en-CA",
								"electronicAddresses": [{
									"uriID": CustModel.Email,
									useCode: "PERSONAL"
								}]
							},
							"source": "OICC"
						};
						var zdataString = JSON.stringify(
							soapMessage
						);
						$.ajax({
							url: '/node/tci/internal/api/v1.0/customer/custupdate/oicc/profileChange',
							headers: {
								accept: 'application/json',
								// 'x-ibm-client-secret': 'D1qR2eO3hV4wR6sM8fB2gU5aE0fQ0iM7iJ4pU6iM0gQ1dF0yV1',
								// 'x-ibm-client-id': 'a73cc0ac-1106-40e4-95a4-6d8f9184387e',
								'content-type': 'application/json'
							},
							type: "POST",
							dataType: "json",
							data: zdataString,
							success: function (data, textStatus, jqXHR) {
								oBusyDialog.close();
								if (data.customer) {
									Zcustomer_No = data.customer.partyID; //customerNumber;
									Zcustomer_No = Zcustomer_No.toString();
									var errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("success1");
									title = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("title5");
									icon = new sap.ui.core.Icon({
										src: "sap-icon://success",
										size: "2rem"
									});
									var msg2 = new sap.m.HBox({
										items: [icon, new sap.m.Text({
											text: errMsg2
										})]
									});
									sap.m.MessageBox.show(msg2, {
										icon: sap.m.MessageBox.Icon.SUCCESS,
										title: title,
										actions: sap.m.MessageBox.Action.OK,
										onClose: null,
										styleClass: "",
										initialFocus: null,
										textDirection: sap.ui.core.TextDirection.Inherit,
										contentWidth: "10rem"
									});

								}
							},
							error: function (request, errorText, errorCode) {
								oBusyDialog.close();
								if (request.responseJSON.errors.length > 0) {
									if (request.responseJSON.errors[1]) {
										sap.m.MessageBox.show(request.responseJSON.errors[1].httpMessage, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: request.responseJSON.errors[0].httpMessage,
											actions: sap.m.MessageBox.Action.OK,
											onClose: null,
											styleClass: "",
											initialFocus: null,
											textDirection: sap.ui.core.TextDirection.Inherit
												// contentWidth: "20rem"
										});
									} else {
										sap.m.MessageBox.show(request.responseJSON.errors[0].httpMessage, {
											icon: sap.m.MessageBox.Icon.ERROR,
											actions: sap.m.MessageBox.Action.OK,
											onClose: null,
											styleClass: "",
											initialFocus: null,
											textDirection: sap.ui.core.TextDirection.Inherit
												// contentWidth: "20rem"
										});
									}

								}
							}
						});
					}

				});
				// sap.m.MessageBox.show(msg, {
				// 	//	icon: sap.m.MessageBox.Icon.WARNING,
				// 	title: title,
				// 	actions: sap.m.MessageBox.Action.OK,
				// 	onClose: null,
				// 	styleClass: "",
				// 	initialFocus: null,
				// 	textDirection: sap.ui.core.TextDirection.Inherit,
				// 	contentWidth: "10rem"
				// });
				validateFlagA = true;
				var submitBtn = RSOA_controller.getView().byId("Btn_submit_RSOA");
				if (validateFlagA == true) {
					submitBtn.setEnabled(true);
				} else {
					submitBtn.setEnabled(false);
				}

			} else {
				/*	validateFlagA = true;
				if (validateFlagA == true) {
					var submitBtn = RSOA_controller.getView().byId("Btn_submit_RSOA")
					submitBtn.setEnabled(true);
				}*/
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
				var errForm = formatter.formatErrorType("SO000023");
				errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			}
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
			var submitBtn = RSOA_controller.getView().byId("Btn_submit_RSOA");
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
			// var valLicense = RSOA_controller.getView().byId("License_RSOA").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valCustName == "" || valETATo == "" || valETAFrom == "" ||
				valColour ==
				"" || valModel == "" || valApx == "" || valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "") {
				flag1 = true;
			}
			if (validateFlagA == false) {
				flag2 = true;
			}
			var errForm;
			if (flag1 == true && flag2 == false) {
				if (valModelYr == "") {
					errForm = formatter.formatErrorType("SO000015");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);

				} else if (valSeries == "") {
					errForm = formatter.formatErrorType("SO000016");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (valModel == "") {
					errForm = formatter.formatErrorType("SO000017");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);

					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (valSuffix == "") {
					errForm = formatter.formatErrorType("SO000018");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);

					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (valColour == "") {
					errForm = formatter.formatErrorType("SO000019");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);

					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (valApx == "") {
					errForm = formatter.formatErrorType("SO000020");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);

					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (valETATo == "" || valETAFrom == "") {
					errForm = formatter.formatErrorType("SO000021");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);

					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (valSalesType == "" || valContractDate == "") {
					errForm = formatter.formatErrorType("SO000022");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);

					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else {
					errForm = formatter.formatErrorType("SO00003");
					errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap
						.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			} else if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == true && flag2 == true) {
				errForm = formatter.formatErrorType("SO00003");
				errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				// var errForm2 = formatter.formatErrorType("SO00004");
				// errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg; // + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				//submitBtn.setEnabled(true);
				RSOA_controller.submitSO();

			}
		},

		onAfterRendering: function () {
			RSOA_controller.listOfModelYear();
			
		},
		//-----------------------------------------
		//---------Handling Select Year----------
		//--------------------------------------------
		select_year: function (Oevent) {

			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("YearPopup", "toyota.ca.SoldOrder.view.fragments.YearPopup", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(Oevent.getSource());
			input_ref = Oevent.getSource();

		},
		handleSelectYearPress: function (Oevent) {
			input_ref.setValue(Oevent.getSource().getYear()); //this._oPopover.getContent()[0].getYear()
			// var items_binding = this.getView().byId('model_RSOA').getBinding('items');
			//  items_binding.filter(new sap.ui.model.Filter("Modelyear", sap.ui.model.FilterOperator.EQ, Oevent.getSource().getYear()));
			var series = this.getView().byId('series_RSOA').getSelectedKey();
			var modelyear = this.getView().byId('modelYr_RSOA').getValue();

			if (series && modelyear) {
				var modelCB = this.getView().byId("model_RSOA");
				var suffixCB = this.getView().byId("Suffix_RSOA");
				var apxCB = this.getView().byId("Apx_RSOA");
				var colorCB = this.getView().byId("Colour_RSOA");
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				var model;
				var oSorter = new sap.ui.model.Sorter('mainservices>model');

				// var language = RSOA_controller.returnBrowserLanguage();

				if (language === "FR") {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				} else {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				}
				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					sorter: oSorter,
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = this.getView().byId('model_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
			this._oPopover.close();
		},
		initailyear: function (oEvent) {

			oEvent.getSource().getContent()[0].setDate(new Date());
		},
		onpreviousyears: function (oEvent) {
			this._oPopover.getContent()[0].previousPage();
		},
		onnextyears: function (oEvent) {
			this._oPopover.getContent()[0].nextPage();
		},
		select_year1: function (Oevent) {

			if (!this._oPopover1) {
				this._oPopover1 = sap.ui.xmlfragment("YearPopup2", "toyota.ca.SoldOrder.view.fragments.YearPopup2", this);
				this.getView().addDependent(this._oPopover1);
			}
			this._oPopover1.openBy(Oevent.getSource());
			input_ref = Oevent.getSource();

		},
		handleSelectYearPress1: function (Oevent) {
			input_ref.setValue(Oevent.getSource().getYear()); //this._oPopover.getContent()[0].getYear()
			// var items_binding = this.getView().byId('model_RSOA').getBinding('items');
			//  items_binding.filter(new sap.ui.model.Filter("Modelyear", sap.ui.model.FilterOperator.EQ, Oevent.getSource().getYear()));
			this._oPopover1.close();
		},
		initailyear1: function (oEvent) {
			oEvent.getSource().getContent()[0]._oMaxDate._oUDate.oDate = new Date();
			oEvent.getSource().getContent()[0].setDate(new Date());
		},
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------
		series_selected: function (oEvent) {

			// var year = this.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"
			var modelyear = this.getView().byId('modelYr_RSOA').getValue();
			var model;
			// var language = RSOA_controller.returnBrowserLanguage();

			if (language === "FR") {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			} else {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			}
			var series = this.getView().byId('series_RSOA').getSelectedKey();
			if (series && modelyear) {
				var modelCB = this.getView().byId("model_RSOA");
				var suffixCB = this.getView().byId("Suffix_RSOA");
				var apxCB = this.getView().byId("Apx_RSOA");
				var colorCB = this.getView().byId("Colour_RSOA");
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				var oSorter = new sap.ui.model.Sorter('mainservices>model');
				var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					sorter: oSorter,
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = this.getView().byId('model_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = oEvent.getSource().getSelectedKey();
			// var language = RSOA_controller.returnBrowserLanguage();
			var modelyear = this.getView().byId('modelYr_RSOA').getValue();
			var suf;
			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

			var brand;
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					brand = "TOYOTA";

				} else { // set the lexus logo
					brand = "LEXUS";

					// }
				}
			}
			if (language === "FR") {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			} else {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			if (model && modelyear) {
				var suffixCB = this.getView().byId("Suffix_RSOA");
				var apxCB = this.getView().byId("Apx_RSOA");
				var colorCB = this.getView().byId("Colour_RSOA");
				// 		modelCB.setSelectedKey(null);
				// modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				suffixCB.bindItems({
					// path: 'VechileModel>/zc_configuration',ZVMS_CDS_SUFFIX
					path: "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "')/Set",
					sorter: {
						path: 'mainservices>suffix'
					},
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("brand", sap.ui.model.FilterOperator.EQ, brand)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						text: suf
					})
				});
				// ,{path:'mainservices>int_trim_desc_en'}		
				// var items_binding = this.getView().byId('Suffix_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
			}
		},
		suffix_selected: function (oEvent) {
			//-----------------
			//----APX---------
			//----------------
			//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
			var suffix = oEvent.getSource().getSelectedKey();
			var modelyear = this.getView().byId('modelYr_RSOA').getValue();
			var model = this.getView().byId('model_RSOA').getSelectedKey();
			if (model && modelyear && suffix) {
				var apxCB = this.getView().byId("Apx_RSOA");
				var colorCB = this.getView().byId("Colour_RSOA");
				// 		modelCB.setSelectedKey(null);
				// modelCB.destroyItems();
				// suffixCB.setSelectedKey(null);
				// suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				apxCB.bindItems({
					// path: 'VechileModel>/ZC_PIO_DIO',
					path: 'mainservices>/ZVMS_CDS_APX',
					sorter: {
						path: 'mainservices>zzapx'
					},
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						// key: "{VechileModel>zzapx}",
						key: "{mainservices>zzapx}",
						// text: "{VechileModel>zzapx}"
						text: "{mainservices>zzapx}"
					})
				});
				// var items_binding = this.getView().byId('Apx_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
				//-----------------
				//----Color---------
				//----------------
				var color;
				// var language = RSOA_controller.returnBrowserLanguage();
				if (language === "FR") {
					color = "{mainservices>ext}/{mainservices>mktg_desc_fr}";
				} else {
					color = "{mainservices>ext}/{mainservices>mktg_desc_en}";
				}
				this.getView().byId('Colour_RSOA').bindItems({
					path: 'mainservices>/ZVMS_CDS_Colour',
					sorter: {
						path: 'mainservices>ext'
					},

					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>ext}",
						text: color
							// text: "{parts: [{path:'VechileModel>ExteriorColorCode'},{path:'VechileModel>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
					})
				});
				// var items_binding = this.getView().byId('Colour_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		},
		stype_change: function (Oevent) {
			if (Oevent.getParameters().selectedItem.getKey() == "1") {
				RSOA_controller.getView().byId("tcciNo_RSOA").setValue("N/A");
				RSOA_controller.getView().byId("tcciNo_RSOA").setEnabled(false);
				// tcciNo_RSOA
			} else {
				RSOA_controller.getView().byId("tcciNo_RSOA").setValue("");
				RSOA_controller.getView().byId("tcciNo_RSOA").setEnabled(true);
			}

		},

		validPostalCode: function (postalCode) {
			if (postalCode) {
				postalCode = postalCode.getParameters().newValue;
				var postalRegEx = new RegExp(/^[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/m);
				if (postalRegEx.test(postalCode) == true) {
					RSOA_controller.getView().byId("PostalCode_RSOA").setValueState("None");
					return postalCode;
				} else {
					RSOA_controller.getView().byId("PostalCode_RSOA").setValueState("Error");
					return null;
				}
			}
		},
		validPhoneNum: function (phoneNum) {
			if (phoneNum) {
				phoneNum = phoneNum.getParameters().newValue;
				var phoneregEx = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
				if (phoneregEx.test(phoneNum) == true) {
					RSOA_controller.getView().byId("Phone_RSOA").setValueState("None");
					return phoneNum;
				} else {
					RSOA_controller.getView().byId("Phone_RSOA").setValueState("Error");
					return null;
				}
			}
		}
		// ,

		// ShowError: function () {
		// 	var invalidPostalCode = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("SO000024");
		// 	sap.m.MessageBox.show(invalidPostalCode, sap.m.MessageBox.Icon.ERROR, sap
		// 		.m.MessageBox.Action.OK, null, null);
		// }

	});

});