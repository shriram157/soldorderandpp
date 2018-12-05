sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var RSOS_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderSummary", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.RetailSoldOrderSummary
		 */
		onInit: function () {
			RSOS_controller = this;
			RSOS_controller.getBrowserLanguage();
			RSOS_controller.flagSipUser = false;
			RSOS_controller.requestStatus = "";
			RSOS_controller._sipUserToTrue();
		},
		onAfterRendering: function () {

			var mcb_series_RSOS = RSOS_controller.getView().byId("mcb_series_RSOS");
			var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
			var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
			var mcb_dealer_RSOS = RSOS_controller.getView().byId("mcb_dealer_RSOS");

			mcb_series_RSOS.setSelectedItems(mcb_series_RSOS.getItems());
			mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
			mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			mcb_dealer_RSOS.setSelectedItems(mcb_dealer_RSOS.getItems());

			console.log(mcb_series_RSOS.getItems());
			console.log(mcb_series_RSOS.getSelectedItems());
		},
		_refresh: function () {

		},
		_dispalySoldOrderDetails: function (evt) {
			var oTable = RSOS_controller.getView().byId("table_RSOS");
			console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			var model = oTable.getModel();

			RSOS_controller.getRouter().navTo("RSOView_ManageSoldOrder", {}, true);
		},

		_sipUserToTrue: function () {
			RSOS_controller.requestStatus = "Pending Fulfilment";
			RSOS_controller.flagSipUser = true;
			RSOS_controller.getView().byId("btn_linkVeh_RSOS").setVisible(true);

		},
		_createNewOrder: function () {
			RSOS_controller.getRouter().navTo("RetailSoldOrderA", {}, true);
		},
		onLinkVehicle: function (evt) {
			var d = new sap.ui.jsfragment(RSOS_controller.createId("idFrag_RSOS"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				RSOS_controller);
			RSOS_controller.getView().addDependent(d);
			console.log(d);
			d.open();
		},
		_searchNLink: function (evt) {
			var vinVal = RSOS_controller.byId("idFrag_RSOS--VinIdFrag").getValue();
			var vtinVal = RSOS_controller.byId("idFrag_RSOS--VtinIdFrag").getValue();
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		closeDialog: function () {
			//var oDialogBox = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.VinDialog", RSOS_controller);
			//	RSOS_controller.oDialogBox.close();
		}

		//new sap.ui.xmlfragment(RSOS_controller.createId("idFragment"),  "fragmentcreation.SampleFragment"));
		//RSOS_controller.oDialogBox = new sap.ui.xmlfragment(RSOS_controller.createId("idFragment"), "toyota.ca.SoldOrder.view.fragments.VinDialog", RSOS_controller);
		//	RSOS_controller.getView().addDependent(RSOS_controller.oDialogBox);
		//var vinVal = RSOS_controller.getView().byId(sap.ui.core.Fragment.createId("idFragment", "vin")).getValue();
		/*	console.log(RSOS_controller.byId("idFrag_RSOS--VinIdFrag"));
			console.log(vinVal);
				 console.log(RSOS_controller.byId("idFrag_RSOS--VtinIdFrag"));
			console.log(vtinVal);*/

		//console.log(RSOS_controller.byId(sap.ui.core.Fragment.createId("idFragment", "VinIdFrag")));
		//	console.log(RSOS_controller.byId("VinIdFrag").getValue());
		//var vtinVal = RSOS_controller.getView().byId("VtinIdFrag").getValue();
		//var vtinVal = RSOS_controller.getView().byId(sap.ui.core.Fragment.createId("idFragment", "vtin")).getValue();

		/**
		 * Similar to onAfterRendering, but RSOS_controller hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.SoldOrder.view.RetailSoldOrderSummary
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * RSOS_controller hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.RetailSoldOrderSummary
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use RSOS_controller one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.RetailSoldOrderSummary
		 */
		//	onExit: function() {
		//
		//	}

	});

});