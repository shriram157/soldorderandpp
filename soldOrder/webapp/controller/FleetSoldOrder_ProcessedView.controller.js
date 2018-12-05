sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ProcessedView", {
		formatter: formatter,
		
		onInit: function () {
		this.getBrowserLanguage();
		},
		_navToSoldOrder: function (evt) {
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			this.getView().byId("tble_FSO_PV").getModel().getData();
			this.getRouter().navTo("RSOView_ManageSoldOrder", {}, true); //page3
			console.log(this.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex]);
			console.log(this.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex].Category);
		},
		onAfterRendering: function () {
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				var sRecipient = "09789898565684"; // this.getView().getModel().getProperty("/recipient/name");
				var sMsg = oBundle.getText("procViewTitle", [sRecipient]);
				this.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
			}
	});

});