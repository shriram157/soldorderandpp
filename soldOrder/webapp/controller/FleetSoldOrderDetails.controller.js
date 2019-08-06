sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Sorter, Filter, FilterOperator) {
	"use strict";
	var FSOD_controller, zrequest,
		clicks = 0,
		num = 0,
		filter = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase(); //FSOD_controller.returnBrowserLanguage();
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderDetails", {
		formatter: formatter,
		onInit: function () {
			FSOD_controller = this;
			FSOD_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrderDetails").attachPatternMatched(this._onObjectMatched, this);

			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if (language == "EN") {
				Obj = {
					"FSODetails_Status": [{
						"key": "AUDIT-COMPLETED",
						"text": "AUDIT-COMPLETED"
					}, {
						"key": "PENDING FULFILLMENT",
						"text": "PENDING FULFILLMENT"
					}, {
						"key": "FAILED",
						"text": "FAILED"
					}, {
						"key": "FILLED",
						"text": "FILLED"
					}, {
						"key": "AUDIT-IN PROGRESS",
						"text": "AUDIT-IN PROGRESS"
					}, {
						"key": "REGISTERED",
						"text": "REGISTERED"
					}, {
						"key": "CANCELLED",
						"text": "CANCELLED"
					}]
				};
			} else {
				Obj = {
					"FSODetails_Status": [{
						"key": "AUDIT-COMPLETED",
						"text": "AUDIT-COMPLETED"
					}, {
						"key": "PENDING FULFILLMENT",
						"text": "PENDING FULFILLMENT"
					}, {
						"key": "FAILED",
						"text": "FAILED"
					}, {
						"key": "FILLED",
						"text": "FILLED"
					}, {
						"key": "AUDIT-IN PROGRESS",
						"text": "AUDIT-IN PROGRESS"
					}, {
						"key": "REGISTERED",
						"text": "REGISTERED"
					}, {
						"key": "CANCELLED",
						"text": "CANCELLED"
					}]
				};

			}

			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"), "globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));

			var AuditModel = new sap.ui.model.json.JSONModel();
			var Object;
			if (language == "EN") {
				Object = {
					"FSODetail_AuditStatus": [{
						"key": "",
						"text": "ALL"
					}, {
						"key": "IN-PROGRESS",
						"text": "IN-PROGRESS"
					}, {
						"key": "COMPLETE",
						"text": "COMPLETE"
					}],

				};

			} else {
				Object = {
					"FSODetail_AuditStatus": [{
						"key": "",
						"text": "ALL"
					}, {
						"key": "IN-PROGRESS",
						"text": "IN-PROGRESS"
					}, {
						"key": "COMPLETE",
						"text": "COMPLETE"
					}],
				};

			}

			AuditModel.setData(Object);
			AuditModel.updateBindings(true);
			sap.ui.getCore().setModel(AuditModel, "AuditModel");
			this.getView().setModel(sap.ui.getCore().getModel("AuditModel"), "AuditModel");
			console.log(sap.ui.getCore().getModel("AuditModel"));
		},
		_onObjectMatched: function (oEvent) {
			
			clicks = 0;
			num = 0;
			var oModel = new sap.ui.model.json.JSONModel();
			FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
			if (AppController.flagZoneUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagNationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagTCINationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}

			FSOD_controller.dialog = new sap.m.BusyDialog({
				text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
			});

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";

			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Emphasized');
			this.getView().byId("idmenu9").setType('Transparent');
			var mcb_status_FSOD = FSOD_controller.getView().byId("mcb_status_FSOD");
			var mcb_series_FSOD = FSOD_controller.getView().byId("mcb_series_FSOD");
			var mcb_ordTyp_FSOD = FSOD_controller.getView().byId("mcb_ordTyp_FSOD");
			var mcb_auditStatus_FSOD = FSOD_controller.getView().byId("mcb_auditStatus_FSOD");
			var mcb_dealer_FSOD = FSOD_controller.getView().byId("mcb_dealer_FSOD");

			// mcb_series_FSOD.setSelectedItems(mcb_series_FSOD.getItems());
			mcb_status_FSOD.setSelectedItems(mcb_status_FSOD.getItems());
			mcb_auditStatus_FSOD.setSelectedItems(mcb_auditStatus_FSOD.getItems());
			mcb_dealer_FSOD.setSelectedItems(mcb_dealer_FSOD.getItems());
			// var page = 0;
			// page = clicks + 1;
			// FSOD_controller.getView().byId("txtPageNum").setText("Page" + page);
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var dfilter = [];
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				FSOD_controller.dialog.open();
				FSOD_controller._refresh();
			} else {
				FSOD_controller.dialog.open();
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}
						var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
						if (DataModel.getData().length != undefined) {
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
					}
				});
			}
		},

		onBeforeRendering: function () {
			if (AppController.flagZoneUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagNationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagTCINationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
		},

		onAfterRendering: function () {
			//-----------------------------------------------------------
			//-----Binding without Fleet Reference----------------------
			//----------------------------------------------------------
			// var mcb_status_FSOD = FSOD_controller.getView().byId("mcb_status_FSOD");
			// var mcb_series_FSOD = FSOD_controller.getView().byId("mcb_series_FSOD");
			// var mcb_ordTyp_FSOD = FSOD_controller.getView().byId("mcb_ordTyp_FSOD");
			// var mcb_auditStatus_FSOD = FSOD_controller.getView().byId("mcb_auditStatus_FSOD");
			// var mcb_dealer_FSOD = FSOD_controller.getView().byId("mcb_dealer_FSOD");

			// // mcb_series_FSOD.setSelectedItems(mcb_series_FSOD.getItems());
			// mcb_status_FSOD.setSelectedItems(mcb_status_FSOD.getItems());
			// mcb_auditStatus_FSOD.setSelectedItems(mcb_auditStatus_FSOD.getItems());
			// mcb_dealer_FSOD.setSelectedItems(mcb_dealer_FSOD.getItems());
			// // var page = 0;
			// // page = clicks + 1;
			// // FSOD_controller.getView().byId("txtPageNum").setText("Page" + page);
			// //=======================================================================================================
			// //==================Start Binidng By Dealer=========================================================
			// //=====================================================================================================
			// var dfilter = [];
			// var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			// if (x != "TCI_User") {
			// 	FSOD_controller.dialog.open();
			// 	FSOD_controller._refresh();
			// } else {
			// 	FSOD_controller.dialog.open();
			// 	var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
			// 	for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
			// 		var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
			// 		oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
			// 		if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
			// 			oUrl = oUrl + ") and (";
			// 		} else {
			// 			oUrl = oUrl + " or ";
			// 		}
			// 	}
			// 	for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			// 		var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			// 		oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
			// 		if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
			// 			oUrl = oUrl + ") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
			// 		} else {
			// 			oUrl = oUrl + " or ";
			// 		}
			// 	}
			// 	$.ajax({
			// 		url: oUrl,
			// 		method: "GET",
			// 		async: false,
			// 		dataType: "json",
			// 		success: function (data, textStatus, jqXHR) {
			// 			FSOD_controller.dialog.close();
			// 			var BtnNext = FSOD_controller.getView().byId("buttonNext");
			// 			if (data.d.results.length <= 0) {
			// 				BtnNext.setEnabled(false);
			// 			} else {
			// 				BtnNext.setEnabled(true);
			// 			}
			// 			var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
			// 			if (DataModel.getData().length != undefined) {
			// 				for (var m = 0; m < data.d.results.length; m++) {
			// 					DataModel.getData().push(data.d.results[m]);
			// 					DataModel.updateBindings(true);
			// 					console.log("DataModel.getData()", DataModel.getData());
			// 				}
			// 			} else {
			// 				DataModel.setData(data.d.results);
			// 				DataModel.updateBindings(true);
			// 			}
			// 		},
			// 		error: function (jqXHR, textStatus, errorThrown) {
			// 			FSOD_controller.dialog.close();
			// 			var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
			// 			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			// 		}
			// 	});
			// }
		},
		_navToRSO: function (evt) {
			FSOD_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
		},
		_refresh: function (oEvent) {

			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}
						var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
						if (DataModel.getData().length != undefined) {
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (filter == false) {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							FSOD_controller.dialog.close();
							var BtnNext = FSOD_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							FSOD_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "'))";
					oUrl = oUrl + "and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
							var BtnNext = FSOD_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
			clicks = 0;
			num = 0;
			// var page = clicks + 1;
			// FSOD_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);
		},
		_refreshCombo: function (evt) {
			FSOD_controller.dialog.open();
			filter = true;
			var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
			for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
				var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
				if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
				var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
				if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
			oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "'))";
			oUrl = oUrl + "and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";

			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
					var BtnNext = FSOD_controller.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
					} else {
						BtnNext.setEnabled(true);
					}
					var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
					if (DataModel.getData().length != undefined) {
						for (var m = 0; m < data.d.results.length; m++) {
							DataModel.getData().push(data.d.results[m]);
							DataModel.updateBindings(true);
							console.log("DataModel.getData()", DataModel.getData());
						}
					} else {
						DataModel.setData(data.d.results);
						DataModel.updateBindings(true);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				}
			});
			clicks = 0;
			num = 0;
			// var page = clicks + 1;
			// FSOD_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);

		},
		onLinkVehicle: function (evt) {
			zrequest = evt.getSource().getBindingContext('mainservices').getProperty('ZzsoReqNo');
			var d = new sap.ui.jsfragment(FSOD_controller.createId("idFrag_FSOD"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				FSOD_controller);
			FSOD_controller.getView().addDependent(d);
			d.open();
		},
		_searchNLink: function (evt) {
			var vinVal = FSOD_controller.byId("idFrag_FSOD--VinIdFrag").getValue();
			var vtinVal = FSOD_controller.byId("idFrag_FSOD--VtinIdFrag").getValue();
			var V_No;
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				if (vinVal !== "") {
					V_No = vinVal;
				} else {
					V_No = vtinVal;
				}
				FSOD_controller.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
					method: "POST",
					urlParameters: {
						Zzvtn: V_No,
						ZzsoReqNo: zrequest
							//	Endcustomer:
					}, // function import parameters
					success: function (oData, response) {
						FSOD_controller.dialog.close();
						if (oData.Type == 'E') {
							var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000013", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
								.m.MessageBox.Action.OK, null, null);
						} else {
							var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000014", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap
								.m.MessageBox.Action.OK, null, null);
							var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
							var items = oTbl.getBinding('rows');
							items.refresh();
						}
					},
					error: function (oError) {
						FSOD_controller.dialog.close();}
				});

			}
		},
		onActionNext: function (oEvent) {
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 10;
			// if (num >= 10) {
			// 	var BtnPrev = this.getView().byId("buttonPrev");
			// 	BtnPrev.setEnabled(true);
			// }
			FSOD_controller.data();
		},
		data: function (oEvent) {
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			FSOD_controller.dialog.open();
			if (x != "TCI_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=" + num + "&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}
						var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
						if (DataModel.getData().length != undefined) {
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
						// var oModel = new sap.ui.model.json.JSONModel();

						// oModel.setData(data.d.results);
						// if (data.d.results.length == undefined || data.d.results.length == 0) {

						// 	var BtnNext = FSOD_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// } else if (data.d.results.length < 10) {
						// 	var BtnNext = FSOD_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// 	FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
						// } else {
						// 	var BtnNext = FSOD_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(true);
						// 	FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
					}
				});
			} else {
				if (filter == false) {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=" + num + "&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
							var BtnNext = FSOD_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// if (data.d.results.length == undefined) {

							// 	var BtnNext = FSOD_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// } else if (data.d.results.length < 10) {
							// 	var BtnNext = FSOD_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
							// } else {
							// 	var BtnNext = FSOD_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);

							// 	FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				} else {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "'))";
					oUrl = oUrl + "and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
						FSOD_controller.dialog.close();
							var BtnNext = FSOD_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
						FSOD_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
			// var page = clicks + 1;
			// FSOD_controller.getView().byId("txtPageNum").setText("Page" + page);
		},
		onLiveSOChange:function(oEvent){
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnSuperSearch();
		},
		fnSuperSearch: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new Sorter("ZzsoReqNo", this.bDescending));

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("ZzsoReqNo", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzdealerCode", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzmodel", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzapx", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzextcol", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzsoStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzAuditStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
				], false);

				aFilters = new sap.ui.model.Filter([oFilter], true);
			}
			this.byId("tbl_FSOD").getBinding().filter(aFilters).sort(aSorters);
		}
	});

});