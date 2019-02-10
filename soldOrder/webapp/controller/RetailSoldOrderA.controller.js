sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var validateFlagA = false;
	var RSOA_controller, Zcustomer_No, input_ref;

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
			var model = new JSONModel({});
			RSOA_controller.getView().setModel(model, 'Customer');
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
					// console.log("Result from zc_configuration");
					// console.log(data.d.results);
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
					// console.log("Result from zc_exterior_trim");
					// console.log(data.d.results);
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
			// ZC_BRAND_MODEL_DETAIL
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_model?sap-client=200&$format=json";
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
					// console.log("Result from ZC_PIO_DIO");
					// console.log(data.d.results);
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

					// console.log("Result from ZC_MODEL_DETAILS ");
					// console.log(data.d.results);
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
			// Ayad editing to handle the creation method
			// ="yyyy-MM-ddTHH:mm:ss"
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
			var _data = {
				// "ZzsoReqNo": "",
				// "Zzmodel": "YZ3DCT",
				// "Zzmoyr": "2018",
				// "Zzsuffix": "ML",
				// "Zzextcol": "01D6",
				// "Zzapx": "00",
				// "ZzreqEtaFrom": "20190102",
				// "ZzreqEtaTo": "20180304",
				// "ZcontractDate": "20180304",
				// "ZsalesType": "",
				// "ZtcciNum": "",
				// "Zsalesperson": "",
				// "Zsalesmanager": "",
				// "ZtradeModelYr": "",
				// "ZtradeMake": ""
				"ZzsoReqNo": "SO",
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
				"Zzendcu": Zcustomer_No
			};
			var dataString = JSON.stringify(
				_data
			);
			//Checking if there is no Token , it will refresh to get another one 
			if (!RSOA_controller.getView().getModel('mainservices').getSecurityToken()) {
				RSOA_controller.getView().getModel('mainservices').refreshSecurityToken();
			}
			RSOA_controller.getView().getModel('mainservices').create('/Retail_Sold_OrderSet', _data, {
				success: function (data, oResponse) {
					if (data.ZzsoReqNo) {
						RSOA_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
							Soreq: data.ZzsoReqNo
						}, true);
					}

				},
				error: function (oData, oResponse) {
					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap.m
						.MessageBox.Action.OK, null, null);
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
			if (etaFrom !== "") {
				var CDate = zdateFormat.parse(etaFrom);
				var day5 = new Date();
				day5.setDate(CDate.getDate() + 5);
				RSOA_controller.getView().byId("etaTo_RSOA").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}

			// var etaFrom = RSOA_controller.getView().byId("etaFrom_RSOA").getValue();
			// if (etaFrom !== "") {
			// 	var CDate = new Date(etaFrom);
			// 	var day5 = CDate;
			// 	day5.setDate(CDate.getDate() + 5);
			// 	RSOA_controller.getView().byId("etaTo_RSOA").setMinDate(day5);
			// } else {
			// 	var errForm = formatter.formatErrorType("SO00002");
			// 	var errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			// 	sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			// }
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
			var CustModel = RSOA_controller.getView().getModel('Customer').getData();
			var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile?lastName=" + CustModel.Name;
			//+ "&phone=" +CustModel.Phone;
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
					if (data.customers[0]) {
						Zcustomer_No = data.customers[0].customerNumber;
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
								"firstName": CustModel.Name,
								"familyName": CustModel.Name
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
								"localNumber": CustModel.Phone.substr(4, 7),
								"areaCode": CustModel.Phone.substr(0, 3),
								"useCode": "WORK"
							}],
							"preferredLanguageCode": "en-CA",
							"suspendMail": {
								"suspendMailReason": CustModel.Email
							}
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
							if (data.customers[0]) {
								Zcustomer_No = data.customers[0].customerNumber;
							}
						},
						error: function (request, errorText, errorCode) {
							var x = errorCode;
						}
					});
				}

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

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valCustName == "" || valETATo == "" || valETAFrom == "" ||
				valColour ==
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
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------
		series_selected: function (oEvent) {

			// var year = this.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"
			var series = oEvent.getSource().getSelectedKey();
			if (series) {
				this.getView().byId('model_RSOA').bindItems("oModel3>/", new sap.ui.core.ListItem({
					key: "{oModel3>Model}",
					text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
				}));
				var items_binding = this.getView().byId('model_RSOA').getBinding('items');
				items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = oEvent.getSource().getSelectedKey();
			var modelyear = this.getView().byId('modelYr_RSOA').getValue();
			if (model && modelyear) {
				this.getView().byId('Suffix_RSOA').bindItems('oModel1>/', new sap.ui.core.ListItem({
					key: "{oModel1>Suffix}",
					text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel1>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
				}));
				var items_binding = this.getView().byId('Suffix_RSOA').getBinding('items');
				items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
					new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				], true));
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
				this.getView().byId('Apx_RSOA').bindItems('mode_Model>/', new sap.ui.core.ListItem({
					key: "{mode_Model>zzapx}",
					text: "{mode_Model>zzapx}"
				}));
				var items_binding = this.getView().byId('Apx_RSOA').getBinding('items');
				items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
					new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
					new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				], true));
				//-----------------
				//----Color---------
				//----------------
				this.getView().byId('Colour_RSOA').bindItems('oModel2>/', new sap.ui.core.ListItem({
					key: "{oModel2>ExteriorColorCode}",
					text: "{parts: [{path:'oModel2>ExteriorColorCode'},{path:'oModel2>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
				}));
				var items_binding = this.getView().byId('Colour_RSOA').getBinding('items');
				items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
					new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
					new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				], true));

			}
		}

	});

});