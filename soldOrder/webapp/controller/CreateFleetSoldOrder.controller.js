sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.CreateFleetSoldOrder", {
		formatter: formatter,

		onInit: function () {
			this.getBrowserLanguage();
			var today = new Date();
			var day30 = new Date();
			day30.setDate(today.getDate() + 30);
			this.getView().byId("etaFrom_CFSO").setMinDate(day30);

		},
		listOfModelYear: function () {
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var previousModelYear = currentModelYear - 1;
			var nextModelYear = currentModelYear + 1;
			var previousModelYear2 = previousModelYear - 1;
			var nextModelYear2 = nextModelYear + 1;

			var data = {
				"modelYear": [{
					"key": "1",
					"text": previousModelYear2
				}, {
					"key": "2",
					"text": previousModelYear
				}, {
					"key": "3",
					"text": currentModelYear
				}, {
					"key": "4",
					"text": nextModelYear
				}, {
					"key": "5",
					"text": nextModelYear2
				}]
			};
			var modelYearModel2 = new JSONModel();
			modelYearModel2.setData(data);
			this.getView().byId("modelYr_CFSO").setModel(modelYearModel2);

		},
		_handleChange: function () {
			var etaFrom = this.getView().byId("etaFrom_CFSO").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				this.getView().byId("etaTo_CFSO").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00009");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		onColumnResize: function (oEvent) {
			oEvent.preventDefault();
		},
		_addVehiclesToInventory: function () {
			this.getRouter().navto("InventoryVehicleSelection",{},true); //page 12
		},
		_onDelete1: function () {
			var oTable = this.getView().byId("idCFSO_Table1");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().ProductCollection;
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					aRows.splice(index, 1);
					oTable.setSelectedIndex(-1);
				}
				oModel2.setData({
					ProductCollection: aRows
				});
				oTable.setModel(oModel2);
			}

		},
		_onDelete2: function () {
			var oTable = this.getView().byId("idCFSO_Table2");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().ProductCollection;
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					aRows.splice(index, 1);
					oTable.setSelectedIndex(-1);
				}
				oModel2.setData({
					ProductCollection: aRows
				});
				oTable.setModel(oModel2);
			}
		},
		_onSubmit: function () {
			var valModelYr = this.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = this.getView().byId("suffix_CFSO").getValue();
			var valSeries = this.getView().byId("series_CFSO").getValue();
			var valModelCode = this.getView().byId("modelCode_CFSO").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			// set status to "Requested"
			var str = "abcdefghijk";
			var res = str.substring(0, 5);
			var seqNum = "79876875765";
			var res2 = seqNum.substring(0, 7);
			var dealerFleetNum = res.concat(res2);
			console.log(dealerFleetNum);
		},
		_onAddRow: function () {
			var valModelYr = this.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = this.getView().byId("suffix_CFSO").getValue();
			var valSeries = this.getView().byId("series_CFSO").getValue();
			var valModelCode = this.getView().byId("modelCode_CFSO").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		},
		onAfterRendering: function () {
				this.listOfModelYear();
			}
			//for (var i = aContexts.length - 1; i >= 0; i--) {
			/*	var oThisObj = aContexts[i].getObject();
				var index = $.map(aRows, function (obj, index) {
					if (obj === oThisObj) {
						return index;
					}
				});*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.SoldOrder.view.CreateFleetSoldOrder
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.CreateFleetSoldOrder
		 */

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.CreateFleetSoldOrder
		 */
		//	onExit: function() {
		//
		//	}

	});

});