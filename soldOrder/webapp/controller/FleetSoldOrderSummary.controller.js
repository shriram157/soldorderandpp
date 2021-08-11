sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, formatter, Sorter, Filter, FilterOperator) {
	"use strict";
	var FSOS_controller, clicks = 0,
		num = 0,
		fleet = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return Controller.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {
			FSOS_controller = this;
			FSOS_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			
			FSOS_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			//Added by singhmi for Zone Approved key and text DMND0002946 on 11/03/2021
			if (language === "EN") {
				Obj = {
					"FSOSummary_Status": [{
						"key": "REQUESTED",
						"text": "REQUESTED"
					}, {
						"key": "APPROVED",
						"text": "APPROVED"
					}, {
						"key": "REJECTED",
						"text": "REJECTED"
					}, {
						"key": "ZONE APPROVED",
						"text": "ZONE APPROVED"
					}, {
						"key": "PROCESSED",
						"text": "PROCESSED"
					}]
				};
			} else {
				Obj = {
					"FSOSummary_Status": [{
						"key": "REQUESTED",
						"text": "REQUESTED"
					}, {
						"key": "APPROVED",
						"text": "APPROVED"
					}, {
						"key": "REJECTED",
						"text": "REJECTED"
					}, {
						"key": "ZONE APPROVED",
						"text": "ZONE APPROVED"
					}, {
						"key": "PROCESSED",
						"text": "PROCESSED"
					}]
				};
			}

			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(globalComboModel, "globalComboModel");
			// console.log("globalComboModel",globalComboModel);

			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			// if (language == "EN") {
			if (window.location.search.match(/Division=([^&]*)/i)[1] == "10") {
				Object = {
					"FSOSummary_OrderType": [{
						"key": "F1",
						"text": "DLR RAC"
					}, {
						"key": "F2",
						"text": "DLR ELITE"
					}, {
						"key": "F3",
						"text": "NAT RAC"
					}, {
						"key": "F4",
						"text": "NAT ELITE"
					}, {
						"key": "F5",
						"text": "MOBILITY"
					}],
				};

			} else {
				Object = {
					"FSOSummary_OrderType": [
						// 	{
						// 	"key": "F1",
						// 	"text": "DLR RAC"
						// }, 
						{
							"key": "F2",
							"text": "DLR ELITE"
						},
						// {
						// 	"key": "F3",
						// 	"text": "NAT RAC"
						// }, 
						{
							"key": "F4",
							"text": "NAT ELITE"
						}
						// , 
						// {
						// 	"key": "F5",
						// 	"text": "MOBILITY"
						// }
					],
				};

			}

			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(OrderTypeModel, "OrderTypeModel");
			// console.log("OrderTypeModel",OrderTypeModel);
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrderSummary").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			FSOS_controller.getView().setModel(oModel, "fleetsumModel");

			// FSOLocalModel.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			// FSOLocalModel.getView().getModel("LoginUserModel").setSizeLimit(750);
			// FSOLocalModel.getView().getModel("LoginUserModel").updateBindings(true);
			var FSOLocalModel = new sap.ui.model.json.JSONModel();
			FSOLocalModel.setData({
				FSOBusyIndicator: false
			});
			FSOS_controller.dialog = new sap.m.BusyDialog({
				text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
			});

			num = 0;
			clicks = 0;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";

			FSOS_controller.getView().setModel(FSOLocalModel, "FSOLocalModel");
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Emphasized');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Transparent');
			FSOS_controller.getView().byId("idmenu11").setType('Transparent');
			var mcb_status_FSOS = FSOS_controller.getView().byId("mcb_status_FSOS");
			var mcb_ordTyp_FSOS = FSOS_controller.getView().byId("mcb_ordTyp_FSOS");
			var mcb_dealer_FSOS = FSOS_controller.getView().byId("mcb_dealer_FSOS");
			var oTbl = FSOS_controller.getView().byId("tbl_FSOS");
			var data = oTbl.getModel().getData().ProductCollection;

			mcb_ordTyp_FSOS.setSelectedItems(mcb_ordTyp_FSOS.getItems());
			mcb_dealer_FSOS.setSelectedItems(mcb_dealer_FSOS.getItems());
			// var host = FSOS_controller.host();
			//=======================================================================================================
			//==================Start Bindidng By Dealer=========================================================
			//=====================================================================================================
			//Added by singhmi added for National Fleet User DMND0002946 on 11/03/2021
			var SoFleetModel = this.getOwnerComponent().getModel("mainservices");
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x === "National_Fleet_User") {
				//mcb_status_FSOS.setSelectedItems([mcb_status_FSOS.getItems()[3]]);
				mcb_status_FSOS.setSelectedKeys(["ZONE APPROVED"]);
				this.getView().byId("cb_dealer_FSOS").setSelectedKey("");
				if (this.getView().byId("cb_dealer_FSOS").getSelectedKey() == "") {
					SoFleetModel.read("/SO_FLEET_HeaderSet", {
						urlParameters: {
							"$filter": "ZsoFltStatus eq 'ZONE APPROVED'"
						},
						success: $.proxy(function (sdata) {
							var DataModel = FSOS_controller.getView().getModel("fleetsumModel");
							DataModel.setData(sdata.results);
							DataModel.updateBindings(true);
						}, this),
						error: function (err) {
							sap.m.MessageToast.show(err);
						}
					});
				}
			} else if (x === "TCI_Zone_User" || x === "TCI_User") {
				mcb_status_FSOS.setSelectedKeys(["REQUESTED", "APPROVED", "ZONE APPROVED", "REJECTED"]);
				clicks = 0;
				fleet = true;

				var orderVal = FSOS_controller.getView().getModel("OrderTypeModel").getData().FSOSummary_OrderType;
				var orderLen = orderVal.length;
				FSOS_controller.dialog.open();

				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=100&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZsoFltStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < orderLen; i++) {
					var orderno = orderVal[i].key;
					oUrl = oUrl + "(Zadd1 eq '" + orderno + "')";
					if (i == ((orderLen) - 1)) {
						oUrl = oUrl;
					} else {
						oUrl = oUrl + " or ";
					}
				}

				oUrl = oUrl + ") &$orderby=ZzdealerCode asc,ZfanNo asc,ZpoNumber asc,ZsoFltStatus asc";

				FSOS_controller._fleetajaxCall(oUrl);
			} else {
				mcb_status_FSOS.setSelectedItems(mcb_status_FSOS.getItems());
			}
			//Added by singhmi for National Fleet User DMND0002946 on 11/03/2021
			//Changes done for INC0189944 by Minakshi odata call on load happen only for dealer not for other users.
			if (x === "Dealer_User") {
				FSOS_controller.dialog.open();
				//console.log("loading data");
				FSOS_controller._refresh();
			} else {
				FSOS_controller.getView().byId("cb_dealer_FSOS").setSelectedKey("");
			}
			//Changes done for INC0189944 by Minakshi end
		},

		_refreshCombo: function (evt) {
			clicks = 0;
			fleet = true;
			FSOS_controller.dialog.open();
			var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=100&$skip=0&$filter=(";
			for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
				var status = this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZsoFltStatus eq '" + status + "')";
				if (i == ((this.getView().byId("mcb_status_FSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
				var orderno = this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(Zadd1 eq '" + orderno + "')";
				if (i == ((this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl;
				} else {
					oUrl = oUrl + " or ";
				}
			}

			var sdealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();
			if (sdealer !== "") {
				oUrl = oUrl + ") and ((ZzdealerCode eq '" + sdealer + "')";
			}
			oUrl = oUrl + ") &$orderby=ZzdealerCode asc,ZfanNo asc,ZpoNumber asc,ZsoFltStatus asc";
			FSOS_controller._fleetajaxCall(oUrl);
		},

		_fleetajaxCall: function (oUrl) {
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					FSOS_controller.dialog.close();
					var BtnNext = FSOS_controller.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = FSOS_controller.getView().getModel("fleetsumModel");
					DataModel.setData(data.d.results);
					DataModel.updateBindings(true);

				},
				error: function (jqXHR, textStatus, errorThrown) {
					FSOS_controller.dialog.close();
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}
			});
		},

		_navToSoldOrder: function (evt) {
			FSOS_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
				Soreq: evt.getSource().getText()
			}, true);
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

			var errForm = formatter.formatErrorType("SO000010");
			var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

		},
		_refresh: function (oEvent) {
			clicks = 0;
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			//Added by singhmi DMND0002946 on 11/03/2021
			if (x !== "TCI_User" && x !== "TCI_Zone_User" && x !== "National_Fleet_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=100&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZsoFltStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
					var orderno = this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(Zadd1 eq '" + orderno + "')";
					if (i == ((this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") &$orderby=ZzdealerCode asc,ZfanNo asc,ZpoNumber asc,ZsoFltStatus asc";
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
						FSOS_controller.dialog.close();
						var BtnNext = FSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = FSOS_controller.getView().getModel("fleetsumModel");
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
						FSOS_controller.dialog.close();
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (fleet == false) {
					FSOS_controller.dialog.close();
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=100&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZsoFltStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
						var orderno = this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zadd1 eq '" + orderno + "')";
						if (i == ((this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl;
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// var dealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();
					// oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";

					var sdealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();
					if (sdealer !== "") {
						oUrl = oUrl + ") and ((ZzdealerCode eq '" + sdealer + "')";
					}
					oUrl = oUrl + ") &$orderby=ZzdealerCode asc,ZfanNo asc,ZpoNumber asc,ZsoFltStatus asc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							FSOS_controller.dialog.close();
							var BtnNext = FSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = FSOS_controller.getView().getModel("fleetsumModel");

							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);

						},
						error: function (jqXHR, textStatus, errorThrown) {
							FSOS_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
		},
		onActionNext: function (oEvent) {
			// FSOS_controller.dialog.open();
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 100;
			FSOS_controller.data();
		},
		data: function (oEvent) {
			FSOS_controller.dialog.open();
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			//Added by singhmi for National Fleet User DMND0002946 on 11/03/2021
			if (x !== "TCI_User" && x !== "TCI_Zone_User" && x !== "National_Fleet_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=100&$skip=" + num + "&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZsoFltStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
					var orderno = this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(Zadd1 eq '" + orderno + "')";
					if (i == ((this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}

				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_FSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") &$orderby=ZzdealerCode asc,ZfanNo asc,ZpoNumber asc,ZsoFltStatus asc";
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
						FSOS_controller.dialog.close();
						var BtnNext = FSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = FSOS_controller.getView().getModel("fleetsumModel");
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
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (fleet == false) {
					FSOS_controller.dialog.close();

				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=100&$skip=" + num + "&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_FSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_FSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZsoFltStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_FSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length; i++) {
						var orderno = this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zadd1 eq '" + orderno + "')";
						if (i == ((this.getView().byId("mcb_ordTyp_FSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl;
						} else {
							oUrl = oUrl + " or ";
						}
					}
					var sdealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();

					if (sdealer !== "") {
						oUrl = oUrl + ") and ((ZzdealerCode eq '" + sdealer + "')";
					}

					oUrl = oUrl + ") &$orderby=ZzdealerCode asc,ZfanNo asc,ZpoNumber asc,ZsoFltStatus asc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							FSOS_controller.dialog.close();
							var BtnNext = FSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = FSOS_controller.getView().getModel("fleetsumModel");
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
							FSOS_controller.dialog.close();
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
		},
		onLiveSOChange: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnSuperSearch();
		},
		fnSuperSearch: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new Sorter("ZsoFltReqNo", this.bDescending));

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("ZsoFltReqNo", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("NameOrg1", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzdealerCode", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZsoFltStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZfanNo", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZpoNumber", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzordtypedesc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzoneApproval", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZtotalVehQty", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
				], false);

				aFilters = new sap.ui.model.Filter([oFilter], true);
			}
			this.byId("tbl_FSOS").getBinding().filter(aFilters).sort(aSorters);
		}
	});
});