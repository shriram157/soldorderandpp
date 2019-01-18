sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
var InvVehSel_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.InventoryVehicleSelection", {
		formatter: formatter,

		onInit: function () {
			InvVehSel_controller=this;
			InvVehSel_controller.getBrowserLanguage();
		},
		_onSelect: function () {
				var oTable = InvVehSel_controller.getView().byId("idFSO_IVS_Table");
				var indiceArray=oTable.getSelectedIndices();
					InvVehSel_controller.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder", {}, true); //page 11
			/*	if (oTable.setSelectedIndex(-1) == true) {
					var errForm = formatter.formatErrorType("SO00007");
					var errMsg = InvVehSel_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					var aContexts = oTable.getSelectedIndices();
					for (var i = aContexts.length - 1; i >= 0; i--) {
						var index = aContexts[i];
					}
				}
*/
			}
			

	});

});