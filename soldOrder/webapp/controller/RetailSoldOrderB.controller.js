sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";
	var RSOB_controller, Zcustomer_No;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderB", {
		formatter: formatter,

		onInit: function () {
			RSOB_controller = this;
			RSOB_controller.getBrowserLanguage();
			RSOB_controller.validateFlagB = false;
			var model = new JSONModel({});
			RSOB_controller.getView().setModel(model, 'Customer');
			RSOB_controller.getSO();
		},
		onBeforeRendering: function () {
			// console.log(RSOB_controller.getView().byId("form1_RSOB").getTitle());
			RSOB_controller.getView().byId("form1_RSOB").destroyTitle();
			RSOB_controller.getView().byId("form2_RSOB").destroyTitle();
		},
		getSO: function () {
			var host = RSOB_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?sap-client=200&$format=json";
			//---------------------------------------------------------------------------------------------------------
			//--------------Mock Data for Vechile Information till make integration with PipeLine App------------------
			//---------------------------------------------------------------------------------------------------------
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000112'&$format=json";
			 RSOB_controller.getView().getModel('mainservices').read("/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000112'", {
                success : function(oData) {
                        RSOB_controller.getView().setModel(new JSONModel(oData.results[0]), "RSOB_Model");
                },
                error : function(Oerror){}
			 });
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
			var CustModel = RSOB_controller.getView().getModel('Customer').getData();
			var url = "https://api.sit.toyota.ca/tci/internal/api/v1.0/customer/cdms/customers/profile?lastName=" + CustModel.Name;
			//+ "&phone=" +CustModel.Phone;
			$.ajax({
				url: url,
				headers: {
					accept: 'application/json',
					'x-ibm-client-secret': 'Q7gP8pI0gU5eF8wM2jQ3gB8pQ5mA8rP8nO5dR1iY8qW2kS0wA0',
					'x-ibm-client-id': 'd4d033d5-c49e-4394-b3e3-42564296ec65'
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
								"localNumber": CustModel.Phone,
								"areaCode": "(416)",
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
						url: 'https://api.sit.toyota.ca/tci/internal/api/v1.0/customer/custupdate/oicc/profileChange',
						headers: {
							accept: 'application/json',
							'x-ibm-client-secret': 'D1qR2eO3hV4wR6sM8fB2gU5aE0fQ0iM7iJ4pU6iM0gQ1dF0yV1',
							'x-ibm-client-id': 'a73cc0ac-1106-40e4-95a4-6d8f9184387e',
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
			RSOB_controller.validateFlagB = true;
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

			} else if (RSOB_controller.validateFlagB == false) {
				flag2 = true;

			} else if (flag1 == true && flag2 == false) {
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
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				var zvechile_model = RSOB_controller.getView().getModel('RSOB_Model').getData();
				var ZcontractDate1 = RSOB_controller.getView().byId("ContractDate_RSOB").getValue();
				var ZsalesType = RSOB_controller.getView().byId("SalesType_RSOB").getSelectedKey();
				var ZtcciNum = RSOB_controller.getView().byId("tcciNo_RSOB").getValue();
				var Zsalesperson = RSOB_controller.getView().byId("salesperson_RSOB").getValue();
				var Zsalesmanager = RSOB_controller.getView().byId("salesMan_RSOB").getValue();
				var ZtradeModelYr = RSOB_controller.getView().byId("trademodelYear_RSOBid").getSelectedKey();
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
					"Zzmodel": zvechile_model.Zzmodel, //"YZ3DCT",
					"Zzmoyr": zvechile_model.Zzmoyr, //"2018",
					"Zzseries": zvechile_model.Zzseries,
					"Zzsuffix": zvechile_model.Zzsuffix, //"ML",
					"Zzextcol": zvechile_model.Zzextcol, //"01D6",
					"Zzapx": zvechile_model.Zzapx, // "00",
					"ZzreqEtaFrom": zvechile_model.ZzreqEtaFrom1, //null,
					"ZzreqEtaTo": zvechile_model.ZzreqEtaTo1, //null,
					"Zzvtn": zvechile_model.Zzvtn,
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

				$.ajax({
					type: 'POST',
					url: oURL,
					cache: false,
					data: dataString,
					dataType: 'json',
					success: function (data) {
						// console.log(data);
						// sap.m.MessageBox.show("Successfully Request Created", sap.m.MessageBox.Icon.SUCCESS, "Success", sap.m.MessageBox.Action.OK,
						// 	null, null);
						if (data.d.ZzsoReqNo) {
							RSOB_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
								Soreq: data.d.ZzsoReqNo
							}, true);
						} //page 3
					},
					error: function (data) {
						sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m
							.MessageBox.Action.OK, null, null);
					}

				});
			//	RSOB_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder"); //page 3
			}
		}

	});

});