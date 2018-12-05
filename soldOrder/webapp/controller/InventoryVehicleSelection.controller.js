sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.InventoryVehicleSelection", {
		formatter: formatter,

		onInit: function () {
			this.getBrowserLanguage();
		},
		_onSelect: function () {
				var oTable = this.getView().byId("idFSO_IVS_Table");
				var indiceArray=oTable.getSelectedIndices();
					this.getRouter().navTo("CreateFleetSoldOrder", {}, true); //page 11
			/*	if (oTable.setSelectedIndex(-1) == true) {
					var errForm = formatter.formatErrorType("SO00007");
					var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					var aContexts = oTable.getSelectedIndices();
					for (var i = aContexts.length - 1; i >= 0; i--) {
						var index = aContexts[i];
					}
				}
*/
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf toyota.ca.SoldOrder.view.InventoryVehicleSelection
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.InventoryVehicleSelection
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.InventoryVehicleSelection
		 */
		//	onExit: function() {
		//
		//	}

	});

});