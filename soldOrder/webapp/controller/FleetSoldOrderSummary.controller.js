sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, formatter, Filter, FilterOperator) {
	"use strict";
	var FSOS_controller;
	return Controller.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {
			FSOS_controller = this;
			FSOS_controller.getBrowserLanguage();
			/*	FSOS_controller.flagSipUser = false;
				FSOS_controller.requestStatus = "";*/
		},
		onBeforeRendering: function () {
			if (AppController.flagZoneUser == true) {
				FSOS_controller.getView().byId("mcb_dealer_FSOS").setVisible(true)
			}
			if (AppController.flagNationalUser == true) {
				FSOS_controller.getView().byId("mcb_dealer_FSOS").setVisible(true);
			}
			/*	if (AppController.flagTCINationalUser == true) {
					FSOS_controller.getView().byId("mcb_dealer_FSOS").setVisible(true);
				}*/
		},
		onAfterRendering: function () {

			var mcb_status_FSOS = FSOS_controller.getView().byId("mcb_status_FSOS");
			var mcb_ordTyp_FSOS = FSOS_controller.getView().byId("mcb_ordTyp_FSOS");
			var mcb_dealer_FSOS = FSOS_controller.getView().byId("mcb_dealer_FSOS");
			var oTbl = FSOS_controller.getView().byId("tbl_FSOS");
			var data = oTbl.getModel().getData().ProductCollection;
			mcb_status_FSOS.setSelectedItems(mcb_status_FSOS.getItems());
			mcb_ordTyp_FSOS.setSelectedItems(mcb_ordTyp_FSOS.getItems());
			mcb_dealer_FSOS.setSelectedItems(mcb_dealer_FSOS.getItems());
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var dfilter = [];
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if(x != "TCI_User")
			{
			for (var i = 0; i < this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length; i++) {
				dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_FSOS").getSelectedItems()[i].getKey()));
			}
			if (dfilter.length > 0) {
				var filter_dealers = new Filter(dfilter, false);
				//---------------------------------------------------------------
				var items = this.getView().byId("tbl_FSOS").getBinding('rows');
				items.filter(filter_dealers);
			}
			}
			//==================================================================================================
			// if (AppController.flagZoneUser == true) {
			// 	FSOS_controller.getView().byId("lbl_dealer_FSOS").setVisible(true);
			// 	FSOS_controller.getView().byId("mcb_dealer_FSOS").setVisible(true);
			// 	FSOS_controller.getView().byId("tbl_lbl_dealer_FSOS").setVisible(true);
			// 	//	FSOS_controller.getView().byId("tbl_val_dealer_FSOS").setVisible(true);

			// 	var len = data.length;
			// 	for (var i = 1; i <= len; i++) {
			// 		var Id = "tbl_val_dealer_FSOS-__clone" + (i + 8 * (i - 1));
			// 		FSOS_controller.getView().byId(Id).setVisible(true);
			// 	}
			// 	//	FSOS_controller.getView().byId(Id).setVisible(true);

			// 	//	mcb_dealer_FSOS.setSelectedItems(mcb_dealer_FSOS.getItems());

			// }
			// if (AppController.flagTCINationalUser == true) {
			// 	FSOS_controller.getView().byId("tbl_lbl_dealer_FSOS").setVisible(true);
			// }

			// if (AppController.flagNationalUser == true) {
			// 	FSOS_controller.getView().byId("lbl_dealer_FSOS").setVisible(true);
			// 	FSOS_controller.getView().byId("mcb_dealer_FSOS").setVisible(true);
			// 	//FSOS_controller.getView().byId("tbl_val_dealer_FSOS").setVisible(true);

			// 	var len2 = data.length;
			// 	for (var j = 1; j <= len2; j++) {
			// 		var Id2 = "tbl_val_dealer_FSOS-__clone" + (j + 8 * (j - 1));
			// 		console.log(Id2);
			// 		console.log(FSOS_controller.getView().byId(Id2));
			// 		FSOS_controller.getView().byId(Id2).setVisible(true);
			// 	}
			// 	//	FSOS_controller.getView().byId(Id2).setVisible(true);
			// 	//	mcb_dealer_FSOS.setSelectedItems(mcb_dealer_FSOS.getItems());

			// }
		},
		_navToSoldOrder: function (evt) {
			// var sPath = evt.getSource().getBindingContext().sPath;
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// FSOS_controller.getView().byId("tbl_FSOS").getModel().getData();
			FSOS_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
				Soreq: evt.getSource().getText()
			}, true);
			// console.log(FSOS_controller.getView().byId("tbl_FSOS").getModel().getData().ProductCollection[oIndex]);
			// console.log(FSOS_controller.getView().byId("tbl_FSOS").getModel().getData().ProductCollection[oIndex].Category);
		},

		onLinkVehicle: function (evt) {
			var dialog = FSOS_controller.getView().byId("VTNDialog_FSOS");
			dialog.open();

		},
		closeDialog: function () {
			var dialog = FSOS_controller.getView().byId("VTNDialog_FSOS");
			dialog.close();
		},
		_searchNLink: function () {
			var vinVal = FSOS_controller.getView().byId("vin_FSOS").getValue();
			var vtinVal = FSOS_controller.getView().byId("vtin_FSOS").getValue();

			var errForm = formatter.formatErrorType("SO000010");
			var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

		},
		_refresh: function (oEvent) {
			//-----------------Sold Order Status-----------------
			var afilter = [];
			for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
				afilter.push(new Filter("ZzsoStatus", FilterOperator.EQ, this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey()));
			}
			var filter_sstatus = new Filter(afilter, false);
			//---------------------------------------------------------------
			//-----------------Order Type-----------------
			var Sfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
				Sfilter.push(new Filter("Zzseries", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getText()));
			}
			var filter_ordertype = new Filter(Sfilter, false);
			//---------------------------------------------------------------
			//-----------------Dealers-----------------
			var dfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length; i++) {
				dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_FSOS").getSelectedItems()[i].getKey()));
			}
			var filter_dealers = new Filter(dfilter, false);
			//---------------------------------------------------------------
			var filter_all = new Filter([filter_ordertype, filter_sstatus, filter_dealers], true);
			var items = this.getView().byId("tbl_FSOS").getBinding('rows');
			items.filter(filter_all);

		},

	});

});