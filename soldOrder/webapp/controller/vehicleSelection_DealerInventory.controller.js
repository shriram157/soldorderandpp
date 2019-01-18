sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController,formatter) {
	"use strict";
var VehSel_DealerInv_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_DealerInventory", {
formatter:formatter,
		
			onInit: function () {
			VehSel_DealerInv_controller=this;
			VehSel_DealerInv_controller.getBrowserLanguage();
		},
			_onSelect: function (evt) {
			var oTable = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer");
			console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			console.log(oIndex)
		}

	});

});