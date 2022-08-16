sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, formatter, History) {
	"use strict";
	var RSO_ChangeVehSel_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RSO_ChangeVehicleSelection", {
		formatter: formatter,

		onInit: function () {
			RSO_ChangeVehSel_controller = this;
			// RSO_ChangeVehSel_controller.getBrowserLanguage();
		},
		_onSelect: function (evt) {
			var oTable = RSO_ChangeVehSel_controller.getView().byId("table_RSOVehicleSel");
			// console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// console.log(oIndex);
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			//console.log(oHistory);
			sPreviousHash = oHistory.getPreviousHash();
			//console.log(sPreviousHash);
			//console.log(window.history);
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("SoldOrderChangeReason"); // has the value true and makes sure that the
				//	hash is replaced /*no history
			}
		},

	});

});