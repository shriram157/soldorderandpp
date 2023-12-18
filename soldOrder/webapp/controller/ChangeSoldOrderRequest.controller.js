sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var CSOR_controller;
	var requestid, zcustomerModel;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.ChangeSoldOrderRequest", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.ChangeSoldOrderRequest
		 */
		onInit: function () {
			CSOR_controller = this;
			// CSOR_controller.getBrowserLanguage();
			CSOR_controller._handleServiceSuffix_Series();
			// var today = new Date();
			// var day1 = new Date();
			// day1.setDate(today.getDate() + 1);
			// CSOR_controller.getView().byId("etaFrom_CSOR").setDateValue(day1);
			zcustomerModel = new JSONModel({});
			this.getView().setModel(zcustomerModel, 'Customer');
			CSOR_controller.getOwnerComponent().getRouter().getRoute("ChangeSoldOrderRequest").attachPatternMatched(this._getattachRouteMatched,
				this);

		},
		_getattachRouteMatched: function (parameters) {
			// var endDate = new Date();
			// var day5 = new Date();
			// var num = 0;
			// while (num < 5) {
			// 	endDate = new Date(day5.setDate(day5.getDate() + 1));
			// 	if (endDate.getDay() != 0 && endDate.getDay() != 6) {
			// 		num++;
			// 	}
			// }
			// //this.getView().byId("etaFrom_CSOR").setMinDate(day5);
			// this.getView().byId("etaFrom_CSOR").setDateValue(day5);
			requestid = parameters.getParameters().arguments.Soreq;
			var sObjectPath = "/Retail_Sold_OrderSet('" + requestid + "')";
			this.getView().bindElement({
				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (OEvent) {
						//Filter Data Sold Order
						CSOR_controller.byId("model_CSOR").setSelectedKey(CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty(
							"/Zzmodel"));
						CSOR_controller.series_selected();
						CSOR_controller.model_selected();
						CSOR_controller.suffix_selected();
						//------------------------------------------
						if (CSOR_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu')) {
							var zcustomerNumber = CSOR_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu');
							
							//	var url = "/node/api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber;
							var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber;  //for PROD
							//var url = "/node/authproxy/acpt/api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber; //for QA
							// ?customerNumber=" + zcustomerNumber;
							$.ajax({
								url: url,
								headers: {
									accept: 'application/json',
										// 'x-ibm-client-secret': 'Q7gP8pI0gU5eF8wM2jQ3gB8pQ5mA8rP8nO5dR1iY8qW2kS0wA0',
										// 'x-ibm-client-id': 'd4d033d5-c49e-4394-b3e3-42564296ec65'
									//	'x-ibm-client-secret':'gO3aB8wM7wU3lA7tJ1sJ0bM8wD5pY0yG4aW0nH5xF3bJ5eS7fN',  //for QA
									//	'x-ibm-client-id':'7e6caee3-c465-4134-a86d-dd26e123b52b',                   / for QA
										'content-type': 'application/json' 
								},
								type: "GET",
								dataType: "json",
								// data: soapMessage,
								contentType: "text/xml; charset=\"utf-8\"",
								success: function (data, textStatus, jqXHR) {
									if (data.customer) {
										zcustomerModel.setData(data.customer);
									}
								},
								error: function (request, errorText, errorCode) {}
							});
						}
					}
				}
			});
			/////////////// added by Minakshi for INCIDENT INC0187445 Start
			this.fnDateDisabled(this.getView().byId("etaFrom_CSOR"));
			this.fnDateDisabled(this.getView().byId("etaTo_CSOR"));
		},

		fnDateDisabled: function (id) {

			id.addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, id);
		},

		_handleChangeDate: function () {
			var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
			// Handle th Validation Date "YYYYMMdd"
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var etaFrom = CSOR_controller.getView().byId("etaFrom_CSOR").getValue();
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

				CSOR_controller.getView().byId("etaTo_CSOR").setDateValue(CDate);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap.m.MessageBox.Action.OK, null, null);
			}

		},

		_handleChange: function () {

			// Handle th Validation Date "YYYYMMdd"
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var etaFrom = CSOR_controller.getView().byId("etaFrom_CSOR").getValue();
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

				CSOR_controller.getView().byId("etaTo_CSOR").setDateValue(CDate);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap.m.MessageBox.Action.OK, null, null);
			}
		},

		/////////////////////////// INC0187445 Changes done by Minakshi on 25/03/2021 end

		_onSubmit: function () {

			var submitBtn = CSOR_controller.getView().byId("Btn_submit_CSOR");
			submitBtn.setEnabled(false);                                          //changes by swetha for Submit button for INC0241290 on 2nd Oct, 2023
			var valModel = CSOR_controller.getView().byId("model_CSOR").getSelectedKey();
			var valSuffix = CSOR_controller.getView().byId("suffix_CSOR").getSelectedKey();
			var valApx = CSOR_controller.getView().byId("apx_CSOR").getSelectedKey();
			var valColour = CSOR_controller.getView().byId("colour_CSOR").getSelectedKey();
			var valFrom = CSOR_controller.getView().byId("etaFrom_CSOR").getValue();
			var valTo = CSOR_controller.getView().byId("etaTo_CSOR").getValue();
			var Zzmoyr = CSOR_controller.getView().byId("moyr_CSOR").getText();
			var Zzseries = CSOR_controller.getView().byId("series_CSOR").getSelectedKey();
			var ZcontractDate1 = CSOR_controller.getView().byId("conDate_CSOR").getValue();
			var ZsalesType = CSOR_controller.getView().byId("salestype_CSOR").getSelectedKey();
			// INC0187445 fetching old sold order number to pass it to odata
			var oldSoldOrderNo = CSOR_controller.getView().byId("oldSoldOrderNo").getText();
			// var ZtcciNum = CSOR_controller.getView().byId("etaTo_CSOR").getValue();
			var Zsalesperson = CSOR_controller.getView().byId("salesPerson_CSOR").getText();
			var Zsalesmanager = CSOR_controller.getView().byId("salesManager_CSOR").getText();
			var ZtradeModelYr = CSOR_controller.getView().byId("tradeyr_CSOR").getText();
			var ZtradeModel = CSOR_controller.getView().byId("trademodel_CSOR").getText();
			var ZtradeMake = CSOR_controller.getView().byId("trademake_CSOR").getText();
			var comment = CSOR_controller.getView().byId("Comment").getValue();
			var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			var Zcustomer_fname = CSOR_controller.getView().byId("firstName").getText();
			var Zcustomer_lname = CSOR_controller.getView().byId("lastName").getText();
			var Zcustomer_address = CSOR_controller.getView().byId("address").getText();
			var Zcustomer_city = CSOR_controller.getView().byId("city").getText();
			var Zcustomer_province = CSOR_controller.getView().byId("province").getText();
			var Zcustomer_postalcode = CSOR_controller.getView().byId("postalCode").getText();
			var Zcustomer_phone = CSOR_controller.getView().byId("phone").getText();
			var Zcustomer_email = CSOR_controller.getView().byId("email").getText();
			// var Zcustomer_fname = CSOR_controller.getView().byId("etaTo_CSOR").getValue();
			var Zcustomer_No = CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/Zcustomer_No");
			var valDrive = CSOR_controller.getView().byId("drivelicense").getText();
			if (valModel == "" || valSuffix == "" || valApx == "" || valColour == "" || valFrom == "" || valTo == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				var ElementBinding = CSOR_controller.getView().getElementBinding("mainservices");
				if (ElementBinding.getBoundContext().getProperty()) {
					var zdata = ElementBinding.getBoundContext().getProperty();
					if (zdata.AttachmentSet) {
						delete zdata.AttachmentSet;
					}
					if (zdata.__metadata) {
						delete zdata.__metadata;
					}
					zdata = {

						"ZzsoReqNo": oldSoldOrderNo, //update old sold order INC0187445
						"Zzmodel": valModel, //"YZ3DCT",
						"Zzmoyr": Zzmoyr, //"2018",
						"Zzseries": Zzseries,
						"Zzsuffix": valSuffix, //"ML",
						"Zzextcol": valColour, //"01D6",
						"Zzapx": valApx, // "00",
						"ZzreqEtaFrom": valFrom + "T00:00:00", //null,
						"ZzreqEtaTo": valTo + "T00:00:00", //null,
						"ZcontractDate": ZcontractDate1, //null,
						"ZsalesType": ZsalesType, // "",
						// "ZtcciNum": ZtcciNum, // "",
						"Zsalesperson": Zsalesperson, // "",
						"Zsalesmanager": Zsalesmanager, //"",
						"ZtradeModelYr": ZtradeModelYr, // "",
						"ZtradeModel": ZtradeModel,
						"ZtradeMake": ZtradeMake, // ""
						"Comment": comment,
						"ZzdealerCode": dealer_no,
						"NameFirst": Zcustomer_fname,
						"NameLast": Zcustomer_lname,
						"Street": Zcustomer_address,
						"City1": Zcustomer_city,
						"Region": Zcustomer_province,
						"PostCode1": Zcustomer_postalcode,
						"TelNumber": Zcustomer_phone,
						"SmtpAddr": Zcustomer_email,
						"Qausp": valDrive,
						"Zzendcu": Zcustomer_No,
						"ZzcancelComment": CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
						"ZzcancelRsn": CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val")
							// "ZdriverLiNum": valDrive
					};
					var URI = "/Retail_Sold_OrderSet";
					//	CSOR_controller.getView().getModel('mainservices').refreshSecurityToken();
					//Checking if there is no Token , it will refresh to get another one 
					if (!CSOR_controller.getView().getModel('mainservices').getSecurityToken()) {
						CSOR_controller.getView().getModel('mainservices').refreshSecurityToken();
					}

					CSOR_controller.getView().getModel('mainservices').callFunction("/RSO_Change", {
						method: "POST",
						urlParameters: {
							Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
							Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
							// Request_Type: reqTypeId_SOCR_val,
							ZzsoReqNo: requestid
						}, // function import parameters
						success: function (data, response) {
							if (data.Type == 'E') {
								sap.m.MessageBox.show(data.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
									.MessageBox.Action.OK, null, null);
							} else {
								CSOR_controller.getView().getModel('mainservices').create(URI, zdata, {
									success: function (data) {
										// sap.m.MessageBox.show("Sold Order Saved Successfully.", sap.m.MessageBox.Icon.SUCCESS, "Success",
										// 	sap.m.MessageBox.Action.OK, null, null);

										submitBtn.setEnabled(true);                                 //changes by Swetha for INC0241290 on 2nd Oct, 2023
										if (data.ZzsoReqNo) {

											CSOR_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
												Soreq: data.ZzsoReqNo
											}, true);
										}
									},
									error: function (data) {
										sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
											"Error",
											sap.m.MessageBox.Action.OK, null, null);
									}
								});
							}
							// else {
							// 	CSOR_controller.getOwnerComponent().getRouter().navTo("ChangeSoldOrderRequest", {
							// 		Soreq: requestid
							// 	}, true); //page8
							// }
						},
						error: function (oData, oResponse) {
							sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
								.MessageBox.Action.OK, null, null);
						}
					});

				}
			}
		},
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------
		series_selected: function (oEvent) {

			// var year = this.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"
			var model;
			// var language = CSOR_controller.returnBrowserLanguage();

			if (language === "FR") {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			} else {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			}
			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

			if (this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries') && this.getView().getElementBinding(
					'mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var series = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('model_CSOR').bindItems("oModel3>/", new sap.ui.core.ListItem({
				// 	key: "{oModel3>Model}",
				// 	text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
				// }));
				this.getView().byId('model_CSOR').bindItems({
					path: "mainservices>/ZVMS_Model_EXCLSet",
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
				// var items_binding = this.getView().byId('model_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')

			///code added on 07/09/2022 to get brand
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
			// end of brand
			var model = this.getView().byId('model_CSOR').getSelectedKey();
			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var pathAB = "";
			var suf;

			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('suffix_CSOR').bindItems('oModel1>/', new sap.ui.core.ListItem({
				// 	key: "{oModel1>Suffix}",
				// 	text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel2>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
				// }));

				//Changes done by Minakshi on 25/03/2021 INC0187445 start
				if (oEvent != undefined) {
					this.getView().byId("suffix_CSOR").setSelectedKey("");
					this.getView().byId("colour_CSOR").setSelectedKey("");
					this.getView().byId("apx_CSOR").setSelectedKey("");
				}

				if (CSOR_controller.RSOA == true) {
					pathAB = "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "',typ='R')/Set";
				} else {
					pathAB = "mainservices>/ZVMS_SUFFIX_PIPLINE";
				}

				if (language === "FR") {
					suf =
						"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

				} else {
					suf =
						"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

				}

				//Changes done by Minakshi on 25/03/2021 INC0187445 end
				this.getView().byId('suffix_CSOR').bindItems({
					//		path: "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "')/Set",
					path: "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "',typ='R')/Set",
					//path: pathAB,
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("brand", sap.ui.model.FilterOperator.EQ, brand)
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
		suffix_selected: function (oEvent) {
			//-----------------
			//----APX---------
			//----------------
			//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
			let suffix = this.getView().byId('suffix_CSOR').getSelectedKey();

			let model = this.getView().byId('model_CSOR').getSelectedKey();
			let color;
			if (language === "FR") {
				color = "{VechileModel>ExteriorColorCode}/{VechileModel>MarketingDescriptionEXTColorFR}";
			} else {
				color = "{VechileModel>ExteriorColorCode}/{VechileModel>MarketingDescriptionEXTColorEN}";
			}

			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr') && suffix) {
				//Changes done by Minakshi on 25/03/2021 INC0187445 start
				if (oEvent != undefined) {
					this.getView().byId("colour_CSOR").setSelectedKey("");
					this.getView().byId("apx_CSOR").setSelectedKey("");
				}
				//Changes done by Minakshi on 25/03/2021 INC0187445 end

				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('apx_CSOR').bindItems('mode_Model>/', new sap.ui.core.ListItem({
				// 	key: "{mode_Model>zzapx}",
				// 	text: "{mode_Model>zzapx}"
				// }));
				this.getView().byId('apx_CSOR').bindItems({
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
				this.getView().byId('colour_CSOR').bindItems({
					path: 'VechileModel>/zc_exterior_trim',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>ExteriorColorCode}",
						text: color
					})
				});

				// var items_binding = this.getView().byId('colour_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		},
		_handleServiceSuffix_Series: function () {
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
			var host = CSOR_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					CSOR_controller.getView().setModel(oModel, "seriesModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		onNavBack: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("SoldOrderChangeReason", {
				Soreq: requestid
			}, true);
		}

	});

});