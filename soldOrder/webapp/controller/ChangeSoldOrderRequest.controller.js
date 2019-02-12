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
							var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile?customerNumber=" + zcustomerNumber;
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
										zcustomerModel.setData(data.customers[0]);
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
			var valModel = CSOR_controller.getView().byId("model_CSOR").getValue();
			var valSuffix = CSOR_controller.getView().byId("suffix_CSOR").getValue();
			var valApx = CSOR_controller.getView().byId("apx_CSOR").getValue();
			var valColour = CSOR_controller.getView().byId("colour_CSOR").getValue();
			var valFrom = CSOR_controller.getView().byId("etaFrom_CSOR").getValue();
			var valTo = CSOR_controller.getView().byId("etaTo_CSOR").getValue();
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
					var URI = "/Retail_Sold_OrderSet('" + zdata.ZzsoReqNo + "')";
					//	CSOR_controller.getView().getModel('mainservices').refreshSecurityToken();
					//Checking if there is no Token , it will refresh to get another one 
					if (!CSOR_controller.getView().getModel('mainservices').getSecurityToken()) {
						CSOR_controller.getView().getModel('mainservices').refreshSecurityToken();
					}
					CSOR_controller.getView().getModel('mainservices').update(URI, zdata, {
						success: function (data) {
							// sap.m.MessageBox.show("Sold Order Saved Successfully.", sap.m.MessageBox.Icon.SUCCESS, "Success",
							// 	sap.m.MessageBox.Action.OK, null, null);
							CSOR_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
								Soreq: requestid
							}, true);
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

			if (this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries')) {
				var series = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
				// this.getView().byId('model_CSOR').bindItems("oModel3>/", new sap.ui.core.ListItem({
				// 	key: "{oModel3>Model}",
				// 	text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
				// }));
				this.getView().byId('model_CSOR').bindItems({
					path: "VechileModel>/zc_model",
					filters: new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>Model}",
						text: "{parts: [{path:'VechileModel>Model'},{path:'VechileModel>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
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
					path: 'VechileModel>/zc_configuration',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>Suffix}",
						text: "{parts: [{path:'VechileModel>Suffix'},{path:'VechileModel>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
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
					path: 'VechileModel>/ZC_PIO_DIO',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>zzapx}",
						text: "{VechileModel>zzapx}"
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
				this.getView().byId('colour_CSOR').bindItems({path:'VechileModel>/zc_exterior_trim',
				filters:new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
					new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
					new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				], true),
				template:new sap.ui.core.ListItem({
					key: "{VechileModel>ExteriorColorCode}",
					text: "{parts: [{path:'VechileModel>ExteriorColorCode'},{path:'VechileModel>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
				})});
				// var items_binding = this.getView().byId('colour_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		}

	});

});