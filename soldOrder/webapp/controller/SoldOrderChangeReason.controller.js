sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var SOCR_controller;
	var requestid;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.SoldOrderChangeReason", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.SoldOrderChange
		 */
		onInit: function () {
			SOCR_controller = this;
			// SOCR_controller.getBrowserLanguage();
			SOCR_controller.getOwnerComponent().getRouter().getRoute("SoldOrderChangeReason").attachPatternMatched(this._getattachRouteMatched,
				this);
			var Obj;
			var changeReasonModel = new sap.ui.model.json.JSONModel();
			//sap.ui.getCore().getModel("i18n").getProperty("/Lang");
			if (language == "EN") {
				Obj = {

					"CancellationReason": [{
						"key": "1",
						"text": "Customer Cancelled"
					}, {
						"key": "2",
						"text": "Customer Changed Vehicle"
					}, {
						"key": "3",
						"text": "Others"
					}],

				};
			} else {
				Obj = {

					"CancellationReason": [{
						"key": "1",
						"text": "Client annulé"
					}, {
						"key": "2",
						"text": "Véhicule changé par le client"
					}, {
						"key": "3",
						"text": "Autres"
					}],

				};
			}

			changeReasonModel.setData(Obj);
			changeReasonModel.updateBindings(true);
			sap.ui.getCore().setModel(changeReasonModel, "changeReasonModel");
			this.getView().setModel(sap.ui.getCore().getModel("changeReasonModel"), "changeReasonModel");
			console.log(sap.ui.getCore().getModel("changeReasonModel"));
		},
		_getattachRouteMatched: function (parameters) {
			requestid = parameters.getParameters().arguments.Soreq;
			var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var sRecipient = requestid; // SOCR_controller.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("soldOrderReqTitle", [sRecipient]);
			SOCR_controller.getView().byId("label_SoldOrderid").setText(sMsg);
		},
		onAfterRendering: function () {

		},

		UpdateSoldOrderRequest: function () {
			var resonCancelId_val = SOCR_controller.getView().byId("resonCancelId").getValue();
			var comment_ch_res = SOCR_controller.getView().byId("comment_ch_res").getValue();
			// var reqTypeId_SOCR_val = SOCR_controller.getView().byId("reqTypeId_SOCR").getValue();
			var cbVal = SOCR_controller.getView().byId("resonCancelId").getSelectedKey();
			// if (cbVal == 2) {
			// 	SOCR_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_DealerInventory", {
			// 	Soreq: requestid
			// }, true); 
			// } else if (cbVal == 1 || cbVal == 3) {
			SOCR_controller.getView().getModel('mainservices').callFunction("/RSO_Change", {
				method: "POST",
				urlParameters: {
					Reason: resonCancelId_val,
					Reason_comment: comment_ch_res,
					// Request_Type: reqTypeId_SOCR_val,
					ZzsoReqNo: requestid
				}, // function import parameters
				success: function (data, response) {
					if (data.Type == 'E') {
						sap.m.MessageBox.show(data.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
							.MessageBox.Action.OK, null, null);
					} else {
						SOCR_controller.getOwnerComponent().getRouter().navTo("ChangeSoldOrderRequest", {
							Soreq: requestid
						}, true); //page8
					}
				},
				error: function (oData, oResponse) {
					sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
						.MessageBox.Action.OK, null, null);
				}
			});

		},
		onNavBack: function () {
			SOCR_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: requestid
			}, true);
		}

	});

});