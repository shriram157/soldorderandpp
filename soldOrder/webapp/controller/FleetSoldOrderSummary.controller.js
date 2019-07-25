sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, formatter, Filter, FilterOperator) {
	"use strict";
	var FSOS_controller, clicks = 0,
		num = 0,
		fleet = false;
	return Controller.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {
			FSOS_controller = this;
			// AppController.getDealer();
			FSOS_controller.getBrowserLanguage();
			var language = FSOS_controller.returnBrowserLanguage();
			FSOS_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if (language == "EN") {
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
						"key": "PROCESSED",
						"text": "PROCESSED"
					}]
				};
			} else {
				Obj = {
					"FSOSummary_Status": [

						{
							"key": "REQUESTED",
							"text": "REQUESTED"
						}, {
							"key": "APPROVED",
							"text": "APPROVED"
						}, {
							"key": "REJECTED",
							"text": "REJECTED"
						}, {
							"key": "PROCESSED",
							"text": "PROCESSED"
						}
					]
				};

			}

			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"), "globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));

			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			if (language == "EN") {
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

			}

			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(sap.ui.getCore().getModel("OrderTypeModel"), "OrderTypeModel");
			console.log(sap.ui.getCore().getModel("OrderTypeModel"));
			/*	FSOS_controller.flagSipUser = false;
				FSOS_controller.requestStatus = "";*/
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrderSummary").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			FSOS_controller.getView().setModel(oModel, "fleetsumModel");
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
			var host = FSOS_controller.host();
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				FSOS_controller._refresh();
			} else {

				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=0&$filter=(";
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
						oUrl = oUrl + ")&$orderby=ZsoFltReqNo desc";
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
						// FSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
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
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
						// var oModel = new sap.ui.model.json.JSONModel();

						// oModel.setData(data.d.results);
						// if (data.d.results.length == undefined) {

						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// } else if (data.d.results.length < 10) {
						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
						// } else {
						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(true);
						// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {

						var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});

			}
			// clicks = 0;
			// num = 0;
			// var page = clicks + 1;
			// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);
		},
		_refreshCombo: function (evt) {
			fleet = true;
			var host = FSOS_controller.host();

			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=0&$filter=(";
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
			var dealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();
			oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";

			oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
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
							console.log("DataModel.getData()", DataModel.getData());
						}
					} else {
						DataModel.setData(data.d.results);
						DataModel.updateBindings(true);
					}
					// var oModel = new sap.ui.model.json.JSONModel();

					// oModel.setData(data.d.results);
					// if (data.d.results.length == undefined) {

					// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
					// 	BtnNext.setEnabled(false);
					// } else if (data.d.results.length < 10) {
					// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
					// 	BtnNext.setEnabled(false);
					// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
					// } else {
					// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
					// 	BtnNext.setEnabled(true);
					// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
					// }
				},
				error: function (jqXHR, textStatus, errorThrown) {

					var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}
			});
			// clicks = 0;
			// num = 0;
			// var page = clicks + 1;
			// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);

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
			var vinVal = FSOS_controller.getView().byId("vin_FSOS").getValue();
			var vtinVal = FSOS_controller.getView().byId("vtin_FSOS").getValue();

			var errForm = formatter.formatErrorType("SO000010");
			var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

		},
		_refresh: function (oEvent) {
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			var host = FSOS_controller.host();
			if (x != "TCI_User") {

				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=0&$filter=(";
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
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";
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
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
						// var oModel = new sap.ui.model.json.JSONModel();

						// oModel.setData(data.d.results);
						// if (data.d.results.length == undefined) {

						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// } else if (data.d.results.length < 10) {
						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
						// } else {
						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(true);
						// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {

						var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (fleet == false) {
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=0&$filter=(";
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
							oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";
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
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// if (data.d.results.length == undefined) {

							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// } else if (data.d.results.length < 10) {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// } else {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {

							var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=0&$filter=(";
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

					// for (var i = 0; i < this.getView().byId("cb_dealer_FSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
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
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// if (data.d.results.length == undefined) {

							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// } else if (data.d.results.length < 10) {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// } else {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {

							var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});

				}

			}

			// clicks = 0;
			// num = 0;
			// var page = clicks + 1;
			// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);
		},
		onActionNext: function (oEvent) {
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 50;
			// if (num === count1) {
			// 	var BtnNext = this.getView().byId("buttonNext");
			// 	BtnNext.setEnabled(false);
			// }
			// if (num >= 10) {
			// 	var BtnPrev = this.getView().byId("buttonPrev");
			// 	BtnPrev.setEnabled(true);
			// }
			FSOS_controller.data();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		// onActionPrevious: function (oEvent) {
		// 	//This code was generated by the layout editor.
		// 	clicks -= 1;
		// 	if (clicks <= 0) {
		// 		num = 0;
		// 	} else {
		// 		num = clicks * 10;
		// 	}
		// if (num === 0) {
		// 	var Btn = this.getView().byId("buttonPrev");
		// 	Btn.setEnabled(false);
		// }
		// 	FSOS_controller.data();
		// },
		data: function (oEvent) {
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			var host = FSOS_controller.host();
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=" + num + "&$filter=(";
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
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_FSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";
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
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
						// var page = clicks + 1;
						// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
						// var oModel = new sap.ui.model.json.JSONModel();

						// oModel.setData(data.d.results);
						// if (data.d.results.length == undefined || data.d.results.length == 0) {

						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// } else if (data.d.results.length < 10) {
						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
						// } else {
						// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(true);

						// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {

						// var page = clicks + 1;
						// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
						var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (fleet == false) {
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=" + num + "&$filter=(";
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
							oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";
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
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var page = clicks + 1;
							// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// if (data.d.results.length == undefined || data.d.results.length == 0) {

							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// } else if (data.d.results.length < 10) {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// } else {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);

							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {

							// var page = clicks + 1;
							// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
							var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});

				} else {

					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet?$top=50&$skip=" + num + "&$filter=(";
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
					var dealer = this.getView().byId("cb_dealer_FSOS").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";

					oUrl = oUrl + ") &$orderby=ZsoFltReqNo desc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
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
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// if (data.d.results.length == undefined) {

							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// } else if (data.d.results.length < 10) {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// } else {
							// 	var BtnNext = FSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// 	FSOS_controller.getView().setModel(oModel, "fleetsumModel");
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {

							var errMsg = FSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});

				}
			}

			// var page = clicks + 1;
			// FSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
		},

	});

});