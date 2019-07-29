sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var RSOS_controller, zrequest, clicks = 0,
		num, page = 0,
		count1 = 11000,
		filter = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {
			RSOS_controller = this;
			AppController.getDealer();
			RSOS_controller.getView().setModel(sap.ui.getCore().getModel("seriesModel"), "seriesModel");
			console.log("series data", sap.ui.getCore().getModel("seriesModel"));
			RSOS_controller.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onObjectMatched, RSOS_controller);
		},
		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameter("name") == "RetailSoldOrderSummary") {
				num = 0;
				RSOS_controller = this;
				var RSOModel = new sap.ui.model.json.JSONModel();
				RSOModel.setData({
					RSOBusyIndicator: false
				});

				RSOS_controller.getView().setModel(RSOModel, "RSOModel");
				console.log(sap.ui.getCore().getModel("LoginUserModel"));
				// RSOS_controller._handleServiceSuffix_Series();
				RSOS_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");

				var oModel = new sap.ui.model.json.JSONModel();
				RSOS_controller.getView().setModel(oModel, "retailsumModel");
				console.log(language);
				RSOS_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
				var globalComboModel = new sap.ui.model.json.JSONModel();
				var Obj;
				if (language == "EN") {
					Obj = {
						"FSOSummary_Status": [{
							"key": "IN-PROGRESS",
							"text": "IN-PROGRESS"
						}, {
							"key": "PENDING FULFILLMENT",
							"text": "PENDING FULFILLMENT"
						}, {
							"key": "FILLED",
							"text": "FILLED"
						}, {
							"key": "REGISTERED",
							"text": "REGISTERED"
						}, {
							"key": "CANCELLED",
							"text": "CANCELLED"
						}, {
							"key": "REQUESTED",
							"text": "REQUESTED"
						}, {
							"key": "APPROVED",
							"text": "APPROVED"
						}, {
							"key": "REJECTED",
							"text": "REJECTED"
						}, {
							"key": "COMPLETED",
							"text": "COMPLETED"
						}]
					};
				} else {
					Obj = {
						"FSOSummary_Status": [{
							"key": "IN-PROGRESS",
							"text": "IN-PROGRESS"
						}, {
							"key": "PENDING FULFILLMENT",
							"text": "PENDING FULFILLMENT"
						}, {
							"key": "FILLED",
							"text": "FILLED"
						}, {
							"key": "REGISTERED",
							"text": "REGISTERED"
						}, {
							"key": "CANCELLED",
							"text": "CANCELLED"
						}, {
							"key": "REQUESTED",
							"text": "REQUESTED"
						}, {
							"key": "APPROVED",
							"text": "APPROVED"
						}, {
							"key": "REJECTED",
							"text": "REJECTED"
						}, {
							"key": "COMPLETED",
							"text": "COMPLETED"
						}]
					};
				}
				globalComboModel.setData(Obj);
				globalComboModel.updateBindings(true);
				sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
				this.getView().setModel(globalComboModel, "globalComboModel");
				console.log("globalComboModel", globalComboModel);
				var AuditModel = new sap.ui.model.json.JSONModel();
				var Object;
				if (language == "EN") {
					Object = {
						"AuditStatus": [{
							"key": "IN-PROGRESS",
							"text": "IN-PROGRESS"
						}, {
							"key": "COMPLETE",
							"text": "COMPLETE"
						}, {
							"key": "",
							"text": "ALL"
						}]
					};
				} else {
					Object = {
						"AuditStatus": [{
							"key": "IN-PROGRESS",
							"text": "IN-PROGRESS"
						}, {
							"key": "COMPLETE",
							"text": "COMPLETE"
						}, {
							"key": "",
							"text": "ALL"
						}]
					};
				}
				AuditModel.setData(Object);
				AuditModel.updateBindings(true);
				sap.ui.getCore().setModel(AuditModel, "AuditModel");
				this.getView().setModel(sap.ui.getCore().getModel("AuditModel"), "AuditModel");
				console.log(sap.ui.getCore().getModel("AuditModel"));

				// 			////////////////////////////////////////////////////////////////////////////////

				this.getView().byId("idmenu1").setType("Transparent");
				this.getView().byId("idmenu2").setType("Emphasized");
				this.getView().byId("idmenu3").setType("Transparent");
				this.getView().byId("idmenu4").setType("Transparent");
				this.getView().byId("idmenu5").setType("Transparent");
				this.getView().byId("idmenu9").setType("Transparent");
				this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"), "globalComboModel");
				this.getView().setModel(sap.ui.getCore().getModel("AuditModel"), "AuditModel");

				/////////////////////////////// changes done 

				// this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"),"globalComboModel");
				var mcb_series_RSOS = RSOS_controller.getView().byId("mcb_series_RSOS");
				var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
				var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
				var mcb_dealer_RSOS = RSOS_controller.getView().byId("mcb_dealer_RSOS");
				mcb_series_RSOS.setSelectedItems(mcb_series_RSOS.getItems());
				mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
				mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
				mcb_dealer_RSOS.setSelectedItems(mcb_dealer_RSOS.getItems());

				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					this.sPrefix = "/soldorder_node";
				} else {
					this.sPrefix = "";
				}
				this.nodeJsUrl = this.sPrefix + "/node";

				var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
				if (isDivisionSent) {
					this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				}

				//=======================================================================================================
				//==================Start Binidng By Dealer=========================================================
				//=====================================================================================================
				var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
				if (x != "TCI_User") {
					sap.ui.core.BusyIndicator.show(0);
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);
					console.log("loading data");
					RSOS_controller._refresh();

				} else {
					sap.ui.core.BusyIndicator.show(0);
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);
					console.log("loading data");

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
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
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 10) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
								}
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// 	"error"), sap.m.MessageBox.Action.OK, null, null);
							sap.m.MessageToast.show(errMsg);
						}
					});
				}
			}
		},
		onAfterRendering: function () {

		},
		_handleServiceSuffix_Series: function () {
			// sap.ui.core.BusyIndicator.show(100);
			sap.ui.core.BusyIndicator.show(0);
			// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);

			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			var brand;
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				if (this.sDivision == "10")
				// set the toyoto logo
				{
					brand = "TOY";
				} else {
					// set the lexus logo
					brand = "LEX"; // }
				}
			}
			// sap.ui.core.BusyIndicator.show(0);
			var oUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X' and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					sap.ui.core.BusyIndicator.hide();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);

				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
					// 	"error"), sap.m.MessageBox.Action.OK, null, null);
					sap.m.MessageToast.show(errMsg);
				}
			});
		},
		_refreshCombo: function (evt) {
			sap.ui.core.BusyIndicator.show(0);
			// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);

			filter = true;
			var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
			for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
				var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
				if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}

			}
			for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
				var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
				if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
				var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(Zzseries eq '" + series + "')";
				if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			var dealer = this.getView().byId("cb_dealer_RSOS").getSelectedKey();
			oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')) and (FleetReference eq '')&$orderby=ZzsoReqNo desc";

			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					sap.ui.core.BusyIndicator.hide();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var BtnNext = RSOS_controller.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = RSOS_controller.getView().getModel("retailsumModel");
					if (DataModel.getData().length != undefined) {
						for (var m = 0; m < data.d.results.length; m++) {
							DataModel.getData().push(data.d.results[m]);
							DataModel.updateBindings(true);
							console.log("DataModel.getData()", DataModel.getData());
						}
					} else {
						DataModel.setData(data.d.results);
						DataModel.updateBindings(true);
						if (data.d.results.length <= 10) {
							BtnNext.setEnabled(false);
						}
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
					// 	"error"), sap.m.MessageBox.Action.OK, null, null);
					sap.m.MessageToast.show(errMsg);

				}
			});

		},
		_refresh: function (oEvent) {
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
					var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(Zzseries eq '" + series + "')";
					if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				// sap.ui.core.BusyIndicator.show(0);
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						sap.ui.core.BusyIndicator.hide();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
						var BtnNext = RSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						if (DataModel.getData().length != undefined) {
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
							if (data.d.results.length <= 10) {
								BtnNext.setEnabled(false);
							}
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.ui.core.BusyIndicator.hide();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageToast.show(errMsg);
						// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
						// "error"), sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (filter == false) {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
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
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// 	"error"), sap.m.MessageBox.Action.OK, null, null);
							sap.m.MessageToast.show(errMsg);

						}
					});
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// for (var i = 0; i < this.getView().byId("cb_dealer_RSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("cb_dealer_RSOS").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')) and (FleetReference eq '')&$orderby=ZzsoReqNo desc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// 	"error"), sap.m.MessageBox.Action.OK, null, null);
							sap.m.MessageToast.show(errMsg);

						}
					});

				}
			}
		},
		_dispalySoldOrderDetails: function (evt) {
			RSOS_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
		},
		_createNewOrder: function () {
			RSOS_controller.getOwnerComponent().getRouter().navto("RetailSoldOrderA", {}, true);
		},
		onLinkVehicle: function (evt) {
			zrequest = evt.getSource().getBindingContext("mainservices").getProperty("ZzsoReqNo");
			var d = new sap.ui.jsfragment(RSOS_controller.createId("idFrag_RSOS"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				RSOS_controller);
			RSOS_controller.getView().addDependent(d);
			d.open();
		},
		_searchNLink: function (evt) {
			sap.ui.core.BusyIndicator.show(0);
			// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);
			var vinVal = RSOS_controller.byId("idFrag_RSOS--VinIdFrag").getValue();
			var vtinVal = RSOS_controller.byId("idFrag_RSOS--VtinIdFrag").getValue();
			var V_No;
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
					"error"), sap.m.MessageBox.Action.OK, null, null);
			} else {
				if (vinVal !== "") {
					V_No = vinVal;
				} else {
					V_No = vtinVal;
				}
				RSOS_controller.getView().getModel("mainservices").callFunction("/RSO_VTN_ASSIGN", {
					method: "POST",
					urlParameters: {
						Zzvtn: V_No,
						ZzsoReqNo: zrequest //	Endcustomer:
					},
					// function import parameters
					success: function (oData, response) {
						sap.ui.core.BusyIndicator.hide();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
						if (oData.Type == "E") {
							var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000013", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);
						} else {
							var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000014", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap.m.MessageBox.Action.OK, null, null);
							var oTbl = RSOS_controller.getView().byId("tbl_FSOD");
							var items = oTbl.getBinding("rows");
							items.refresh();
						}
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					}
				});
			}
		},
		closeDialog: function () {
			//var oDialogBox = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.VinDialog", RSOS_controller);
			//	RSOS_controller.oDialogBox.close();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionNext: function (oEvent) {
			sap.ui.core.BusyIndicator.show(0);
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 50;

			if (num === count1) {
				var BtnNext = this.getView().byId("buttonNext");
				BtnNext.setEnabled(false);
			}
			RSOS_controller.data();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionPrevious: function (oEvent) {
			//This code was generated by the layout editor.
			clicks -= 1;
			if (clicks <= 0) {
				num = 0;
			} else {
				num = clicks * 50;
			}
			if (num < count1) {
				var BtnNext = this.getView().byId("buttonNext");
				BtnNext.setEnabled(true);
			}
			if (num === 0) {
				var Btn = this.getView().byId("buttonPrev");
				Btn.setEnabled(false);
			}
			RSOS_controller.data();
		},
		data: function (oEvent) {
			sap.ui.core.BusyIndicator.show(0);
			// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);

			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=" + num + "&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
					var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(Zzseries eq '" + series + "')";
					if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				// sap.ui.core.BusyIndicator.show(0);
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						sap.ui.core.BusyIndicator.hide();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
						var BtnNext = RSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						if (DataModel.getData().length != undefined) {

							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							if (data.d.results.length <= 10) {
								BtnNext.setEnabled(false);
							}
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}

					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.ui.core.BusyIndicator.hide();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
						// var page = clicks + 1;
						// RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
						// 	"error"), sap.m.MessageBox.Action.OK, null, null);
						sap.m.MessageToast.show(errMsg);
					}
				});
			} else {
				if (filter == false) {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=" + num + "&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
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
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {

								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// 	"error"), sap.m.MessageBox.Action.OK, null, null);
							sap.m.MessageToast.show(errMsg);

						}
					});
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=" + num + "&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((this.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// for (var i = 0; i < this.getView().byId("cb_dealer_RSOS").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("cb_dealer_RSOS").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq'" + dealer + "')) and (FleetReference eq '')&$orderby=ZzsoReqNo desc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// 	"error"), sap.m.MessageBox.Action.OK, null, null);
							sap.m.MessageToast.show(errMsg);

						}
					});

				}
				// var page = clicks + 1;
				// RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			}
		},
		onLiveChange: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrdering();
		},
		fnApplyFiltersAndOrdering: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("ZzsoReqNo", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzdealerCode", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzAuditStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzsoStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
				], false);
				// this.sSearchQuery);
				aFilters.push(oFilter);
			}
		}
	});
});