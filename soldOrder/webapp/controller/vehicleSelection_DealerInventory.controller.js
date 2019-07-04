sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var VehSel_DealerInv_controller;
	var zrequest, vehicle, model, modelyear, suffix, color, series;
	return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_DealerInventory", {
		formatter: formatter,

		onInit: function () {
			VehSel_DealerInv_controller = this;
			VehSel_DealerInv_controller.getBrowserLanguage();
			this.getOwnerComponent().getRouter().getRoute("vehicleSelection_DealerInventory").attachPatternMatched(this._getattachRouteMatched,
				this);

		},
		_getattachRouteMatched: function (parameters) {
			var oBundle = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle();
			var Msg = oBundle.getText("novehicletable");
			VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer").setNoData(Msg);
			zrequest = parameters.getParameters().arguments.Soreq;
			var vechile_items = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer").getBinding('rows');
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();
			// var host = VehSel_DealerInv_controller.host();
			// var url = host +
			// 	"ZVMS_SOLD_ORDER_SRV/InventoryDetailsSet?$filter=(MATRIX eq  A205 and Dealer eq '" + dealer_no + "' and Model eq '" + vehicle.model + "' and ExteriorColorCode eq '" + vehicle.color + "' and TCISeries eq '" + vehicle.series + "' and RSO_NUM eq '" + zrequest + "' and Modelyear eq '" + vehicle.modelyear +
			// 	" 'and Suffix eq '" + vehicle.suffix + "')";
			// 				$.ajax({
			// 	url: url,
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		var oModel = new sap.ui.model.json.JSONModel();

			// 		// var arr = [];
			// 		// var j = 0; //TCISeries_fr

			// 					// if ($.inArray(data.d.results[0], arr) < 0) {
			// 					// 	arr[0] = data.d.results[0]["TCISeries_fr"];

			// 					// }

			// 		oModel.setData(data.d.results[0]);
			// 		VehSel_DealerInv_controller.getView().setModel(oModel, "InventoryModel");
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		var errMsg = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
			// 		sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
			//vechile_items.Sorter("ETAFrom", false);
			vechile_items.filter([new Filter([
				new Filter("MATRIX", FilterOperator.EQ, "A205"),
				new Filter("Dealer", FilterOperator.EQ, dealer_no),
				new Filter("Model", FilterOperator.EQ, vehicle.model),
				new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
				new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
				new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color),
				// new Filter("INTCOL", FilterOperator.EQ, "42")
				new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
				new Filter("RSO_NUM", FilterOperator.EQ, zrequest),
				new Filter("source", FilterOperator.EQ, "RSO"),
				// new Filter("ETA", FilterOperator.EQ, ""),
				// new Filter("APX", FilterOperator.EQ, ""),
			], true)]);
		},
		onAfterRendering: function () {
			// var vechile_items = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer").getBinding('rows');
			// 	var dealer_no = "0";
			// //Dealer Inventory
			// vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();

			// 	vechile_items.filter([new Filter([
			// 		new Filter("MATRIX", FilterOperator.EQ, "A205"),
			// 		new Filter("Dealer", FilterOperator.EQ, dealer_no),
			// 		// new Filter("Model", FilterOperator.EQ, vehicle.model),
			// 		// new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
			// 		// new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
			// 		// new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color),
			// 		// // new Filter("INTCOL", FilterOperator.EQ, "42")
			// 		// new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
			// 		// new Filter("ETA", FilterOperator.EQ, ""),
			// 		// new Filter("APX", FilterOperator.EQ, ""),
			// 	], true)]);
		},
		filter_change: function (Oevent) {
			var vechile_items = VehSel_DealerInv_controller.getView().byId("table_RSOVehicleDealer").getBinding('rows');
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();
			if (Oevent.getSource().getSelectedKey() == '1') {

				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, dealer_no),
					new Filter("Model", FilterOperator.EQ, vehicle.model),
					new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
					new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
					new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
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
			if (evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN')) {
				var V_No = evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN');
				// var host = VehSel_DealerInv_controller.host();
				// var oUrl = host + "/Z_VEHICLE_MASTER_SRV/zc_exterior_trim?$format=json";
				// $.ajax({
				// 	url: oUrl,
				// 	method: 'GET',
				// 	async: false,
				// 	dataType: 'json',
				// 	success: function (data, textStatus, jqXHR) {
				// 		var oModel = new sap.ui.model.json.JSONModel(data.d.results);
				// 	},
				// 	error: function (jqXHR, textStatus, errorThrown) {
				// 		sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
				// 			sap
				// 			.m.MessageBox.Action.OK, null, null);
				// 	}
				// });
				VehSel_DealerInv_controller.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
					method: "POST",
					urlParameters: {
						Zzvtn: V_No,
						ZzsoReqNo: zrequest
							//	Endcustomer:
					}, // function import parameters
					success: function (oData, response) {
						if (oData.Type == 'E') {
							var oBundle = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000013", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
								.m.MessageBox.Action.OK, null, null);
						} else {
							VehSel_DealerInv_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
								Soreq: zrequest
							}, true); //page 3	
						}

					},
					error: function (oError) {

					}
				});

			}
			// sap.ui.getCore().setModel(oModel,"Vechile");
		},
		_GetCustomer: function () {

		},
		onNavBack: function (oEvent) {
			VehSel_DealerInv_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: zrequest
			}, true); //page 3		
		}

	});

});