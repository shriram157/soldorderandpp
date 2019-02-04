sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
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
		},
		filter_change: function (Oevent) {
			var vechile_items = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer").getBinding('rows');
			//Dealer Inventory
			if (Oevent.getSource().getSelectedKey() == '1') {

				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, "2400001132")
					// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
					// new Filter("Modelyear", FilterOperator.EQ, "2018"),
					// new Filter("Suffix", FilterOperator.EQ, "AL"),
					// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					// new Filter("TCISeries", FilterOperator.EQ, ""),
					// new Filter("ETA", FilterOperator.EQ, ""),
					// new Filter("APX", FilterOperator.EQ, ""),
				], true)]);
			} else if (Oevent.getSource().getSelectedKey() == '2') //National Stock
			{
				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, "2400500000")
					// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
					// new Filter("Modelyear", FilterOperator.EQ, "2018"),
					// new Filter("Suffix", FilterOperator.EQ, "AL"),
					// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					// new Filter("TCISeries", FilterOperator.EQ, ""),
					// new Filter("ETA", FilterOperator.EQ, ""),
					// new Filter("APX", FilterOperator.EQ, ""),
				], true)]);
			}
		},
		_onSelect: function (evt) {
			// var oTable = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer");
			// // console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			// var sPath = evt.getSource().getBindingContext().sPath;
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// console.log(oIndex)
			// Store the Vechile No
            if(evt.getSource().getBindingContext('Vehicle_Model').getProperty('ZZVTN'))
            {
            	var V_No = evt.getSource().getBindingContext('Vehicle_Model').getProperty('ZZVTN');
            		VehSel_DealerInv_controller.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
					method: "POST",
					urlParameters: {
						Zzvtn: V_No,
						ZzsoReqNo: zrequest
					}, // function import parameters
					success: function (oData, response) {
						VehSel_DealerInv_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
							Soreq: zrequest
						}, true); //page 3
					},
					error: function (oError) {

					}
				});
            	
            }
			// sap.ui.getCore().setModel(oModel,"Vechile");
		}

	});

});