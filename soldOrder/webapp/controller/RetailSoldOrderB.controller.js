sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, Filter, FilterOperator, JSONModel) {
	"use strict";
	var RSOB_controller, Zcustomer_No, input_ref;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderB", {
		formatter: formatter,

		onInit: function () {
			RSOB_controller = this;
			RSOB_controller.getBrowserLanguage();
			RSOB_controller.validateFlagB = false;
			var model = new JSONModel({});
			RSOB_controller.getView().setModel(model, 'Customer');
			this.getOwnerComponent().getRouter().getRoute("RetailSoldOrderB").attachPatternMatched(this._getattachRouteMatched, this);
			// RSOB_controller._handleRSADropDown();
		},
		onBeforeRendering: function () {
			// console.log(RSOB_controller.getView().byId("form1_RSOB").getTitle());
			RSOB_controller.getView().byId("form1_RSOB").destroyTitle();
			RSOB_controller.getView().byId("form2_RSOB").destroyTitle();
		},
		_handleRSADropDown: function () {
			var host = RSOB_controller.host();
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
					RSOB_controller.getView().setModel(oModel, "mode_Model");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_getattachRouteMatched: function (parameters) {
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var values = {};
			if (parameters.getParameters().arguments.modelyear) {
				values.modelyear = parameters.getParameters().arguments.modelyear;
			}
			if (parameters.getParameters().arguments.modelkey) {
				values.modelkey = parameters.getParameters().arguments.modelkey;
				var model_RSOB_items = RSOB_controller.getView().byId("model_RSOB").getBinding("items");
				model_RSOB_items.filter([new Filter("Model", FilterOperator.EQ, values.modelkey)]);
			}
			if (parameters.getParameters().arguments.serieskey) {
				values.serieskey = parameters.getParameters().arguments.serieskey;
			}
			if (parameters.getParameters().arguments.suffixkey) {
				values.suffixkey = parameters.getParameters().arguments.suffixkey;
				var suffix_RSOB_items = RSOB_controller.getView().byId("suffix_RSOB").getBinding("items");
				suffix_RSOB_items.filter([new Filter("Suffix", FilterOperator.EQ, values.suffixkey)]);
			}
			if (parameters.getParameters().arguments.apxkey) {
				values.apxkey = parameters.getParameters().arguments.apxkey;
				var apx_RSOB_items = RSOB_controller.getView().byId("apx_RSOB").getBinding("items");
				apx_RSOB_items.filter([new Filter("zzapx", FilterOperator.EQ, values.apxkey)]);
			}
			if (parameters.getParameters().arguments.colorkey) {
				values.colorkey = parameters.getParameters().arguments.colorkey;
				var color_RSOB_items = RSOB_controller.getView().byId("colour_RSOB").getBinding("items");
				color_RSOB_items.filter([new Filter("ExteriorColorCode", FilterOperator.EQ, values.colorkey)]);
			}
			if (parameters.getParameters().arguments.vtnn) {
				values.vtnn = parameters.getParameters().arguments.vtnn;
			}
			if (parameters.getParameters().arguments.fromdate) {
				values.fromdate = zdateFormat.parse(parameters.getParameters().arguments.fromdate);
			}
			if (parameters.getParameters().arguments.todate) {
				values.todate = zdateFormat.parse(parameters.getParameters().arguments.todate);
			}
			RSOB_controller.getView().setModel(new JSONModel(values), "RSOB_Model");

		},
		getSO: function () {
			var host = RSOB_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?sap-client=200&$format=json";
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
		onValidateCustomer: function () {
				var CustModel = RSOB_controller.getView().getModel('Customer').getData();
			if (CustModel.Name != '' && CustModel.Name && CustModel.Phone != '' && CustModel.Phone && CustModel.City != '' && CustModel.City
			&& CustModel.Province != '' && CustModel.Province && CustModel.Address != '' && CustModel.Address) {
			var errMsg = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText("error1");
			var title = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText("title5");
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
		
			var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile?phone=" + CustModel.Phone;
			
			//lastName=" + CustModel.Name;
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
						Zcustomer_No = data.customers[0].partyID;//customerNumber;
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
								"localNumber": CustModel.Phone.substr(3, 7),
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
							if (data.customer) {
								Zcustomer_No = data.customer.partyID;//customerNumber;
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
			RSOB_controller.validateFlagB = true;
			}else{
					sap.m.MessageBox.show("Please Fill all Customer Fields", sap.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		},

		_onSubmit: function () {
			var flag1 = false;
			var flag2 = false;
			var errMsg2;
			var errMsg;
			var valSalesType = RSOB_controller.getView().byId("SalesType_RSOB").getValue();
			var valContractDate = RSOB_controller.getView().byId("ContractDate_RSOB").getValue();
			var valAddress = RSOB_controller.getView().byId("Address_RSOB").getValue();
			var valCity = RSOB_controller.getView().byId("City_RSOB").getValue();
			var valProvince = RSOB_controller.getView().byId("Province_RSOB").getValue();
			var valPostalCode = RSOB_controller.getView().byId("PostalCode_RSOB").getValue();
			var valLicense = RSOB_controller.getView().byId("License_RSOB").getValue();
			var valCustName = RSOB_controller.getView().byId("CustName_RSOB").getValue();
			if (valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valLicense == "" || valCustName == "") {
				flag1 = true;

			} 
			if (RSOB_controller.validateFlagB == false) {
				flag2 = true;
			} 
			if (flag1 == true && flag2 == false) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				// var errForm2 = formatter.formatErrorType("SO00004");
				// errMsg2 = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg ;//+ "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
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
					"Zzmodel": zvechile_model.modelkey, //"YZ3DCT",
					"Zzmoyr": zvechile_model.modelyear, //"2018",
					"Zzseries": zvechile_model.serieskey,
					"Zzsuffix": zvechile_model.suffixkey, //"ML",
					"Zzextcol": zvechile_model.colorkey, //"01D6",
					"Zzapx": zvechile_model.apxkey, // "00",
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
					"Zzendcu": Zcustomer_No
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
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE],
								details: message

							});
						}
						// sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						// 	.m
						// 	.MessageBox.Action.OK, null, null);
					}
				});
				// $.ajax({
				// 	type: 'POST',
				// 	url: oURL,
				// 	cache: false,
				// 	data: dataString,
				// 	dataType: 'json',
				// 	headers: {
				// 		accept: 'application/json',
				// 		// 'x-ibm-client-secret': 'D1qR2eO3hV4wR6sM8fB2gU5aE0fQ0iM7iJ4pU6iM0gQ1dF0yV1',
				// 		// 'x-ibm-client-id': 'a73cc0ac-1106-40e4-95a4-6d8f9184387e',
				// 		'content-type': 'application/json'
				// 	},
				// 	success: function (data) {
				// 		// console.log(data);
				// 		// sap.m.MessageBox.show("Successfully Request Created", sap.m.MessageBox.Icon.SUCCESS, "Success", sap.m.MessageBox.Action.OK,
				// 		// 	null, null);
				// 		if (data.d.ZzsoReqNo) {
				// 			RSOB_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				// 				Soreq: data.d.ZzsoReqNo
				// 			}, true);
				// 		} //page 3
				// 	},
				// 	error: function (data) {
				// 		sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
				// 			.m
				// 			.MessageBox.Action.OK, null, null);
				// 	}

				// });
				//	RSOB_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder"); //page 3
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

	});

});