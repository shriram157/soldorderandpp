sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController"

	/*	"sap/ui/table/SortOrder",
		"sap/ui/model/Sorter",
		"sap/ui/core/format/DateFormat"*/

], function (BaseController) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_NationalStock", {

		onInit: function () {
			this.getBrowserLanguage();
		},
		_onSelect: function (evt) {
			var oTable = this.getView().byId("table_RSOVehicleSelNationalStock");
			console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
		},
		sortETA: function (oEvent) {
				/*
							var oCurrentColumn = oEvent.getParameter("column");
							var oDeliveryDateColumn = this.byId("deliverydate");
							if (oCurrentColumn != oDeliveryDateColumn) {
								oDeliveryDateColumn.setSorted(false); //No multi-column sorting
								return;
							}

							oEvent.preventDefault();

							var sOrder = oEvent.getParameter("sortOrder");
							var oDateFormat = DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});

							this._resetSortingState(); //No multi-column sorting
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
							this.byId("table_RSOVehicleSel").getBinding("rows").sort(oSorter);
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
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.capractise.view.vehicleSelection_PipelineVehAvlbl
		 */
		//	onExit: function() {
		//
		//	}

	});

});