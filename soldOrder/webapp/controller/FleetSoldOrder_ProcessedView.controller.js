sap.ui.define([
		"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController,formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ProcessedView", {
	formatter:formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrder_ProcessedView
		 */
		//	onInit: function() {
		//
		//	},
 	onInit: function () {
			/*var i18nModel = new ResourceModel({
				bundleName: "toyota.ca.SoldOrder.i18n.i18n"	
			});
			this.getView().setModel(i18nModel, "i18n");*/
			this.getBrowserLanguage();
		},

		onAfterRendering: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09784"; // this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("procViewTitle", [sRecipient]);
			this.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrder_ProcessedView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrder_ProcessedView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.FleetSoldOrder_ProcessedView
		 */
		//	onExit: function() {
		//
		//	}

	});

});