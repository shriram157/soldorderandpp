sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, formatter, Filter, FilterOperator, JSONModel) {
	"use strict";
	var RSOB_controller, Zcustomer_No, input_ref, validateFlagB = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderB", {
		formatter: formatter,

		onInit: function () {
			RSOB_controller = this;
			// RSOB_controller.getBrowserLanguage();
			AppController.RSOB = true;
			RSOB_controller.flagInvalidPCode = false;
			RSOB_controller.flagInvalidPhone = false;
			RSOB_controller.validateFlagB = false;
			RSOB_controller.flagInvalidName = false; // DMND0003108
			var model = new JSONModel({});
			// AppController.getDealer();
			RSOB_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			RSOB_controller._handleServiceSuffix_Series();
			RSOB_controller.getView().setModel(model, 'Customer');
			var todayDate = new Date();
			RSOB_controller.getView().byId("ContractDate_RSOB").setMaxDate(todayDate);

			this.getOwnerComponent().getRouter().getRoute("RetailSoldOrderB").attachPatternMatched(this._getattachRouteMatched, this);

			// RSOB_controller._handleRSADropDown();
			// 	var host = RSOB_controller.host();
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			RSOB_controller.brand;
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					RSOB_controller.brand = "TOY";

				} else { // set the lexus logo
					RSOB_controller.brand = "LEX";

					// }
				}
			}
			// 	var seriesCB = RSOB_controller.getView().byId("series_RSOB");
			// var url = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
			// 	"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			// //	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			// $.ajax({
			// 	url: url,
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		if (seriesCB.getValue() !== "") {
			// 			//seriesCB.setValue(" ");
			// 			seriesCB.setSelectedKey(null);
			// 		}
			// 		//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data.d.results);
			// 		RSOB_controller.getView().setModel(oModel, "seriesModel");

			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
			// 		sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
		},
		onBeforeRendering: function () {
			// console.log(RSOB_controller.getView().byId("form1_RSOB").getTitle());
			RSOB_controller.getView().byId("form1_RSOB").destroyTitle();
			RSOB_controller.getView().byId("form2_RSOB").destroyTitle();
		},
		_handleRSADropDown: function () {
			var host = RSOB_controller.host();
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
					RSOB_controller.getView().setModel(oModel, "mode_Model");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");

					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_getattachRouteMatched: function (parameters) {
			// Work Around for P2 issue by Aarti Dhamat  Code Start
			this.getDealer();
			// Work Around for P2 issue by Aarti Dhamat  Code End
			validateFlagB = false;
			var submitBtn = RSOB_controller.getView().byId("Btn_submit_RSOB");
			if (validateFlagB == true) {
				submitBtn.setEnabled(true);
			} else {
				submitBtn.setEnabled(false);
			}
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var values = {};
			if (parameters.getParameters().arguments.modelyear) {
				values.modelyear = parameters.getParameters().arguments.modelyear;
			}
			if (parameters.getParameters().arguments.modelkey) {
				values.modelkey = parameters.getParameters().arguments.modelkey;
				// var model_RSOB_items = RSOB_controller.getView().byId("model_RSOB").getBinding("items");
				// model_RSOB_items.filter([new Filter("Model", FilterOperator.EQ, values.modelkey)]);
			}
			if (parameters.getParameters().arguments.serieskey) {
				values.serieskey = parameters.getParameters().arguments.serieskey;
			}
			if (parameters.getParameters().arguments.suffixkey) {
				values.suffixkey = parameters.getParameters().arguments.suffixkey;
				RSOB_controller.suffixkey = parameters.getParameters().arguments.suffixkey;
				// var suffix_CSOR_items = RSOB_controller.getView().byId("suffix_CSOR").getBinding("items");
				// var filter = new Filter([new Filter("model_year", FilterOperator.EQ, values.modelyear), new Filter("model", FilterOperator.EQ,
				// 		values.modelkey),
				// 	new Filter("suffix", FilterOperator.EQ, values.suffixkey)
				// ], true);
				// suffix_CSOR_items.filter(filter);
			}
			if (parameters.getParameters().arguments.apxkey) {
				values.apxkey = parameters.getParameters().arguments.apxkey;
				// var apx_RSOB_items = RSOB_controller.getView().byId("apx_RSOB").getBinding("items");
				// apx_RSOB_items.filter([new Filter("zzapx", FilterOperator.EQ, values.apxkey)]);
			}
			if (parameters.getParameters().arguments.colorkey) {
				values.colorkey = parameters.getParameters().arguments.colorkey;
				// var color_RSOB_items = RSOB_controller.getView().byId("colour_RSOB").getBinding("items");
				// color_RSOB_items.filter([new Filter("ExteriorColorCode", FilterOperator.EQ, values.colorkey)]);
			}
			if (parameters.getParameters().arguments.vtnn) {
				values.vtnn = parameters.getParameters().arguments.vtnn;
				RSOB_controller.getView().getModel('mainservices').callFunction("/Free_DNC", {
					method: "POST",
					urlParameters: {
						ZZVTN: values.vtnn
					},
					success: function (data, response) {

					},
					error: function (oData, oResponse) {
						sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
							.MessageBox.Action.OK, null, null);
					}
				});
			}
			if (parameters.getParameters().arguments.fromdate) {
				values.fromdate = zdateFormat.parse(parameters.getParameters().arguments.fromdate);
			}
			if (parameters.getParameters().arguments.todate) {
				values.todate = zdateFormat.parse(parameters.getParameters().arguments.todate);
			}

			var dateSO_BModel = new JSONModel({
				toDate: values.todate,
				fromDate: values.fromdate
			});
			sap.ui.getCore().setModel(dateSO_BModel, "dateSO_BModel");
			RSOB_controller.getView().setModel(new JSONModel(values), "RSOB_Model");
			RSOB_controller.series_selected();
			RSOB_controller.model_selected();

			RSOB_controller.suffix_selected();

		},
		getSO: function () {
			var host = RSOB_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//---------------------------------------------------------------------------------------------------------
			//--------------Mock Data for Vechile Information till make integration with PipeLine App------------------
			//---------------------------------------------------------------------------------------------------------
			// Model
			// if (RSO_MSO_controller.getView().getModel('RSOB_Model').getProperty('Zzmodel')) {
			// 	var model = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel');
			// 	var model_CSOR_items = RSO_MSO_controller.getView().byId("model_CSOR").getBinding("items");
			// 	model_CSOR_items.filter([new Filter("Model", FilterOperator.EQ, model)]);
			// }
			// // Suffix
			// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix')) {
			// 	var suffix = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix');
			// 	var suffix_CSOR_items = RSO_MSO_controller.getView().byId("suffix_CSOR").getBinding("items");
			// 	suffix_CSOR_items.filter([new Filter("Suffix", FilterOperator.EQ, suffix)]);
			// }
			// // APX
			// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzapx')) {
			// 	var apx = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzapx');
			// 	var apx_CSOR_items = RSO_MSO_controller.getView().byId("apx_CSOR").getBinding("items");
			// 	apx_CSOR_items.filter([new Filter("zzapx", FilterOperator.EQ, apx)]);
			// }
			// // Color
			// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol')) {
			// 	var color = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol');
			// 	var color_CSOR_items = RSO_MSO_controller.getView().byId("colour_CSOR").getBinding("items");
			// 	color_CSOR_items.filter([new Filter("ExteriorColorCode", FilterOperator.EQ, color)]);
			// }
			// var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000112'&$format=json";
			// this.getOwnerComponent().getModel("mainservices").read("/Retail_Sold_OrderSet?$filter=ZzsoReqNo eq'SO0000000112'", {
			// 	success: function (oData) {
			// 		RSOB_controller.getView().setModel(new JSONModel(oData.results[0]), "RSOB_Model");
			// 	},
			// 	error: function (Oerror) {}
			// });
			// $.ajax({
			// 	type: 'GET',
			// 	url: oURL,
			// 	cache: false,
			// 	success: function (data) {
			// 		console.log(data.d.results[0]);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data.d.results[0]);
			// 		RSOB_controller.getView().setModel(oModel, "RSOB_Model");
			// 	},
			// 	error: function (data) {
			// 		sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}

			// });
		},
		/*		onValidateCustomer: function () {
					validateFlagB = true;
					var submitBtn = RSOB_controller.getView().byId("Btn_submit_RSOB");
					if (validateFlagB == true) {
						submitBtn.setEnabled(true);
					} else {
						submitBtn.setEnabled(false);
					}
					var CustModel = RSOB_controller.getView().getModel('Customer').getData();
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
						//---------------------------------------------------
						//----Customer API-----------------------------------
						//--------------------------------------------------
						var oBusyDialog = new sap.m.BusyDialog({
							showCancelButton: false
						});

<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<AUTO GENERATED BY CONFLICT EXTENSION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TCI2
				var url = "/node/tci2/internal/api/v1.0/customer/cdms/customers/profile?postalCode=" + CustModel.PostCode + "&phone=" + CustModel.Phone +
====================================AUTO GENERATED BY CONFLICT EXTENSION====================================
						var url = "/node/api/v1.0/customer/cdms/customers/profile?postalCode=" + CustModel.PostCode + "&phone=" + CustModel.Phone +
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTO GENERATED BY CONFLICT EXTENSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> develop
							"&lastName=" + CustModel.SecondName;
						var msg1 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("msgcustomer1");
						//lastName=" + CustModel.Name;
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
								}
								// if (data.customers[0]) {
								// 	Zcustomer_No = data.customers[0].partyID; //customerNumber;
								// 	Zcustomer_No = Zcustomer_No.toString();
								// 	// sap.m.MessageBox.show(msg1 + data.customers[0].customerNumber, {
								// 	// 	//	icon: sap.m.MessageBox.Icon.WARNING,
								// 	// 	title: title,
								// 	// 	actions: sap.m.MessageBox.Action.OK,
								// 	// 	onClose: null,
								// 	// 	styleClass: "",
								// 	// 	initialFocus: null,
								// 	// 	textDirection: sap.ui.core.TextDirection.Inherit,
								// 	// 	contentWidth: "10rem"
								// 	// });
								// 	sap.m.MessageBox.show(msg, {
								// 		icon: sap.m.MessageBox.Icon.WARNING,
								// 		title: title,
								// 		actions: sap.m.MessageBox.Action.OK,
								// 		onClose: null,
								// 		styleClass: "",
								// 		initialFocus: null,
								// 		textDirection: sap.ui.core.TextDirection.Inherit,
								// 		contentWidth: "10rem"
								// 	});
								// }
							},
							error: function (request, errorText, errorCode) {
								var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");

								if (RSOB_controller.flagInvalidPCode == true && RSOB_controller.flagInvalidPhone == false) {
									oBusyDialog.close();
									var errMsg1 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorPostalCode");
									sap.m.MessageBox.show(errMsg1, sap.m.MessageBox.Icon.ERROR, errTitle, sap
										.m.MessageBox.Action.OK, null, null);
								} else if (RSOB_controller.flagInvalidPCode == false && RSOB_controller.flagInvalidPhone == true) {
									oBusyDialog.close();
									var errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorPhone");
									sap.m.MessageBox.show(errMsg2, sap.m.MessageBox.Icon.ERROR, errTitle, sap
										.m.MessageBox.Action.OK, null, null);
								} else if (RSOB_controller.flagInvalidPCode == true && RSOB_controller.flagInvalidPhone == true) {
									oBusyDialog.close();
									var errMsg3 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorPhonePostalCode");
									sap.m.MessageBox.show(errMsg3, sap.m.MessageBox.Icon.ERROR, errTitle, sap
										.m.MessageBox.Action.OK, null, null);
								} else {
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
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<AUTO GENERATED BY CONFLICT EXTENSION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TCI2
								url: '/node/tci2/internal/api/v1.0/customer/custupdate/oicc/profileChange',
====================================AUTO GENERATED BY CONFLICT EXTENSION====================================
										url: '/node/api/v1.0/customer/custupdate/oicc/profileChange',
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTO GENERATED BY CONFLICT EXTENSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> develop
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
							}
						});

						RSOB_controller.validateFlagB = true;
					} else {
						var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
						var errForm = formatter.formatErrorType("SO000023");
						errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
							.m.MessageBox.Action.OK, null, null);
					}
				},
		*/

		/************** Begin of DMND0003108 **************************/

		onValidateCustomer: function () {
			var CustModel = RSOB_controller.getView().getModel('Customer').getData();
			Zcustomer_No = '';
			var submitBtn = RSOB_controller.getView().byId("Btn_submit_RSOB");
			submitBtn.setEnabled(false);
			RSOB_controller.validateFlagB = false;
			if (CustModel.FirstName != '' && CustModel.SecondName != '' && CustModel.FirstName && CustModel.SecondName && CustModel.Phone != '' &&
				CustModel.Phone && CustModel.City != '' && CustModel.City &&
				CustModel.Province != '' && CustModel.Province && CustModel.Address != '' && CustModel.Address && CustModel.PostCode != '' &&
				CustModel.PostCode) {
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");

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
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<AUTO GENERATED BY CONFLICT EXTENSION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TCI2
				var url = "/node/authproxy/acpt/api/v1.0/customer/cdms/customers/profile?postalCode=" + CustModel.PostCode + "&phone=" + CustModel.Phone +
					"&lastName=" + CustModel.SecondName;
====================================AUTO GENERATED BY CONFLICT EXTENSION====================================
				 var url = "/node/authproxy/qa/api/v1.0/customer/cdms/customers/profile?postalCode=" + CustModel.PostCode + "&phone=" + CustModel.Phone +
					"&lastName=" + CustModel.SecondName;    //for CRQA
				//var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile?postalCode=" + CustModel.PostCode + "&phone=" + CustModel.Phone +
				//	"&lastName=" + CustModel.SecondName;	//for CRDEV
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTO GENERATED BY CONFLICT EXTENSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> develop
				//lastName=" + CustModel.Name;
				var msg1 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("msgcustomer1");

				if (RSOB_controller.flagInvalidPCode == true && RSOB_controller.flagInvalidPhone == false) {

					var errMsg1 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorPostalCode");
					sap.m.MessageBox.show(errMsg1, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (RSOB_controller.flagInvalidPCode == false && RSOB_controller.flagInvalidPhone == true) {

					var errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorPhone");
					sap.m.MessageBox.show(errMsg2, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (RSOB_controller.flagInvalidPCode == true && RSOB_controller.flagInvalidPhone == true) {

					var errMsg3 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorPhonePostalCode");
					sap.m.MessageBox.show(errMsg3, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else if (RSOB_controller.flagInvalidName == true) {
					var errMsg3 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorName");
					sap.m.MessageBox.show(errMsg3, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				} else {

					oBusyDialog.open();
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
							}, {
								"localNumber": CustModel.Phone.substr(3, 7),
								"areaCode": CustModel.Phone.substr(0, 3),
								"useCode": "MOBILE"
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
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<AUTO GENERATED BY CONFLICT EXTENSION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TCI2
						url: '/node/authproxy/acpt/api/v1.0/customer/custupdate/customerProfile',
====================================AUTO GENERATED BY CONFLICT EXTENSION====================================
						url: 'https://dealerapps.qa.toyota.ca/authproxy/qa/api/v1.0/customer/custupdate/customerProfile', //for CRQA
						//	url: '/node/tci/internal/api/v1.0/customer/custupdate/customerProfile', //for CRDEV
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTO GENERATED BY CONFLICT EXTENSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> develop
						headers: {
							accept: 'application/json',
							'x-ibm-client-secret': 'xN0dT3sM2mI2lT7pC0sQ2eA4hL0dH7dK4rH1hA3rU7fF8fL5iU', //for CRQA
							'x-ibm-client-id': '7c9739e8-ae0a-4df4-8efc-be95dd399c77',                   //for CRQA
							// 'x-ibm-client-secret': 'D1qR2eO3hV4wR6sM8fB2gU5aE0fQ0iM7iJ4pU6iM0gQ1dF0yV1',
							// 'x-ibm-client-id': 'a73cc0ac-1106-40e4-95a4-6d8f9184387e',
							'x-ibm-client-secret':'gO3aB8wM7wU3lA7tJ1sJ0bM8wD5pY0yG4aW0nH5xF3bJ5eS7fN', 
							'x-ibm-client-id':'7e6caee3-c465-4134-a86d-dd26e123b52b', 
							'content-type': 'application/json'
						},
						type: "POST",
						dataType: "json",
						data: zdataString,
						success: function (data, textStatus, jqXHR) {
							submitBtn.setEnabled(true);
							oBusyDialog.close();
							if (data.customer) {
								RSOB_controller.validateFlagB = true;
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

							submitBtn.setEnabled(false);
							var msgNew = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorCDMS");
							sap.m.MessageBox.show({
								icon: sap.m.MessageBox.Icon.ERROR,
								title: msgNew,
								actions: sap.m.MessageBox.Action.OK,
								onClose: null,
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});

						}
					});
				}

			} else {
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
				var errForm = formatter.formatErrorType("SO000023");
				errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			}
		},

		/************** End of DMND0003108 ****************************/
		_onSubmit: function () {
			var flag1 = false;
			var flag2 = false;
			var errMsg2;
			var errMsg;
			// var Zzmoyr = RSOB_controller.getView().byId("modelYr_RSOB").getValue();
			// var Zzseries = RSOB_controller.getView().byId("series_RSOB").getSelectedKey();
			// var Zzmodel = RSOB_controller.getView().byId("model_RSOB").getSelectedKey();
			// var Zzsuffix = RSOB_controller.getView().byId("Suffix_RSOB").getSelectedKey();
			// var Zzapx = RSOB_controller.getView().byId("Apx_RSOB").getSelectedKey();
			// var Zzextcol = RSOB_controller.getView().byId("Colour_RSOB").getSelectedKey();
			var valSalesType = RSOB_controller.getView().byId("SalesType_RSOB").getValue();
			var valContractDate = RSOB_controller.getView().byId("ContractDate_RSOB").getValue();
			var valAddress = RSOB_controller.getView().byId("Address_RSOB").getValue();
			var valCity = RSOB_controller.getView().byId("City_RSOB").getValue();
			var valProvince = RSOB_controller.getView().byId("Province_RSOB").getValue();
			var valPostalCode = RSOB_controller.getView().byId("PostalCode_RSOB").getValue();
			// var valLicense = RSOB_controller.getView().byId("License_RSOB").getValue();
			var valCustName = RSOB_controller.getView().byId("CustName_RSOB").getValue(); ///RSOA here, check 
			var CustModel = RSOB_controller.getView().getModel('Customer').getData();
			if (valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valCustName == "") {
				flag1 = true;

			}
			if (RSOB_controller.validateFlagB == false) {
				flag2 = true;
			}
			if (flag1 == true && flag2 == false) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");

				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				// var errForm2 = formatter.formatErrorType("SO00004");
				// errMsg2 = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg; //+ "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, errTitle, sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				var zvechile_model = RSOB_controller.getView().getModel('RSOB_Model').getData();
				var ZcontractDate1 = RSOB_controller.getView().byId("ContractDate_RSOB").getValue();
				var ZsalesType = RSOB_controller.getView().byId("SalesType_RSOB").getSelectedKey();
				var ZtcciNum = RSOB_controller.getView().byId("tcciNo_RSOB").getValue();
				var Zsalesperson = RSOB_controller.getView().byId("salesperson_RSOB").getValue();
				var Zsalesmanager = RSOB_controller.getView().byId("salesMan_RSOB").getValue();
				var ZtradeModelYr = RSOB_controller.getView().byId("trademodelYear_RSOBid").getValue();
				var ZtradeModel = RSOB_controller.getView().byId("trademodel_RSOBid").getValue();
				var ZtradeMake = RSOB_controller.getView().byId("tradeInMakeYear_RSOBid").getSelectedKey();
				var comment = RSOB_controller.getView().byId("Comment").getValue();
				var host = RSOB_controller.host();
				var Zzmoyr = RSOB_controller.getView().byId("modelYr_RSOB").getText();
				var Zzseries = RSOB_controller.getView().byId("series_RSOB").getSelectedKey();
				var Zzmodel = RSOB_controller.getView().byId("model_RSOB").getSelectedKey();
				var Zzsuffix = RSOB_controller.getView().byId("suffix_CSOR").getSelectedKey();
				var Zzapx = RSOB_controller.getView().byId("apx_RSOB").getSelectedKey();
				var Zzextcol = RSOB_controller.getView().byId("colour_RSOB").getSelectedKey();
				// SOcreateSet;
				var oURL = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet";
				//var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;     ---------- Code replication same as QA
				var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
				var _data = {
					"ZzsoReqNo": "SO",
					"Zzmodel": Zzmodel, //"YZ3DCT",
					"Zzmoyr": Zzmoyr, //"2018",
					"Zzseries": Zzseries,
					"Zzsuffix": Zzsuffix, //"ML",
					"Zzextcol": Zzextcol, //"01D6",
					"Zzapx": Zzapx, // "00",
					"ZzreqEtaFrom": zdateFormat.format(zvechile_model.fromdate), //null,
					"ZzreqEtaTo": zdateFormat.format(zvechile_model.todate), //null,
					"Zzvtn": zvechile_model.vtnn,
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
				var dataString = JSON.stringify(
					_data
				);
				// refresh token if it is not there 
				if (!this.getOwnerComponent().getModel("mainservices").getSecurityToken()) {
					this.getOwnerComponent().getModel("mainservices").refreshSecurityToken();
				}
				this.getOwnerComponent().getModel("mainservices").create('/Retail_Sold_OrderSet', _data, {
					success: function (data, oResponse) {
						if (data.ZzsoReqNo) {
							RSOB_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
								Soreq: data.ZzsoReqNo
							}, true);
						}

					},
					error: function (oData, oResponse) {
						var message = "";
						if (oData.responseText) {
							if (JSON.parse(oData.responseText).error.innererror.errordetails) {
								message = JSON.parse(oData.responseText).error.innererror.errordetails;
							}

							sap.m.MessageBox.show(JSON.parse(oData.responseText).error.message.value, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: errTitle,
								actions: [sap.m.MessageBox.Action.CLOSE],
								details: message

							});
						}
					}
				});

			}
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
			var series = this.getView().byId('series_RSOB').getSelectedKey();
			var modelyear = this.getView().byId('modelYr_RSOB').getValue();

			if (series && modelyear) {
				var modelCB = this.getView().byId("model_RSOB");
				var suffixCB = this.getView().byId("Suffix_CSOR");
				var apxCB = this.getView().byId("Apx_RSOB");
				var colorCB = this.getView().byId("Colour_RSOB");
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				// var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						// new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: "{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
					})
				});
				// var items_binding = this.getView().byId('model_RSOB').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
			// var items_binding = this.getView().byId('model_RSOB').getBinding('items');
			//  items_binding.filter(new sap.ui.model.Filter("Modelyear", sap.ui.model.FilterOperator.EQ, Oevent.getSource().getYear()));
			this._oPopover.close();
		},
		series_selected: function (oEvent) {
			// RSOB_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");

			// var year = this.getView().byId('modelYr_RSOB').getValue();
			// items="{ path: 'oModel3>/'}"
			var modelyear = this.getView().byId('modelYr_RSOB').getText();
			var model;
			// var language = RSOB_controller.returnBrowserLanguage();

			if (language === "FR") {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			} else {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			}
			var series = this.getView().byId('series_RSOB').getSelectedKey();
			if (series && modelyear) {
				var modelCB = this.getView().byId("model_RSOB");

				// var dealer = RSOB_controller.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						// new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = this.getView().byId('model_RSOB').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
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
			// var items_binding = this.getView().byId('model_RSOB').getBinding('items');
			//  items_binding.filter(new sap.ui.model.Filter("Modelyear", sap.ui.model.FilterOperator.EQ, Oevent.getSource().getYear()));
			this._oPopover1.close();
		},
		initailyear1: function (oEvent) {
			oEvent.getSource().getContent()[0]._oMaxDate._oUDate.oDate = new Date();
			oEvent.getSource().getContent()[0].setDate(new Date());
		},
		stype_change: function (Oevent) {
			if (Oevent.getParameters().selectedItem.getKey() == "1") {
				RSOB_controller.getView().byId("tcciNo_RSOB").setValue("N/A");
				RSOB_controller.getView().byId("tcciNo_RSOB").setEnabled(false);
				// tcciNo_RSOB
			} else {
				RSOB_controller.getView().byId("tcciNo_RSOB").setValue("");
				RSOB_controller.getView().byId("tcciNo_RSOB").setEnabled(true);
			}

		},
		validPostalCode: function (postalCode) {
			if (postalCode) {
				postalCode = postalCode.getParameters().newValue;
				var postalRegEx = new RegExp(/^[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/m);
				if (postalRegEx.test(postalCode) == true) {
					RSOB_controller.getView().byId("PostalCode_RSOB").setValueState("None");
					RSOB_controller.flagInvalidPCode = false;
					return postalCode;
				} else {
					RSOB_controller.getView().byId("PostalCode_RSOB").setValueState("Error");
					RSOB_controller.flagInvalidPCode = true;
					return null;
				}
			}
		},
		validPhoneNum: function (phoneNum) {
			if (phoneNum) {
				phoneNum = phoneNum.getParameters().newValue;
				var phoneregEx = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
				if (phoneregEx.test(phoneNum) == true) {
					RSOB_controller.getView().byId("Phone_RSOB").setValueState("None");
					RSOB_controller.flagInvalidPhone = false;
					return phoneNum;
				} else {
					RSOB_controller.getView().byId("Phone_RSOB").setValueState("Error");
					RSOB_controller.flagInvalidPhone = true;
					return null;
				}
			}
		},
		_handleServiceSuffix_Series: function () {
			var host = RSOB_controller.host();
			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					RSOB_controller.getView().setModel(oModel, "seriesModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");

					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = this.getView().byId('model_RSOB').getSelectedKey();
			// var language = RSOB_controller.returnBrowserLanguage();
			var modelyear = this.getView().byId('modelYr_RSOB').getText();
			var suf;
			if (language === "FR") {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			} else {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			// var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

			if (model && modelyear) {
				// var suffixCB = this.getView().byId("Suffix_CSO");

				// var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('suffix_CSOR').bindItems('oModel1>/', new sap.ui.core.ListItem({
				// 	key: "{oModel1>Suffix}",
				// 	text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel2>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
				// }));
				this.getView().byId('suffix_CSOR').bindItems({
					path: "mainservices>/ZVMS_SUFFIX_PIPLINE",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						// new sap.ui.model.Filter("brand", sap.ui.model.FilterOperator.EQ, RSOB_controller.brand),
						new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, RSOB_controller.suffixkey)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						text: suf
					})
				});
				// var items_binding = this.getView().byId('suffix_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
			}
		},
		/********************************Begin of DMND0003108******************************/

		validateName: function (oEvt) {
			var name = "";
			if (oEvt) {
				name = oEvt.getParameters().newValue;
				var nameRegExp = new RegExp(/^[ a-zA-Z]+$/);
				if (nameRegExp.test(name) == true) {
					oEvt.getSource().setValueState("None");

				} else {
					oEvt.getSource().setValueState("Error");

					name = null;
				}

			}

			if (RSOB_controller.getView().byId("CustName_RSOB").getValueState() == "None" && RSOB_controller.getView().byId("CustName_SSOB").getValueState() ==
				"None") {
				RSOB_controller.flagInvalidName = false;
			} else {
				RSOB_controller.flagInvalidName = true;
			}
			return name;
		},

		/********************************End of DMND0003108********************************/

		suffix_selected: function (oEvent) {
			//-----------------
			//----APX---------
			//----------------
			//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
			var suffix = this.getView().byId('suffix_CSOR').getSelectedKey();
			var modelyear = this.getView().byId('modelYr_RSOB').getText();

			var model = this.getView().byId('model_RSOB').getSelectedKey();
			if (model && modelyear && suffix) {
				// var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('apx_CSOR').bindItems('mode_Model>/', new sap.ui.core.ListItem({
				// 	key: "{mode_Model>zzapx}",
				// 	text: "{mode_Model>zzapx}"
				// }));
				this.getView().byId('apx_RSOB').bindItems({
					path: 'mainservices>/ZVMS_CDS_APX',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>zzapx}",
						text: "{mainservices>zzapx}"
					})
				});
				// var items_binding = this.getView().byId('apx_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
				//-----------------
				//----Color---------
				//----------------
				// this.getView().byId('colour_CSOR').bindItems('oModel2>/', new sap.ui.core.ListItem({
				// 	key: "{oModel2>ExteriorColorCode}",
				// 	text: "{parts: [{path:'oModel2>ExteriorColorCode'},{path:'oModel2>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
				// }));
				var color;
				// var language = RSOB_controller.returnBrowserLanguage();
				if (language === "FR") {
					color = "{mainservices>ext}/{mainservices>mktg_desc_fr}";
				} else {
					color = "{mainservices>ext}/{mainservices>mktg_desc_en}";
				}
				this.getView().byId('colour_RSOB').bindItems({
					path: 'mainservices>/ZVMS_CDS_Colour',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>ext}",
						text: color
					})
				});
				// var items_binding = this.getView().byId('colour_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		}

	});

});