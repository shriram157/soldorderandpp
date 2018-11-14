sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/m/MessageToast",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/resource/ResourceModel"
], function (BaseController, MessageToast,formatter, ResourceModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderCancelRequest", {
	formatter:formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.RetailSoldOrderCancelRequest
		 */
		onInit: function () {

			this.getBrowserLanguage();

		},

		onAfterRendering: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09732984"; // this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("CancelReq", [sRecipient]);
			this.getView().byId("label_CancelSoldOrderid").setText(sMsg);
		},

		UpdateSoldOrderRequest: function () {
			//	comm_CancelSO
			//	resonCancelId
			var commentTA = this.getView().byId("comm_CancelSO");
			var comboInput = this.getView().byId("resonCancelId");
			var valComment = commentTA.getValue();
			var valCombo = comboInput.getSelectedKey();
			if (valCombo == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
		
		/*		sap.m.MessageBox.show("The user has not selected/entered all the mandatory information. Please complete all Mandatory fields", sap.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);*/
			}
			if (valComment == "" && valCombo == "3") {
				var errForm = formatter.formatErrorType("SO00006");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
		
			/*	sap.m.MessageBox.show("Comments not filled and reason for selection is other.", sap.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);*/
			}
		}
	});

});