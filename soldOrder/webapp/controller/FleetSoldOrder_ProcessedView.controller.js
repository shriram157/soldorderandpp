sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var FSO_PVController;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ProcessedView", {
		formatter: formatter,

		onInit: function () {
			FSO_PVController = this;
			FSO_PVController.getBrowserLanguage();
		},
		_navToSoldOrder: function (evt) {
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData();
			FSO_PVController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {}, true); //page3
			console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex]);
			console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex].Category);
		},
		onAfterRendering: function () {
			var oBundle = FSO_PVController.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09789898565684"; // FSO_PVController.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("procViewTitle", [sRecipient]);
			FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
		}
	});

});