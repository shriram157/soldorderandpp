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
			// console.log(sap.ui.getCore().getModel("globalComboModel"));

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
			// console.log(sap.ui.getCore().getModel("AuditModel"));
			//FSOD_controller.enableExportButton();
		},
		_onObjectMatched: function (oEvent) {

			clicks = 0;
			num = 0;
			var oModel = new sap.ui.model.json.JSONModel();
			FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");

			// FSOD_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			// FSOD_controller.getView().getModel("LoginUserModel").setSizeLimit(750);
			// FSOD_controller.getView().getModel("LoginUserModel").updateBindings(true);

			// if (AppController.flagZoneUser == true) {
			// 	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			// }
			// if (AppController.flagNationalUser == true) {
			// 	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			// }
			// if (AppController.flagTCINationalUser == true) {
			// 	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			// }

			FSOD_controller.dialog = new sap.m.BusyDialog({
				text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
			});
			var BtnExport = FSOD_controller.getView().byId("idBtnExportToExcel_FSO");
			//	BtnExport.setEnabled(false);  // change 24 sep 

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			this.getView().byId("idmenu11").setType('Transparent');
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
			//INC0189944 change done by Minakshi to restrict the unwanted loading of data the 
			//data will default load only for dealer_user "start"

			// if (x != "TCI_User") {
			// 	FSOD_controller.dialog.open();
			// 	FSOD_controller._refresh();
			// } else {

			//Changes done for INC0189944 by Minakshi odata call on load happen only for dealer not for other users.
			if (x == "Dealer_User") {
				FSOD_controller.dialog.open();
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
					if (status != "") {
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
				}
				for (var j = 0; j < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; j++) {
					var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[j].getKey();
					if (audit != "") {
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (j == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc";
						} else {
							oUrl = oUrl + " or ";
						}
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
							FSOD_controller.enableExportButton();
						} else {
							BtnNext.setEnabled(true);
						}
						var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
						if (DataModel.getData().length != undefined) {
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								// console.log("DataModel.getData()", DataModel.getData());
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
				FSOD_controller.getView().byId("cb_dealer_FSOD").setSelectedKey("");
			}
			//Changes done for INC0189944 by Minakshi end
			//}
			//INC0189944 end
		},

		// onBeforeRendering: function () {
		// 	if (AppController.flagZoneUser == true) {
		// 		FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
		// 	}
		// 	if (AppController.flagNationalUser == true) {
		// 		FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
		// 	}
		// 	if (AppController.flagTCINationalUser == true) {
		// 		FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
		// 	}
		// },

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
			// 	var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
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
			clicks = 0;
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
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
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc";
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
							FSOD_controller.enableExportButton();
						} else {
							BtnNext.setEnabled(true);
						}
						var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
						// if (DataModel.getData().length != undefined) {
						// 	for (var m = 0; m < data.d.results.length; m++) {
						// 		DataModel.getData().push(data.d.results[m]);
						// 		DataModel.updateBindings(true);
						// 		console.log("DataModel.getData()", DataModel.getData());
						// 	}
						// } else {
						DataModel.setData(data.d.results);
						DataModel.updateBindings(true);
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
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
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
							oUrl = oUrl + ") and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc";
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
								FSOD_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							// if (DataModel.getData().length != undefined) {
							// 	for (var m = 0; m < data.d.results.length; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 		DataModel.updateBindings(true);
							// 		console.log("DataModel.getData()", DataModel.getData());
							// 	}
							// } else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {
							FSOD_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
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
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "'))";
					oUrl = oUrl + "and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc ";
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
								FSOD_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							// if (DataModel.getData().length != undefined) {
							// 	for (var m = 0; m < data.d.results.length; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 		DataModel.updateBindings(true);
							// 		console.log("DataModel.getData()", DataModel.getData());
							// 	}
							// } else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
							// }
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
			clicks = 0;
			FSOD_controller.dialog.open();
			filter = true;
			var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
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
			oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "'))";
			oUrl = oUrl + "and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc ";

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
						FSOD_controller.enableExportButton();
					} else {
						BtnNext.setEnabled(true);
					}
					var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
					// if (DataModel.getData().length != undefined) {
					// 	for (var m = 0; m < data.d.results.length; m++) {
					// 		DataModel.getData().push(data.d.results[m]);
					// 		DataModel.updateBindings(true);
					// 		console.log("DataModel.getData()", DataModel.getData());
					// 	}
					// } else {
					DataModel.setData(data.d.results);
					DataModel.updateBindings(true);
					// }
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
			var sPath = evt.oSource.oPropagatedProperties.oBindingContexts.fleetdetailsModel.sPath;
			var path = sPath.substring(1);
			var data = FSOD_controller.getView().getModel('fleetdetailsModel').getData();
			if (data) {
				zrequest = data[path].ZzsoReqNo;
			}
			//	zrequest = evt.getSource().getBindingContext('mainservices').getProperty('ZzsoReqNo');
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
						Zzvtn: vtinVal,
						Vhvin: vinVal,
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
							FSOD_controller._refresh();
							//		var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
							//		var items = oTbl.getBinding('rows');
							//		items.refresh();
						}
					},
					error: function (oError) {
						FSOD_controller.dialog.close();
					}
				});

			}
		},
		enableExportButton: function () {
			var BtnNext = FSOD_controller.getView().byId("buttonNext");
			var BtnExport = FSOD_controller.getView().byId("idBtnExportToExcel_FSO");
			if (BtnNext.getEnabled() == false) {
				BtnExport.setEnabled(true);
			} else {
				//BtnExport.setEnabled(false);
				BtnExport.setEnabled(true); // change 24 sep -requirement change
			}
		},
		onExport: function () {

			var data;
			var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
			if (DataModel != undefined) {
				data = DataModel.getData();
			} else {
				data = FSOD_controller.getView().byId("tbl_FSOD").getModel("fleetdetailsModel").getData();
			}
			FSOD_controller.JSONToExcelConvertor(data, "Report", true);

		},
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			//	var arrData = typeof JSONData.results != 'object' ? JSON.parse(JSONData.results) : JSONData.results;
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("orderNumber") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("FleetSO") + ","; //added by Minakshi for DMND0002960 
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("zoneAppNumber") + ","; //added by Minakshi for DMND0002960 
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("custname") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("dealer") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("modelYear") + ",";

			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Model") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Suffix") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Colour") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("APX") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Status") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("audit") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("vtn") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("vin") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("ETAFrom") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("ETATime") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("PONumber") + ","; //added by Minakshi for DMND0002960 
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("FanNum") + ","; //added by Minakshi for DMND0002960 
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CreationDate") + ","; //added by Minakshi for DMND0002960 
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("linkVehicle") + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				// console.log(arrData[i]);
				var row = "";
				row = " ";
				row += arrData[i].ZzsoReqNo + ',' +
					arrData[i].ZzsoFltReqNo + ',' +
					arrData[i].ZZONE_APPROVAL + ',' +
					arrData[i].ZzendcuName + ',' +
					//'="' + arrData[i].Dealer.substring(5, arrData[i].Dealer.length) + ',' +
					arrData[i].ZzdealerCode + ',' +
					arrData[i].Zzmoyr + ',' +

					arrData[i].Zzmodel + ',' +
					arrData[i].Zzsuffix + ',' +

					arrData[i].Zzextcol + ',' +
					arrData[i].Zzapx + ',' +
					arrData[i].ZzsoStatus + ',' +
					arrData[i].ZzAuditStatus + ',' +

					arrData[i].Zzvtn + ',' +
					arrData[i].Vhvin + ',' +
					//	arrData[i].ZzreqEtaFrom +',' +
					//	arrData[i].ZzreqEtaTo+ '",';
					FSOD_controller.dateConverter(arrData[i].ZzreqEtaFrom) + ',' +
					FSOD_controller.dateConverter(arrData[i].ZzreqEtaTo) + ',' +
					arrData[i].ZPO_NUMBER + ',' +
					arrData[i].ZFAN_NO + ',' +
					FSOD_controller.stringDateConverter(arrData[i].ZcreatedOn) + ',',
					//}
					row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				alert("Invalid data");
				return;
			}
			var fileName = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("FleetSoldOrderReport");

			//			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, sap.ui.getCore().getModel("i18n").getResourceBundle().getText("FleetSoldOrderReport") + ".csv");
			} else {
				var uri = 'data:text/csv;charset=utf-8,' + "\ufeff" + encodeURIComponent(CSV); //'data:application/vnd.ms-excel,' + escape(CSV);
				var link = document.createElement("a");

				link.href = uri;
				link.style = "visibility:hidden";
				link.download = fileName + ".csv";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		},
		dateConverter: function (_dVal) {
			// INC0190357 started by Minakshi 
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM-dd-yyyy"
			});
			if (_dVal !== null && _dVal !== undefined && _dVal != "") {
				// 	var str = _dVal;
				// 	var res = str.split(")");
				// 	var res2 = res[0].split("(");
				// 	var CDate = res2[1];
				// 	var strParse = parseInt(CDate);
				// 	var date1 = new Date(strParse);
				// 	var year = date1.getFullYear()
				// 	var month = date1.getMonth()
				// 	var day = date1.getDate()
				// 	return month + "/" + day + "/" + year;

				var sdateinMili = _dVal.split("/Date(")[1].split(")/")[0];
				var numDate = Number(sdateinMili);
				return oDateFormat.format(new Date(numDate));
			} else return "";
			// INC0190357 end by Minakshi
		},
		//added by Minakshi for DMND0002960 start
		stringDateConverter: function (val) {
			var sval, sdate;
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM-dd-yyyy"
			});
			if (val != "") {
				sdate = val.split(" ")[0];
				sval = oDateFormat.format(new Date(sdate));
			} else {
				sval = "";
			}
			return sval;
		},

		//added by Minakshi for DMND0002960 end

		onActionNext: function (oEvent) {
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 100;
			// if (num >= 10) {
			// 	var BtnPrev = this.getView().byId("buttonPrev");
			// 	BtnPrev.setEnabled(true);
			// }
			FSOD_controller.data();
		},

		data: function (oEvent) {
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			FSOD_controller.dialog.open();
			if (x != "TCI_User" || x != "National_Fleet_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
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
					if (audit != "") {
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc";
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
							FSOD_controller.enableExportButton();
						} else {
							BtnNext.setEnabled(true);
						}
						var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
						if (DataModel.getData().length != undefined) {
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								// console.log("DataModel.getData()", DataModel.getData());
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
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
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
						if (audit != "") {
							oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
							if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc";
							} else {
								oUrl = oUrl + " or ";
							}
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
								FSOD_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									// console.log("DataModel.getData()", DataModel.getData());
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
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
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
						if (audit != "") {
							oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
							if (i == ((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}
						}
					}
					var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "'))";
					oUrl = oUrl + "and (FleetReference eq 'X') and (ZzsoType ne 'SO')&$orderby=ZzsoReqNo desc ";

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
								FSOD_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}
							var DataModel = FSOD_controller.getView().getModel("fleetdetailsModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									// console.log("DataModel.getData()", DataModel.getData());
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
		onLiveSOChange: function (oEvent) {
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