sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/m/MessageToast",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/resource/ResourceModel"
], function (BaseController, MessageToast, formatter, ResourceModel) {
	"use strict";
var RSOCancel_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderCancelRequest", {
		formatter: formatter,
		
		onInit: function () {
			RSOCancel_controller=this;
			RSOCancel_controller.getBrowserLanguage();

		},

		onAfterRendering: function () {
			var oBundle = RSOCancel_controller.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09732984"; // RSOCancel_controller.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("CancelReq", [sRecipient]);
			RSOCancel_controller.getView().byId("label_CancelSoldOrderid").setText(sMsg);
		},

		UpdateSoldOrderRequest: function () {

			var commentTA = RSOCancel_controller.getView().byId("comm_CancelSO");
			var comboInput = RSOCancel_controller.getView().byId("resonCancelId");
			var valComment = commentTA.getValue();
			var valCombo = comboInput.getSelectedKey();
			if (valCombo == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = RSOCancel_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		else if (valComment == "" && valCombo == "3") {
				var errForm2 = formatter.formatErrorType("SO00006");
				var errMsg2 = RSOCancel_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
			else{
				RSOCancel_controller.getOwnerComponent().getRouter().navto("RSOView_ManageSoldOrder", {}, true); //page 3
			}
		}
	});

});