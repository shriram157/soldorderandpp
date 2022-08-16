sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController,formatter) {
	"use strict";
var RSO_ChangeVehSel_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RSO_ChangeVehicleSelection", {
	formatter:formatter,
		
		onInit: function () {
			RSO_ChangeVehSel_controller=this;
			// RSO_ChangeVehSel_controller.getBrowserLanguage();
		},
		_onSelect: function (evt) {
			var oTable = RSO_ChangeVehSel_controller.getView().byId("table_RSOVehicleSel");
			// console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// console.log(oIndex);
		}


	});

});