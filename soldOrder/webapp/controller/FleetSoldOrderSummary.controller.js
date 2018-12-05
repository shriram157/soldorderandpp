sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (Controller, formatter) {
	"use strict";
var FSOS_controller;
	return Controller.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {
			FSOS_controller=this;
			FSOS_controller.getBrowserLanguage();
			FSOS_controller.flagSipUser = false;
			FSOS_controller.requestStatus = "";
		},
			onAfterRendering: function () {

			var mcb_status_FSOS = FSOS_controller.getView().byId("mcb_status_FSOS");
			var mcb_ordTyp_FSOS = FSOS_controller.getView().byId("mcb_ordTyp_FSOS");
			var mcb_dealer_FSOS = FSOS_controller.getView().byId("mcb_dealer_FSOS");

			mcb_status_FSOS.setSelectedItems(mcb_status_FSOS.getItems());
			mcb_ordTyp_FSOS.setSelectedItems(mcb_ordTyp_FSOS.getItems());
			mcb_dealer_FSOS.setSelectedItems(mcb_dealer_FSOS.getItems());

			console.log(mcb_status_FSOS.getItems());
			console.log(mcb_status_FSOS.getSelectedItems());
		},
		_navToSoldOrder: function (evt) {
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			FSOS_controller.getView().byId("tble_FSO_S").getModel().getData();

			console.log(FSOS_controller.getView().byId("tble_FSO_S").getModel().getData().ProductCollection[oIndex]);
			console.log(FSOS_controller.getView().byId("tble_FSO_S").getModel().getData().ProductCollection[oIndex].Category);
		},
	
		onLinkVehicle: function (evt) {
			var dialog = FSOS_controller.getView().byId("VTNDialog_FSOS");
			dialog.open();

		},
		closeDialog: function () {
			var dialog = FSOS_controller.getView().byId("VTNDialog_FSOS");
			dialog.close();
		},
		_searchNLink: function () {
			var vinVal = FSOS_controller.getView().byId("vin_FSOS").getValue();
			var vtinVal = FSOS_controller.getView().byId("vtin_FSOS").getValue();

			var errForm = formatter.formatErrorType("SO000010");
			var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

		},
		_refresh: function () {

			}
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderSummary
			 */
			//	onInit: function() {
			//
			//	},

		/**
		 * Similar to onAfterRendering, but FSOS_controller hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderSummary
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * FSOS_controller hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderSummary
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use FSOS_controller one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderSummary
		 */
		//	onExit: function() {
		//
		//	}

	});

});