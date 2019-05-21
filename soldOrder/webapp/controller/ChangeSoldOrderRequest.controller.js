sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var CSOR_controller;
	var requestid, zcustomerModel;
	return BaseController.extend("toyota.ca.SoldOrder.controller.ChangeSoldOrderRequest", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.ChangeSoldOrderRequest
		 */
		onInit: function () {
			CSOR_controller = this;
			CSOR_controller.getBrowserLanguage();
			CSOR_controller._handleServiceSuffix_Series();
			// var today = new Date();
			// var day1 = new Date();
			// day1.setDate(today.getDate() + 1);
			// CSOR_controller.getView().byId("etaFrom_CSOR").setMinDate(day1);
			zcustomerModel = new JSONModel({});
			this.getView().setModel(zcustomerModel, 'Customer');
			CSOR_controller.getOwnerComponent().getRouter().getRoute("ChangeSoldOrderRequest").attachPatternMatched(this._getattachRouteMatched,
				this);

		},
		_getattachRouteMatched: function (parameters) {
			requestid = parameters.getParameters().arguments.Soreq;
			var sObjectPath = "/Retail_Sold_OrderSet('" + requestid + "')";
			this.getView().bindElement({
				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (OEvent) {
						//Filter Data Sold Order
						CSOR_controller.series_selected();
						CSOR_controller.model_selected();
						CSOR_controller.suffix_selected();
						//------------------------------------------
						if (CSOR_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu')) {
							var zcustomerNumber = CSOR_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu');
							var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber;
							// ?customerNumber=" + zcustomerNumber;
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
		},

		_handleChangeDate: function () {
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var etaFrom = CSOR_controller.getView().byId("etaFrom_CSOR").getValue();
			if (etaFrom !== "") {
				var CDate = zdateFormat.parse(etaFrom);
				var day5 = new Date();
				day5.setDate(CDate.getDate() + 5);
				CSOR_controller.getView().byId("etaTo_CSOR").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = CSOR_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
			// var etaFrom = CSOR_controller.getView().byId("etaFrom_CSOR").getValue();
			// if (etaFrom !== "") {
			// 	var CDate = new Date(etaFrom);
			// 	var day5 = CDate;
			// 	day5.setDate(CDate.getDate() + 5);
			// 	CSOR_controller.getView().byId("etaTo_CSOR").setMinDate(day5);
			// } else {
			// 	var errForm = formatter.formatErrorType("SO00002");
			// 	var errMsg = CSOR_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			// 	sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			// }
		},
		_onSubmit: function () {
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
			// var ZtcciNum = CSOR_controller.getView().byId("etaTo_CSOR").getValue();
			var Zsalesperson = CSOR_controller.getView().byId("salesPerson_CSOR").getText();
			var Zsalesmanager = CSOR_controller.getView().byId("salesManager_CSOR").getText();
			var ZtradeModelYr = CSOR_controller.getView().byId("tradeyr_CSOR").getText();
			var ZtradeModel = CSOR_controller.getView().byId("trademodel_CSOR").getText();
			var ZtradeMake = CSOR_controller.getView().byId("trademake_CSOR").getText();
			var comment = CSOR_controller.getView().byId("Comment").getValue();
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			var Zcustomer_fname = CSOR_controller.getView().byId("firstName").getText();
				var Zcustomer_lname = CSOR_controller.getView().byId("lastName").getText();
			var Zcustomer_address = CSOR_controller.getView().byId("address").getText();
			var Zcustomer_city = CSOR_controller.getView().byId("city").getText();
			var Zcustomer_province = CSOR_controller.getView().byId("province").getText();
			var Zcustomer_postalcode = CSOR_controller.getView().byId("postalCode").getText();
			var Zcustomer_phone = CSOR_controller.getView().byId("phone").getText();
			var Zcustomer_email = CSOR_controller.getView().byId("email").getText();
			// var Zcustomer_fname = CSOR_controller.getView().byId("etaTo_CSOR").getValue();
		
			
			
			
			var valDrive = CSOR_controller.getView().byId("drivelicense").getText();
			
			
			if (valModel == "" || valSuffix == "" || valApx == "" || valColour == "" || valFrom == "" || valTo == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = CSOR_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
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
				

				"ZzsoReqNo": "SO",
				"Zzmodel": valModel, //"YZ3DCT",
				"Zzmoyr": Zzmoyr, //"2018",
				"Zzseries": Zzseries,
				"Zzsuffix": valSuffix, //"ML",
				"Zzextcol": valColour, //"01D6",
				"Zzapx": valApx, // "00",
				"ZzreqEtaFrom": valFrom, //null,
				"ZzreqEtaTo": valTo, //null,
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
"City1":Zcustomer_city,
"Region":Zcustomer_province,
"PostCode1":Zcustomer_postalcode,
"TelNumber":Zcustomer_phone,
"SmtpAddr": Zcustomer_email,
"Qausp":valDrive
				// "Zzendcu": Zcustomer_No,
				// "ZdriverLiNum": valDrive
			};
					var URI = "/Retail_Sold_OrderSet";
					//	CSOR_controller.getView().getModel('mainservices').refreshSecurityToken();
					//Checking if there is no Token , it will refresh to get another one 
					if (!CSOR_controller.getView().getModel('mainservices').getSecurityToken()) {
						CSOR_controller.getView().getModel('mainservices').refreshSecurityToken();
					}
					CSOR_controller.getView().getModel('mainservices').create(URI, zdata, {
						success: function (data) {
							// sap.m.MessageBox.show("Sold Order Saved Successfully.", sap.m.MessageBox.Icon.SUCCESS, "Success",
							// 	sap.m.MessageBox.Action.OK, null, null);
								if (data.ZzsoReqNo) {
						CSOR_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
							Soreq: data.ZzsoReqNo
						}, true);
					}
						},
						error: function (data) {
							sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
								sap.m.MessageBox.Action.OK, null, null);
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

			if (this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries') && this.getView().getElementBinding(
					'mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var series = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('model_CSOR').bindItems("oModel3>/", new sap.ui.core.ListItem({
				// 	key: "{oModel3>Model}",
				// 	text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
				// }));
				this.getView().byId('model_CSOR').bindItems({
					path: "mainservices>/ZVMS_CDS_Model",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: "{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
					})
				});
				// var items_binding = this.getView().byId('model_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = this.getView().byId('model_CSOR').getSelectedKey();

			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('suffix_CSOR').bindItems('oModel1>/', new sap.ui.core.ListItem({
				// 	key: "{oModel1>Suffix}",
				// 	text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel2>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
				// }));
				this.getView().byId('suffix_CSOR').bindItems({
					path: 'mainservices>/ZVMS_CDS_SUFFIX',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						text: "{parts: [{path:'mainservices>suffix'},{path:'mainservices>option_1_desc_en'},{path:'mainservices>suffix_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}"
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
			var suffix = this.getView().byId('suffix_CSOR').getSelectedKey();

			var model = this.getView().byId('model_CSOR').getSelectedKey();
			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr') && suffix) {
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
						text: "{parts: [{path:'VechileModel>ExteriorColorCode'},{path:'VechileModel>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
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

	});

});