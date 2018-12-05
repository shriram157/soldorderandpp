sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
var FSOD_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderDetails", {
		formatter: formatter,
		onInit: function () {
			FSOD_controller=this;
			FSOD_controller.getBrowserLanguage();
			FSOD_controller.flagSipUser = false;
			FSOD_controller.requestStatus = "";
			FSOD_controller._sipUserToTrue();
			
		},
		onAfterRendering:function(){
		
			var mcb_status_FSOD= FSOD_controller.getView().byId("mcb_status_FSOD");
			var mcb_series_FSOD = FSOD_controller.getView().byId("mcb_series_FSOD");
			var mcb_ordTyp_FSOD = FSOD_controller.getView().byId("mcb_ordTyp_FSOD");
			var mcb_auditStatus_FSOD = FSOD_controller.getView().byId("mcb_auditStatus_FSOD");
			var mcb_dealer_FSOD = FSOD_controller.getView().byId("mcb_dealer_FSOD");

			mcb_series_FSOD.setSelectedItems(mcb_series_FSOD.getItems());
			mcb_status_FSOD.setSelectedItems(mcb_status_FSOD.getItems());
			mcb_auditStatus_FSOD.setSelectedItems(mcb_auditStatus_FSOD.getItems());
			mcb_dealer_FSOD.setSelectedItems(mcb_dealer_FSOD.getItems());
			mcb_ordTyp_FSOD.setSelectedItems(mcb_ordTyp_FSOD.getItems());
		//	mcb_ordTyp_FSOD.setSelectedKey("4");
			console.log(mcb_series_FSOD.getItems());
			console.log(mcb_series_FSOD.getSelectedItems());
	
			
		},
			_sipUserToTrue: function () {
			FSOD_controller.requestStatus = "Pending Fulfilment";
			FSOD_controller.flagSipUser = true;
			FSOD_controller.getView().byId("btn_linkVeh_FSOS").setVisible(true);

		},
	/*	onLinkVehicle: function (evt) {
			var dialog = FSOD_controller.getView().byId("VTNDialog_FSOS");
			dialog.open();

		},
		closeDialog: function () {
			var dialog = FSOD_controller.getView().byId("VTNDialog_FSOS");
			dialog.close();
		},*/
		_navToRSO: function () {
			FSOD_controller.getRouter().navTo("RSOView_ManageSoldOrder", {}, true);
		},
		_refresh: function () {

		},
			onLinkVehicle: function (evt) {
			var d = new sap.ui.jsfragment(FSOD_controller.createId("idFrag_FSOD"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				FSOD_controller);
			FSOD_controller.getView().addDependent(d);
			console.log(d);
			d.open();
		},
		_searchNLink: function (evt) {
			var vinVal = FSOD_controller.byId("idFrag_FSOD--VinIdFrag").getValue();
			var vtinVal = FSOD_controller.byId("idFrag_FSOD--VtinIdFrag").getValue();
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		}
		/*_searchNLink: function () {
				var vinVal = FSOD_controller.getView().byId("vin_FSOS").getValue();
				var vtinVal = FSOD_controller.getView().byId("vtin_FSOS").getValue();

				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

			}*/
			/**
			 * Similar to onAfterRendering, but FSOD_controller hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderDetails
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * FSOD_controller hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use FSOD_controller one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrderDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});