sap.ui.define([
"toyota/ca/SoldOrder/controller/BaseController",
"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
"use strict";
var VehSel_DealerInv_controller;
var zrequest;
return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_DealerInventory", {
			formatter: formatter,

			onInit: function () {
				VehSel_DealerInv_controller = this;
				VehSel_DealerInv_controller.getBrowserLanguage();
				this.getOwnerComponent().getRouter().getRoute("vehicleSelection_DealerInventory").attachPatternMatched(this._getattachRouteMatched,
					this);
			},
			_getattachRouteMatched: function (parameters) {
				zrequest = parameters.getParameters().arguments.Soreq;
				//var vechile_items = RSO_MSO_controller.getView().byId("table_RSOVehicleDealer").getBinding("rows");
				// 		vechile_items.filter([
				// 			new Filter("Model", FilterOperator.EQ, model),
			// 	new Filter("Model", FilterOperator.EQ, model)
			// 	new Filter("Model", FilterOperator.EQ, model)
			// 	new Filter("Model", FilterOperator.EQ, model)
			// 	new Filter("Model", FilterOperator.EQ, model)
			// ],
			// true);
	},
	_onSelect: function (evt) {
		var oTable = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer");
		// console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
		var sPath = evt.getSource().getBindingContext().sPath;
		var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
		// console.log(oIndex)

		// sap.ui.getCore().setModel(oModel,"Vechile");
	}

});

});