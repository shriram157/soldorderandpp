sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var VehSel_NatStock_Controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_NationalStock", {
		formatter: formatter,
		onInit: function () {
			VehSel_NatStock_Controller = this;
			// VehSel_NatStock_Controller.getBrowserLanguage();
			VehSel_NatStock_Controller.getSO();
		},
		getSO: function () {
			var host = VehSel_NatStock_Controller.host();
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000009'&$format=json";
			$.ajax({
				type: 'GET',
				url: oURL,
				cache: false,
				success: function (data) {
					//console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					VehSel_NatStock_Controller.getView().setModel(oModel, "vehSel_NatStock_Model");
				},
				error: function (data) {
					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}

			});
		},
		_onSelect: function (evt) {
			var oTable = VehSel_NatStock_Controller.getView().byId("table_RSOVehicleSelNationalStock");
			//console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
		},
		sortETA: function (oEvent) {
		}
	});

});