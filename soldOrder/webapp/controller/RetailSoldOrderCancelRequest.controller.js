sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel"
], function (BaseController, MessageToast, ResourceModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderCancelRequest", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.RetailSoldOrderCancelRequest
		 */
		onInit: function () {
			/*var i18nModel = new ResourceModel({
				bundleName: "toyota.ca.SoldOrder.i18n.i18n"	
			});
			this.getView().setModel(i18nModel, "i18n");*/
			this.getBrowserLanguage();
		//		var salesModel = this.getOwnerComponent().getModel('salesModel');
		//	console.log(salesModel);
		//	this.getView().setModel(salesModel);
		},

		onAfterRendering: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09732984"; // this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("CancelReq", [sRecipient]);
			this.getView().byId("label_CancelSoldOrderid").setText(sMsg);
		},

		UpdateSoldOrderRequest: function () {
			
		}
	});

});