sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet'
], function (BaseController, formatter, Sorter, Filter, MessageToast, FilterOperator, Export, ExportTypeCSV, exportLibrary, Spreadsheet) {
	"use strict";
	var RSOS_controller, zrequest, clicks = 0,
		num, page = 0,
		oUrl,
		// count1 = 11000,
		filter = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {
			RSOS_controller = this;
			AppController.getDealer();
			// RSOS_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			// RSOS_controller.getView().getModel("LoginUserModel").setSizeLimit(750);
			// RSOS_controller.getView().getModel("LoginUserModel").updateBindings(true);
			//	//console.log("series data", sap.ui.getCore().getModel("seriesModel"));
			this._fnLoadInitData();
			RSOS_controller.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onObjectMatched, RSOS_controller);

		},

		_fnLoadInitData: function () {
			//if (oEvent.getParameter("name") == "RetailSoldOrderSummary") {

			// RSOS_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			// RSOS_controller.getView().getModel("LoginUserModel").setSizeLimit(750);
			// RSOS_controller.getView().getModel("LoginUserModel").updateBindings(true);
			var seriesModel = new sap.ui.model.json.JSONModel();
			var data = sap.ui.getCore().getModel("seriesModel").getData();
			seriesModel.setData(data);
			RSOS_controller.getView().setModel(seriesModel, "seriesModel");                   
			if (data[0].ModelSeriesNo !== "ALL") {                            
				seriesModel.getData().unshift({
					"Division": "",
					"ModelSeriesNo": "ALL",
					"ProductHierarchy": "",
					"ProfitCenter": "",
					"SeriesSequenceNumber": "",
					"TCIModelDescriptionEN": "",
					"TCIModelDescriptionFR": "",
					"TCISeriesDescriptionEN": "All",
					"TCISeriesDescriptionFR": "Toute",
					"zzzadddata2": "X",
					"zzzadddata4": "100"
				});
			}
			RSOS_controller.getView().getModel("seriesModel").updateBindings(true);
			//console.log(RSOS_controller.getView().getModel("seriesModel").getData());
			num = 0;
			clicks = 0;
			RSOS_controller = this;
			var RSOModel = new sap.ui.model.json.JSONModel();
			RSOModel.setData({
				RSOBusyIndicator: false
			});

			RSOS_controller.dialog = new sap.m.BusyDialog({
				text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
			});

			RSOS_controller.getView().setModel(RSOModel, "RSOModel");
			//console.log(sap.ui.getCore().getModel("LoginUserModel"));
			// RSOS_controller._handleServiceSuffix_Series();
			RSOS_controller.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");

			var oModel = new sap.ui.model.json.JSONModel();
			RSOS_controller.getView().setModel(oModel, "retailsumModel");
			//console.log(language);
			var BtnExport = RSOS_controller.getView().byId("idBtnExportToExcel");
			//	BtnExport.setEnabled(false); // change 24 sep 
			RSOS_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;

			//Requested, approve, rejected, completed – Remove and add Changed status for demand DMND0003179 
			//DMND0003562 added "ALL" filter option added for status
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
						"key": "CHANGED",
						"text": "CHANGED"
					}, {
						"key": "All-STATUS",
						"text": "ALL"
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
						"key": "CHANGED",
						"text": "CHANGED"
					}, {
						"key": "All-STATUS",
						"text": "ALL"
					}]
				};
			}
			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			RSOS_controller.getView().setModel(globalComboModel, "globalComboModel");

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
			RSOS_controller.getView().setModel(sap.ui.getCore().getModel("AuditModel"), "AuditModel");
			RSOS_controller.getView().byId("idmenu1").setType("Transparent");
			RSOS_controller.getView().byId("idmenu2").setType("Emphasized");
			RSOS_controller.getView().byId("idmenu3").setType("Transparent");
			RSOS_controller.getView().byId("idmenu4").setType("Transparent");
			RSOS_controller.getView().byId("idmenu5").setType("Transparent");
			RSOS_controller.getView().byId("idmenu9").setType("Transparent");
			RSOS_controller.getView().byId("idmenu11").setType("Transparent");
			RSOS_controller.getView().setModel(sap.ui.getCore().getModel("globalComboModel"), "globalComboModel");
			RSOS_controller.getView().setModel(sap.ui.getCore().getModel("AuditModel"), "AuditModel");

			/////////////////////////////// changes done 

			// RSOS_controller.getView().setModel(sap.ui.getCore().getModel("globalComboModel"),"globalComboModel");
			var mcb_series_RSOS = RSOS_controller.getView().byId("mcb_series_RSOS");
			var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
			var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
			var mcb_dealer_RSOS = RSOS_controller.getView().byId("mcb_dealer_RSOS");
			mcb_series_RSOS.setSelectedItems(mcb_series_RSOS.getItems());
			//mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
			var aSelectedStatusArr = mcb_rsStatus_RSOS.getItems().filter(item =>
				item.getKey() == "IN-PROGRESS" || item.getKey() == "PENDING FULFILLMENT"
			);
			mcb_rsStatus_RSOS.setSelectedItems(aSelectedStatusArr);

			mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			mcb_dealer_RSOS.setSelectedItems(mcb_dealer_RSOS.getItems());

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				RSOS_controller.sPrefix = "/soldorder_node";
			} else {
				RSOS_controller.sPrefix = "";
			}
			RSOS_controller.nodeJsUrl = RSOS_controller.sPrefix + "/node";

			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
			}

			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			//Changes done for INC0189944 by Minakshi odata call on load happen only for dealer not for other users.
			if (x == "Dealer_User") {
				RSOS_controller.dialog.open();
				// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);
				//console.log("loading data");
				RSOS_controller._refresh();

			} else {
				RSOS_controller.getView().byId("cb_dealer_RSOS").setSelectedKey("");
			}
			//Changes done for INC0189944 by Minakshi end

			//}
		},
		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameters().arguments.refresh == 'true') {
				this._fnLoadInitData();
			}

		},

		onAfterRendering: function () {

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
					new Filter("ZzendcuName", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzdealerCode", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzmoyr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzseries", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzmodel", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzAuditStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ZzsoStatus", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zsalesperson", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
				], false);

				var aFilters = new sap.ui.model.Filter([oFilter], true);
			}
			this.byId("table_RSOS").getBinding().filter(aFilters).sort(aSorters);
		},

		_handleServiceSuffix_Series: function () {
			// sap.ui.core.BusyIndicator.show(100);
			RSOS_controller.dialog.open();
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
			// RSOS_controller.dialog.open();
			oUrl = RSOS_controller.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X' and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					RSOS_controller.dialog.close();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);

				},
				error: function (jqXHR, textStatus, errorThrown) {
					RSOS_controller.dialog.close();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
					// 	"error"), sap.m.MessageBox.Action.OK, null, null);
					sap.m.MessageToast.show(errMsg);
				}
			});
		},

		_SelectionFinish: function (oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";
			MessageToast.show(messageText, {
				width: "auto"
			});
		},
		_refreshCombo: function (evt) {
			clicks = 0;
			RSOS_controller.dialog.open();
			// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);

			filter = true;
			oUrl = RSOS_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
			for (var i = 0; i < RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
				var status = RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
				if (i == ((RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}

			}
			for (var i = 0; i < RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
				var audit = RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
				if (i == ((RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			for (var i = 0; i < RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
				var series = RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(Zzseries eq '" + series + "')";
				if (i == ((RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			var dealer = RSOS_controller.getView().byId("cb_dealer_RSOS").getSelectedKey();
			oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')) and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";

			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					RSOS_controller.dialog.close();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var BtnNext = RSOS_controller.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
						RSOS_controller.enableExportButton();
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = RSOS_controller.getView().getModel("retailsumModel");

					DataModel.setData(data.d.results);

					DataModel.updateBindings(true);
					if (data.d.results.length <= 10) {
						BtnNext.setEnabled(false);
						RSOS_controller.enableExportButton();
					}
					// }
				},
				error: function (jqXHR, textStatus, errorThrown) {
					RSOS_controller.dialog.close();
					// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
					// 	"error"), sap.m.MessageBox.Action.OK, null, null);
					sap.m.MessageToast.show(errMsg);

				}
			});

		},
		_refresh: function (oEvent) {
			clicks = 0;
			if (oEvent) {
				if ((oEvent.getParameter("changedItem").getKey() == "ALL") && (oEvent.getParameter("selected") === false)) {
					RSOS_controller.getView().byId("mcb_series_RSOS").setSelectedItems();
					this.noData = true;
					sap.m.MessageBox.show(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("SO000016"), sap.m.MessageBox.Icon.ERROR, sap
						.ui.getCore().getModel("i18n").getResourceBundle().getText(
							"error"), sap.m.MessageBox.Action.OK, null, null);
				} else if ((oEvent.getParameter("changedItem").getKey() == "ALL") && (oEvent.getParameter("selected") == true)) {
					RSOS_controller.getView().byId("mcb_series_RSOS").setSelectedItems(RSOS_controller.getView().byId("mcb_series_RSOS").getItems());
					this.noData = false;
				} else {
					this.noData = false;
				}
				//DMND0003562 Filter condition for "ALL" added
				if ((oEvent.getParameter("changedItem").getKey() == "All-STATUS") && (oEvent.getParameter("selected") == true)) {
					RSOS_controller.getView().byId("mcb_rsStatus_RSOS").setSelectedItems(RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getItems());
					this.noData = false;
				} else if ((oEvent.getParameter("changedItem").getKey() == "All-STATUS") && (oEvent.getParameter("selected") == false)) {
					RSOS_controller.getView().byId("mcb_rsStatus_RSOS").setSelectedItems();
					this.noData = true;
				} else {
					this.noData = false;
				}
			}
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (!this.noData) {
				if (x != "TCI_User" && x != "TCI_Zone_User" && x != "National_Fleet_User") {
					oUrl = RSOS_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
						var dealer = RSOS_controller.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_dealer_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// RSOS_controller.dialog.open();
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							RSOS_controller.dialog.close();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// RSOS_controller.getView().byId("tableHeader").setText("Count :("+data.d.results.length+")");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
								RSOS_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							// if (DataModel.getData().length != undefined) {
							// 	for (var m = 0; m < data.d.results.length; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 		DataModel.updateBindings(true);
							// 		//console.log("DataModel.getData()", DataModel.getData());
							// 	}
							// } else {
							DataModel.setData(data.d.results);

							DataModel.updateBindings(true);
							if (data.d.results.length <= 10) {
								BtnNext.setEnabled(false);
								RSOS_controller.enableExportButton();
							}
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {
							RSOS_controller.dialog.close();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageToast.show(errMsg);
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// "error"), sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {
					//march 10 P2 change adding below block and commenting older block 
					if (filter == false) {
						RSOS_controller.dialog.close();
					} else {

						oUrl = RSOS_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
						for (var i = 0; i < RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
							var status = RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
							if (i == ((RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}

						}
						for (var i = 0; i < RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
							var audit = RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
							if (i == ((RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}
						}
						for (var i = 0; i < RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
							var series = RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(Zzseries eq '" + series + "')";
							if (i == ((RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}
						}
						// for (var i = 0; i < RSOS_controller.getView().byId("cb_dealer_RSOS").getSelectedItems().length; i++) {
						var dealer = RSOS_controller.getView().byId("cb_dealer_RSOS").getSelectedKey();
						oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')) and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";

						$.ajax({
							url: oUrl,
							method: "GET",
							async: false,
							dataType: "json",
							success: function (data, textStatus, jqXHR) {
								RSOS_controller.dialog.close();
								// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
								var BtnNext = RSOS_controller.getView().byId("buttonNext");
							//	RSOS_controller.getView().byId("tableHeader").setText("Count :("+data.d.results.length+")");
								if (data.d.results.length <= 0) {
									BtnNext.setEnabled(false);
									RSOS_controller.enableExportButton();
								} else {
									BtnNext.setEnabled(true);
								}

								var DataModel = RSOS_controller.getView().getModel("retailsumModel");

								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
									RSOS_controller.enableExportButton();
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							},
							error: function (jqXHR, textStatus, errorThrown) {
								RSOS_controller.dialog.close();

								var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");

								sap.m.MessageToast.show(errMsg);

							}
						});

					}
				}
			} else {
				RSOS_controller.getView().getModel("retailsumModel").setData();
				RSOS_controller.getView().getModel("retailsumModel").updateBindings(true);
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
			var sPath = evt.oSource.oPropagatedProperties.oBindingContexts.retailsumModel.sPath;
			var path = sPath.substring(1);
			var data = RSOS_controller.getView().getModel('retailsumModel').getData();
			if (data) {
				zrequest = data[path].ZzsoReqNo;
			}
			//zrequest = evt.getSource().getBindingContext("mainservices").getProperty("ZzsoReqNo");
			var d = new sap.ui.jsfragment(RSOS_controller.createId("idFrag_RSOS"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				RSOS_controller);
			RSOS_controller.getView().addDependent(d);
			d.open();
		},
		_searchNLink: function (evt) {
			RSOS_controller.dialog.open();
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
						Zzvtn: vtinVal,
						Vhvin: vinVal,
						ZzsoReqNo: zrequest //	Endcustomer:
					},
					// function import parameters
					success: function (oData, response) {
						RSOS_controller.dialog.close();
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
							RSOS_controller._refresh();
							//	var oTbl = RSOS_controller.getView().byId("tbl_FSOD");
							//	var items = oTbl.getBinding("rows");
							//	items.refresh();
							//	RSOS_controller.getView().getElementBinding('mainservices').refresh(true);
							//	RSOS_controller.getView().getModel('mainservices').updateBindings(true);
							//	oTbl.getModel().updateBindings(true);
						}
					},
					error: function (oError) {
						RSOS_controller.dialog.close();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
					}
				});
			}
		},
		closeDialog: function () {

		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionNext: function (oEvent) {
			RSOS_controller.dialog.open();
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 100; //chnage 25 sep , 50 earleir

			// if (num === count1) {
			// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
			// 	BtnNext.setEnabled(false);
			// }
			RSOS_controller.data();
		},

		enableExportButton: function () {
			var BtnNext = RSOS_controller.getView().byId("buttonNext");
			var BtnExport = RSOS_controller.getView().byId("idBtnExportToExcel");
			if (BtnNext.getEnabled() == false) {
				BtnExport.setEnabled(true);
			} else {
				//BtnExport.setEnabled(false);
				BtnExport.setEnabled(true); // change 24 sep -requirement change
			}
		},

		// DMND0003562 start 16/03/2022 by Minakshi
		onExport: function (oEvent) {
			sap.ui.core.BusyIndicator.show(100);
			var aCols, oRowBinding, oSettings, oSheet, oTable, icount, sUri, sfilter = "",
				sorderby, sSelect, iskip;
			aCols = this.createColumnConfig();
			sUri = oUrl.replace("$top=100&$skip=0&", "");
			sUri = sUri.replace("$top=100&$skip=100&", "");
			sUri = sUri.replace("$top=100&$skip=200&", "");
			sUri = sUri.replace("$top=100&$skip=300&", "");
			if (sUri.includes("CANCELLED") || sUri.includes("CHANGED") || sUri.includes("REGISTERED")) {
				sUri = sUri.replace("&$orderby=ZzsoReqNo desc", "");
				sUri = sUri + " and (ZzeffDate ge datetime'" + moment().subtract(2, 'years').format("YYYY-MM-DDT00:00:00") +
					"'and ZzeffDate le datetime'" + moment().format("YYYY-MM-DDT00:00:00") +
					"')";
			}

			sUri = sUri +
				"&$select=ZzsoReqNo,ZzendcuName,Zsalesperson,ZcontractDate,Comment,ZzdealerCode,Zzmoyr,Zzseries,Zzmodel,Zzsuffix,Zzextcol,ZzAuditStatus,ZzsoStatus,Zzvtn,Vhvin";

			$.ajax({
				url: sUri,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					if (data.d.results.length > 0) {
						oSettings = {
							workbook: {
								columns: aCols
							},
							dataSource: data.d.results,
							fileName: 'RetailSoldOrder.xlsx'

						};

						//count: icount

						oSheet = new Spreadsheet(oSettings);
						oSheet.build().then(function () {
							sap.ui.core.BusyIndicator.hide();
						}).finally(function () {
							oSheet.destroy();
						});
					}

				},
				error: function (jqXHR, textStatus, errorThrown) {
					RSOS_controller.dialog.close();
					sap.ui.core.BusyIndicator.hide();
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");

					sap.m.MessageToast.show(errMsg);

				}
			});

		},
		createColumnConfig: function () {

			var EdmType = exportLibrary.EdmType;
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var aCols = [];
			aCols.push({
				label: oBundle.getText("orderNum"),
				type: EdmType.String,
				property: 'ZzsoReqNo'
			});

			aCols.push({
				label: oBundle.getText("custname"),
				type: EdmType.String,
				property: 'ZzendcuName'
			});

			aCols.push({
				label: oBundle.getText("salesPerName"),
				type: EdmType.String,
				property: 'Zsalesperson'
			});
			aCols.push({
				label: oBundle.getText("ContractDate"),
				type: EdmType.Date,
				property: 'ZcontractDate'
			});
			aCols.push({
				label: oBundle.getText("Comments"),
				type: EdmType.String,
				property: 'Comment'
			});
			aCols.push({
				label: oBundle.getText("dealer"),
				type: EdmType.String,
				property: 'ZzdealerCode'
			});
			aCols.push({
				label: oBundle.getText("modelYear"),
				type: EdmType.String,
				property: 'Zzmoyr'
			});

			aCols.push({
				label: oBundle.getText("series"),
				type: EdmType.String,
				property: 'Zzseries'
			});

			aCols.push({
				label: oBundle.getText("model"),
				type: EdmType.String,
				property: 'Zzmodel'
			});

			aCols.push({
				label: oBundle.getText("suffix"),
				type: EdmType.String,
				property: 'Zzsuffix'
			});

			aCols.push({
				label: oBundle.getText("colour"),
				type: EdmType.String,
				property: 'Zzextcol'
			});

			aCols.push({
				label: oBundle.getText("AuditStatus"),
				type: EdmType.String,
				property: 'ZzAuditStatus'
			});

			aCols.push({
				label: oBundle.getText("status"),
				type: EdmType.String,
				property: 'ZzsoStatus'
			});

			aCols.push({
				label: oBundle.getText("vehicleTrackingNumber"),
				type: EdmType.String,
				property: 'Zzvtn'
			});

			aCols.push({
				label: oBundle.getText("vin"),
				type: EdmType.String,
				property: 'Vhvin'
			});

			return aCols;

		},

		data: function (oEvent) {
			RSOS_controller.dialog.open();
			// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", true);

			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User" && x != "TCI_Zone_User" && x != "National_Fleet_User") {
				oUrl = RSOS_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
				for (var i = 0; i < RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
					var status = RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
					var audit = RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
					var series = RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(Zzseries eq '" + series + "')";
					if (i == ((RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < RSOS_controller.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
					var dealer = RSOS_controller.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
					if (i == ((RSOS_controller.getView().byId("mcb_dealer_RSOS").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				// RSOS_controller.dialog.open();
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						RSOS_controller.dialog.close();
						// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
						var BtnNext = RSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
							RSOS_controller.enableExportButton();
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						if (DataModel.getData().length != undefined) {

							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								// //console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							if (data.d.results.length <= 10) {
								BtnNext.setEnabled(false);
								RSOS_controller.enableExportButton();
							}
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}

					},
					error: function (jqXHR, textStatus, errorThrown) {
						RSOS_controller.dialog.close();
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
				//march 10 P2 change adding below block and commenting older block 
				if (filter == false) {
					RSOS_controller.dialog.close();
				} else {

					oUrl = RSOS_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
						var status = RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
						var audit = RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
						var series = RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((RSOS_controller.getView().byId("mcb_series_RSOS").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// for (var i = 0; i < RSOS_controller.getView().byId("cb_dealer_RSOS").getSelectedItems().length; i++) {
					var dealer = RSOS_controller.getView().byId("cb_dealer_RSOS").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')) and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							RSOS_controller.dialog.close();
							// RSOS_controller.getView().getModel("RSOModel").setProperty("/RSOBusyIndicator", false);
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
								RSOS_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									// //console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
									RSOS_controller.enableExportButton();
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							RSOS_controller.dialog.close();
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
		},
		onExit: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.updateBindings(true);
			RSOS_controller.getView().setModel(oModel, "retailsumModel");
		}
	});
});