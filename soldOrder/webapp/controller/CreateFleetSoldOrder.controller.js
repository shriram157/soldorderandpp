sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";
	var CFSO_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.CreateFleetSoldOrder", {
		formatter: formatter,

		onInit: function () {
			CFSO_controller = this;
			CFSO_controller.getBrowserLanguage();
			var today = new Date();
			var day30 = new Date();
			day30.setDate(today.getDate() + 30);
			CFSO_controller.getView().byId("etaFrom_CFSO").setMinDate(day30);
		},

		onAfterRendering: function () {
			CFSO_controller.listOfModelYear();
			if (AppController.flagPPDUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagNationalSIPUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagNationalPPDUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagDealerUser == true) {

			}
			if (AppController.flagZoneUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagTCINationalUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagSIPUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagNationalUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagOrderingDealer == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
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
			CFSO_controller.getView().byId("modelYr_CFSO").setModel(modelYearModel2);

		},
		_handleChange: function () {
			var etaFrom = CFSO_controller.getView().byId("etaFrom_CFSO").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				CFSO_controller.getView().byId("etaTo_CFSO").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00009");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		onColumnResize: function (oEvent) {
			oEvent.preventDefault();
		},
		_addVehiclesToInventory: function () {
			CFSO_controller.getOwnerComponent().getRouter().navto("InventoryVehicleSelection", {}, true); //page 12
		},
		_onDelete1: function () {
			var oTable = CFSO_controller.getView().byId("idCFSO_Table1");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().ProductCollection;
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
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
			var oTable = CFSO_controller.getView().byId("idCFSO_Table2");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().ProductCollection;
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
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
			var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue();
			var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue();
			var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
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
			var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue();
			var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue();
			var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		}

		//for (var i = aContexts.length - 1; i >= 0; i--) {
		/*	var oCFSO_controllerObj = aContexts[i].getObject();
			var index = $.map(aRows, function (obj, index) {
				if (obj === oCFSO_controllerObj) {
					return index;
				}
			});*/


	});

});