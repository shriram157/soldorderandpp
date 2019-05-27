sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/m/MessageToast",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/resource/ResourceModel"
], function (BaseController, MessageToast, formatter, ResourceModel) {
	"use strict";
	var RSOCancel_controller,
		requestid;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderCancelRequest", {
		formatter: formatter,

		onInit: function () {
			RSOCancel_controller = this;
			RSOCancel_controller.getBrowserLanguage();
			RSOCancel_controller.getOwnerComponent().getRouter().getRoute("RetailSoldOrderCancelRequest").attachPatternMatched(this._getattachRouteMatched,
				this);
			var cancelReasonModel = new sap.ui.model.json.JSONModel();
			var Obj;
				var language = RSOCancel_controller.returnBrowserLanguage();
			if(language== "EN"){
			Obj = {
				
					"CancellationReason": [{
		"key": "1",
		"text": "Customer Cancelled"
	}, {
		"key": "2",
		"text": "Customer Changed Vehicle"
	}, {
		"key": "3",
		"text": "Others"
	}],

			};}
			else{
				Obj = {
				
				"CancellationReason": [{
		"key": "1",
		"text": "Client annulé"
	}, {
		"key": "2",
		"text": "Véhicule changé par le client"
	}, {
		"key": "3",
		"text": "Autres"
	}],

			
};
			}
			
			cancelReasonModel.setData(Obj);
			cancelReasonModel.updateBindings(true);
			sap.ui.getCore().setModel(cancelReasonModel, "cancelReasonModel");
			this.getView().setModel(sap.ui.getCore().getModel("cancelReasonModel"),"cancelReasonModel");
			console.log(sap.ui.getCore().getModel("cancelReasonModel"));
		},
		_getattachRouteMatched: function (parameters) {
			requestid = parameters.getParameters().arguments.Soreq;
			var oBundle = RSOCancel_controller.getView().getModel("i18n").getResourceBundle();
			var sRecipient = requestid; // RSOCancel_controller.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("CancelReq", [sRecipient]);
			RSOCancel_controller.getView().byId("label_CancelSoldOrderid").setText(sMsg);
		},
		onAfterRendering: function () {

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
			} else if (valComment == "" && valCombo == "3") {
				var errForm2 = formatter.formatErrorType("SO00006");
				var errMsg2 = RSOCancel_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				RSOCancel_controller.getView().getModel('mainservices').callFunction("/RSO_Cancel", {
					method: "POST",
					urlParameters: {
						Reason_comment: commentTA.getValue(),
						Reason: comboInput.getValue(),
						ZzsoReqNo: requestid
					}, // function import parameters
					success: function (oData, response) {
						RSOCancel_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
							Soreq: requestid
						}, true); //page 3
					},
					error: function (oError) {

					sap.m.MessageBox.show(oError, sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				
					}
				});

			}
		},
		onNavBack:function(oe)
		{
				RSOCancel_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
							Soreq: requestid
						}, true);
		}
	});

});