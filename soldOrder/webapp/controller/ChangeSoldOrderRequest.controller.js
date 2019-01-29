sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
		"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter,JSONModel) {
	"use strict";
	var CSOR_controller;
	var requestid,zcustomerModel;
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
						if (CSOR_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu')) {
							var zcustomerNumber = CSOR_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu');
							var url = "https://api.sit.toyota.ca/tci/internal/api/v1.0/customer/cdms/customers/profile?customerNumber=" +
								zcustomerNumber;
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
		}

	});

});