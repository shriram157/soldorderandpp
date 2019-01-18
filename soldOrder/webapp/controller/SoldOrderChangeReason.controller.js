sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
var SOCR_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.SoldOrderChangeReason", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.SoldOrderChange
		 */
		onInit: function () {
			SOCR_controller=this;
			SOCR_controller.getBrowserLanguage();
		},
		onAfterRendering: function () {
			var oBundle = SOCR_controller.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09732984"; // SOCR_controller.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("soldOrderReqTitle", [sRecipient]);
			SOCR_controller.getView().byId("label_SoldOrderid").setText(sMsg);
		},

		UpdateSoldOrderRequest: function () {
			var comboBox = SOCR_controller.getView().byId("reqTypeId_SOCR");
			var cbVal = comboBox.getSelectedKey();
			if (cbVal == 2) {
				SOCR_controller.getOwnerComponent().getRouter().navto("RSO_ChangeVehicleSelection", {}, true); //page 9
			} else if (cbVal == 1) {
				SOCR_controller.getOwnerComponent().getRouter().navto("ChangeSoldOrderRequest", {}, true); //page8
			}
		}


	});

});