sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.CreateFleetSoldOrder", {
		formatter: formatter,

		onInit: function () {
			/*var i18nModel = new ResourceModel({
				bundleName: "toyota.ca.SoldOrder.i18n.i18n"	
			});
			this.getView().setModel(i18nModel, "i18n");*/
			this.getBrowserLanguage();
			var today = new Date();
			var day30 = new Date();
			day30.setDate(today.getDate() + 30);
			this.getView().byId("etaFrom_CFSO").setMinDate(day30);
//			this.getView().byId("etaTo_CFSO").setMinDate(day35);
		},
		_handleChange:function(){
			var etaFrom=this.getView().byId("etaFrom_CFSO").getValue();
			if(etaFrom!==""){
			var CDate = new Date(etaFrom);
			var day5=CDate;
			day5.setDate(CDate.getDate() + 5);
			this.getView().byId("etaTo_CFSO").setMinDate(day5);
			}
			else{
				var errForm = formatter.formatErrorType("SO00009");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		onColumnResize: function (oEvent) {
			oEvent.preventDefault();
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
			/*if (aContexts.length!==0||aContexts||aContexts!==""||aContexts!== null) {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					aRows.splice(index, 1);
					oTable.setSelectedIndex(-1);
				}
				oModel2.setData({
					ProductCollection: aRows
				});
				oTable.setModel(oModel2);
			} else {
				var errMsg=	formatter.formatErrorType("SO00007"); 
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}*/
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
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.CreateFleetSoldOrder
		 */
		//	onExit: function() {
		//
		//	}

	});

});