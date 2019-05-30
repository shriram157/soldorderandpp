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
			AppController.getDealer();
			FSOS_controller.getBrowserLanguage();
			var language = FSOS_controller.returnBrowserLanguage();
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if(language== "EN"){
			Obj = {
				"FSOSummary_Status": [
					
					{
					"key": "IN-PROGRESS",
					"text": "In-Progress"
				}, {
					"key": "PENDING FULFILMENT",
					"text": "Pending Fulfillment"
				}, {
					"key": "FILLED",
					"text": "Filled"
				}, {
					"key": "REGISTERED",
					"text": "Registered"
				}, {
					"key": "CANCELLED",
					"text": "Cancelled"
				}, {
					"key": "REQUESTED",
					"text": "Requested"
				}, {
					"key": "APPROVED",
					"text": "Approved"
				}, {
					"key": "REJECTED",
					"text": "Rejected"
				}, {
					"key": "COMPLETED",
					"text": "Completed"
				}]
			};}
			else{
				Obj = {
				"FSOSummary_Status": [
					{
					"key": "ALL",
					"text": "SELECT ALL"
					},
					{
					"key": "IN-PROGRESS",
					"text": "In-Progress"
				}, {
					"key": "PENDING FULFILMENT",
					"text": "Pending Fulfillment"
				}, {
					"key": "FILLED",
					"text": "Filled"
				}, {
					"key": "REGISTERED",
					"text": "Registered"
				}, {
					"key": "CANCELLED",
					"text": "Cancelled"
				}, {
					"key": "REQUESTED",
					"text": "Requested"
				}, {
					"key": "APPROVED",
					"text": "Approved"
				}, {
					"key": "REJECTED",
					"text": "Rejected"
				}, {
					"key": "COMPLETED",
					"text": "Completed"
				}]
			};
			

			}
			
			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"),"globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));
			
			
			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			if(language== "EN"){
		Object = {"FSOSummary_OrderType": [
{
		"key": "F1",
		"text": "DLR RAC"
	}, {
		"key": "F2",
		"text": "DLR ELITE"
	}, {
		"key": "F3",
		"text": "NAT RAC"
	},
	{
		"key": "F4",
		"text": "NAT ELITE"
	},{
		"key": "F5",
		"text": "MOBILITY"
	}],};
				
			}
			else{
				Object = {"FSOSummary_OrderType": [
{
		"key": "F1",
		"text": "DLR RAC"
	}, {
		"key": "F2",
		"text": "DLR ELITE"
	}, {
		"key": "F3",
		"text": "NAT RAC"
	},
	{
		"key": "F4",
		"text": "NAT ELITE"
	},{
		"key": "F5",
		"text": "MOBILITY"
	}],};
			

			}
			
			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(sap.ui.getCore().getModel("OrderTypeModel"),"OrderTypeModel");
			console.log(sap.ui.getCore().getModel("OrderTypeModel"));
			/*	FSOS_controller.flagSipUser = false;
				FSOS_controller.requestStatus = "";*/
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrderSummary").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Emphasized');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Transparent');
		},
		onBeforeRendering: function () {
			if (AppController.flagZoneUser == true) {
				FSOS_controller.getView().byId("mcb_dealer_FSOS").setVisible(true);
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
		var allfilter = [];
			var dfilter = [];
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			
					var afilter = [];
			for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
				afilter.push(new Filter("ZsoFltStatus", FilterOperator.EQ, this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey()));
			}
				afilter.push(new Filter("ZsoFltStatus", FilterOperator.EQ, ""));

			if (afilter.length > 0) {
				var filter_sstatus = new Filter(afilter, false);
				allfilter.push(filter_sstatus);
			}
			//---------------------------------------------------------------
			//-----------------Order Type-----------------
			var Sfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
				Sfilter.push(new Filter("Zadd1", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey()));
			}
				Sfilter.push(new Filter("Zadd1", FilterOperator.EQ, ""));

			if (Sfilter.length > 0) {
				var filter_ordertype = new Filter(Sfilter, false);
				allfilter.push(filter_ordertype);
			}
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length; i++) {
					dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_FSOS").getSelectedItems()[i].getKey()));
				}
			

				if (dfilter.length > 0) {
					var filter_dealers = new Filter(dfilter, false);
					allfilter.push(filter_dealers);
				}
					//---------------------------------------------------------------
					var filter_all = new Filter([filter_sstatus, filter_dealers, filter_ordertype], true);
					var items = this.getView().byId("tbl_FSOS").getBinding('rows');
					items.filter(filter_all);
				
			
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
			var allfilter = [];
			//-----------------Sold Order Status-----------------
			var afilter = [];
			for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
				afilter.push(new Filter("ZsoFltStatus", FilterOperator.EQ, this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey()));
			}
				afilter.push(new Filter("ZsoFltStatus", FilterOperator.EQ, ""));

			if (afilter.length > 0) {
				var filter_sstatus = new Filter(afilter, false);
				allfilter.push(filter_sstatus);
			}
			//---------------------------------------------------------------
			//-----------------Order Type-----------------
			var Sfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
				Sfilter.push(new Filter("Zadd1", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey()));
			}
				Sfilter.push(new Filter("Zadd1", FilterOperator.EQ, ""));

			if (Sfilter.length > 0) {
				var filter_ordertype = new Filter(Sfilter, false);
				allfilter.push(filter_ordertype);
			}
			//---------------------------------------------------------------
			//-----------------Dealers-----------------
			var dfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length; i++) {
				dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_FSOS").getSelectedItems()[i].getKey()));
			}
				

			if (dfilter.length > 0) {
				var filter_dealers = new Filter(dfilter, false);
				allfilter.push(filter_dealers);
			}
			//---------------------------------------------------------------
			var filter_all = new Filter([filter_sstatus, filter_dealers, filter_ordertype], true);
			var items = this.getView().byId("tbl_FSOS").getBinding('rows');
			items.filter(filter_all);

		},

	});

});