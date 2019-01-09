sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
	/*	"sap/ui/table/SortOrder",
		"sap/ui/model/Sorter",
		"sap/ui/core/format/DateFormat"*/

], function (BaseController,formatter) {
	"use strict";
var VehSel_NatStock_Controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_NationalStock", {
formatter:formatter,
		onInit: function () {
			VehSel_NatStock_Controller=this;
			VehSel_NatStock_Controller.getBrowserLanguage();
			VehSel_NatStock_Controller.getSO();
		},
			getSO: function () {
			var host = VehSel_NatStock_Controller.host();
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?sap-client=200&$format=json";
		//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000009'&$format=json";
			$.ajax({
				type: 'GET',
				url: oURL,
				cache: false,
				success: function (data) {
					console.log(data.d.results);
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
			console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
		},
		sortETA: function (oEvent) {
				/*
							var oCurrentColumn = oEvent.getParameter("column");
							var oDeliveryDateColumn = VehSel_NatStock_Controller.byId("deliverydate");
							if (oCurrentColumn != oDeliveryDateColumn) {
								oDeliveryDateColumn.setSorted(false); //No multi-column sorting
								return;
							}

							oEvent.preventDefault();

							var sOrder = oEvent.getParameter("sortOrder");
							var oDateFormat = DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});

							VehSel_NatStock_Controller._resetSortingState(); //No multi-column sorting
							oDeliveryDateColumn.setSorted(true);
							oDeliveryDateColumn.setSortOrder(sOrder);

							var oSorter = new Sorter(oDeliveryDateColumn.getSortProperty(), sOrder === SortOrder.Ascending);
							//The date data in the JSON model is string based. For a proper sorting the compare function needs to be customized.
							oSorter.fnCompare = function(a, b) {
								if (b == null) {
									return -1;
								}
								if (a == null) {
									return 1;
								}

								var aa = oDateFormat.parse(a).getTime();
								var bb = oDateFormat.parse(b).getTime();

								if (aa < bb) {
									return -1;
								}
								if (aa > bb) {
									return 1;
								}
								return 0;
							};
							VehSel_NatStock_Controller.byId("table_RSOVehicleSel").getBinding("rows").sort(oSorter);
						*/
			}
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
			 */
			//	onInit: function() {
			//
			//	},

		/**
		 * Similar to onAfterRendering, but VehSel_NatStock_Controller hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * VehSel_NatStock_Controller hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use VehSel_NatStock_Controller one to free resources and finalize activities.
		 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
		 */
		//	onExit: function() {
		//
		//	}

	});

});