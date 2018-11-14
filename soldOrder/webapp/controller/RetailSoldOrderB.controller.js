sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderB", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		onInit: function () {
			this.getBrowserLanguage();
		},
		onValidateCustomer: function () {
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText("error1");
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Customer Conformation", sap.m.MessageBox.Action.OK, null, null);
			}
			
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf toyota.capractise.view.RetailSoldOrderB
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		//	onExit: function() {
		//
		//	}

	});

});