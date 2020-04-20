sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/FilterOperator"
], function (BaseController, ResourceModel, formatter, Sorter, Filter, JSONModel, MessageToast, FilterOperator) {
	"use strict";
	var Cap_controller, zrequest, clicks = 0,
		num, page = 0,
		filter = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.CapSoldOrder", {
		formatter: formatter,
		onInit: function () {
			Cap_controller = this;
			Cap_controller.listOfModelYear();
			Cap_controller.formatcurrentMonthNameFun();
			AppController.getDealer();
			Cap_controller.listOfApp();
			AppController.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var text = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("retailCapSoldOrderSummary");
			Cap_controller.getView().byId("label_CapSoldOrderSummaryid").setText(text, [dealer]);
			Cap_controller.getOwnerComponent().getRouter().attachRoutePatternMatched(Cap_controller._onObjectMatched, Cap_controller);
		},
		_onObjectMatched: function (oEvent) {
			Cap_controller.tableLoad();
		},
		formatcurrentMonthNameFun: function () {
			var d = new Date();
			var n = d.getMonth() + 1;
			var currentMonth = " ";
			var currentMonth1 = " ";
			var currentMonth2 = " ";
			if (n == "1") {
				currentMonth = "JAN";
				currentMonth1 = "FEB";
				currentMonth2 = "MAR";
			} else if (n == "2") {
				currentMonth = "FEB";
				currentMonth1 = "MAR";
				currentMonth2 = "APR";
			} else if (n == "3") {
				currentMonth = "MAR";
				currentMonth1 = "APR";
				currentMonth2 = "MAY";
			} else if (n == "4") {
				currentMonth = "APR";
				currentMonth1 = "MAY";
				currentMonth2 = "JUN";
			} else if (n == "5") {
				currentMonth = "MAY";
				currentMonth1 = "JUN";
				currentMonth2 = "JUL";
			} else if (n == "6") {
				currentMonth = "JUN";
				currentMonth1 = "JUL";
				currentMonth2 = "AUG";
			} else if (n == "7") {
				currentMonth = "JUL";
				currentMonth1 = "AUG";
				currentMonth2 = "SEP";
			} else if (n == "8") {
				currentMonth = "AUG";
				currentMonth1 = "SEP";
				currentMonth2 = "OCT";
			} else if (n == "9") {
				currentMonth = "SEP";
				currentMonth1 = "OCT";
				currentMonth2 = "NOV";
			} else if (n == "10") {
				currentMonth = "OCT";
				currentMonth1 = "NOV";
				currentMonth2 = "DEC";
			} else if (n == "11") {
				currentMonth = "NOV";
				currentMonth1 = "DEC";
				currentMonth2 = "JAN";
			} else {
				currentMonth = "DEC";
				currentMonth1 = "JAN";
				currentMonth2 = "FEB";
			}
			Cap_controller.getView().byId("currentmonthnameid").setText(currentMonth);
			Cap_controller.getView().byId("currentmonthname1id").setText(currentMonth1);
			Cap_controller.getView().byId("currentmonthname2id").setText(currentMonth2);
		},

		tableLoad: function () {
			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var host = Cap_controller.host();
			var url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + dealer + "'";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					console.log("data from Cap Table : " + data.d.results)
					Cap_controller.getView().setModel(oModel, "CapTableModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		tableLoadFilter: function () {
			var zappType = Cap_controller.getView().byId("app_Cap").getSelectedKey();
			var Zzseries = Cap_controller.getView().byId("series_Cap").getSelectedKey();
			//var	Zzmoyr
			var Zzmodel = Cap_controller.getView().byId("model_Cap").getSelectedKey();
			var ZzDealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var CapYear = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();
			var host = Cap_controller.host();
			var url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + ZzDealer + "'zappType eq'" + zappType +
				"'Zzseries eq'" + Zzseries + "'Zzmodel eq'" + Zzmodel + "'CapYear eq'" + CapYear + "'";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					console.log("data from Cap Table : " + data.d.results)
					Cap_controller.getView().setModel(oModel, "CapTableModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		handleSelectYearPress: function (Oevent) {
			var series = Cap_controller.getView().byId('series_Cap');
			var modelyear = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();
			var modelCB = Cap_controller.getView().byId("model_Cap");
			var appType = Cap_controller.getView().byId("app_Cap");
			if (series && modelyear) {
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				series.setSelectedKey(null);
				series.destroyItems();
				appType.setSelectedKey(null);
			}
			Cap_controller.listOfApp();
			Cap_controller.tableLoadFilter();
		},
		handleSelectAppPress: function (Oevent) {
			var series = Cap_controller.getView().byId('series_Cap');
			var modelyear = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();
			var modelCB = Cap_controller.getView().byId("model_Cap");
			//var appType=Cap_controller.getView().byId("app_Cap");
			var appTypeVal = Cap_controller.getView().byId('app_Cap').getSelectedKey();
			if (series && modelyear) {
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				series.setSelectedKey(null);
				series.destroyItems();
			}
			Cap_controller._handleSeries(modelyear, appTypeVal);
		//	Cap_controller.tableLoadFilter();

		},
		_handleSeries: function (modelyear, appTypeVal) {

			var host = Cap_controller.host();
			var div = Cap_controller.appDivision();
			var url = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_SoldOrder_Series(P_moyr='" + modelyear +
				"',P_app_type='" + appTypeVal + "')/Set?$filter=Division eq '" + div + "'";
			var seriesCB = Cap_controller.getView().byId("series_Cap");
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					if (seriesCB.getValue() !== "") {
						//seriesCB.setValue(" ");
						seriesCB.setSelectedKey(null);
					}
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					console.log("data from Cap : " + data.d.results)
					Cap_controller.getView().setModel(oModel, "seriesModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			Cap_controller.tableLoadFilter();
		},
		series_selected: function (oEvent) {

			var modelyear = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();
			var model;
			var modelCB = Cap_controller.getView().byId("model_Cap");
			var series = Cap_controller.getView().byId('series_Cap').getSelectedKey();
			if (language === "FR") {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

			} else {
				model =
					"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";
			}

			if (series && modelyear) {

				modelCB.setSelectedKey(null);
				//			modelCB.destroyItems();
				var oSorter = new sap.ui.model.Sorter('mainservices>model');
				var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				modelCB.bindItems({
					path: "mainservices>/ZVMS_Model_EXCLSet",
					sorter: oSorter,
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						//	new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
			}
			Cap_controller.tableLoadFilter();
		},

		model_selected: function (oEvent) {
			Cap_controller.tableLoadFilter();
		},
		listOfModelYear: function () {
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var nextModelYear = currentModelYear + 1;
			var previous = currentModelYear - 1;
			var data = [{
				"key": "1",
				"text": previous
			}, {
				"key": "2",
				"text": currentModelYear
			}, {
				"key": "3",
				"text": nextModelYear
			}];
			var modelYearModel = new JSONModel();
			modelYearModel.setData(data);
			Cap_controller.getView().setModel(modelYearModel, "yearModel");
		},
		listOfApp: function () {

			var data = [{
				"key": "R",
				"text": "Retail"
			}, {
				"key": "F",
				"text": "Fleet"
			}];
			var appModel = new JSONModel();
			appModel.setData(data);
			Cap_controller.getView().setModel(appModel, "appModel");
		},
		onAfterRendering: function () {

		},

		onLiveSOChange: function (oEvent) {
			Cap_controller.sSearchQuery = oEvent.getSource().getValue();
			Cap_controller.fnSuperSearch();
		},
		fnSuperSearch: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new Sorter("ZzsoReqNo", Cap_controller.bDescending));

			if (Cap_controller.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("ZzsoReqNo", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzendcuName", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzdealerCode", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("Zzmoyr", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("Zzseries", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("Zzmodel", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("Zzsuffix", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzAuditStatus", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzsoStatus", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("Zzvtn", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery)
				], false);

				var aFilters = new sap.ui.model.Filter([oFilter], true);
			}
			Cap_controller.byId("table_Cap").getBinding().filter(aFilters).sort(aSorters);
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
			Cap_controller.dialog.open();
			// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", true);

			filter = true;
			var oUrl = Cap_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
			for (var i = 0; i < Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length; i++) {
				var status = Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
				if (i == ((Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}

			}
			for (var i = 0; i < Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length; i++) {
				var audit = Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
				if (i == ((Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			for (var i = 0; i < Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length; i++) {
				var series = Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(Zzseries eq '" + series + "')";
				if (i == ((Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			var dealer = Cap_controller.getView().byId("cb_dealer_Cap").getSelectedKey();
			oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')) and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";

			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					Cap_controller.dialog.close();
					// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
					var BtnNext = Cap_controller.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
						Cap_controller.enableExportButton();
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = Cap_controller.getView().getModel("CapModel");

					DataModel.setData(data.d.results);

					DataModel.updateBindings(true);
					if (data.d.results.length <= 10) {
						BtnNext.setEnabled(false);
						Cap_controller.enableExportButton();
					}
					// }
				},
				error: function (jqXHR, textStatus, errorThrown) {
					Cap_controller.dialog.close();
					// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
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
					Cap_controller.getView().byId("mcb_series_Cap").setSelectedItems();
					Cap_controller.noData = true;
					sap.m.MessageBox.show(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("SO000016"), sap.m.MessageBox.Icon.ERROR, sap
						.ui.getCore().getModel("i18n").getResourceBundle().getText(
							"error"), sap.m.MessageBox.Action.OK, null, null);
				} else if ((oEvent.getParameter("changedItem").getKey() == "ALL") && (oEvent.getParameter("selected") == true)) {
					Cap_controller.getView().byId("mcb_series_Cap").setSelectedItems(Cap_controller.getView().byId("mcb_series_Cap").getItems());
					Cap_controller.noData = false;
				} else {
					Cap_controller.noData = false;
				}
			}
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (!Cap_controller.noData) {
				if (x != "TCI_User" && x != "TCI_Zone_User") {
					var oUrl = Cap_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
					for (var i = 0; i < Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length; i++) {
						var status = Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length; i++) {
						var audit = Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length; i++) {
						var series = Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < Cap_controller.getView().byId("mcb_dealer_Cap").getSelectedItems().length; i++) {
						var dealer = Cap_controller.getView().byId("mcb_dealer_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
						if (i == ((Cap_controller.getView().byId("mcb_dealer_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// Cap_controller.dialog.open();
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							Cap_controller.dialog.close();
							// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
							var BtnNext = Cap_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
								Cap_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = Cap_controller.getView().getModel("CapModel");
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
								Cap_controller.enableExportButton();
							}
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {
							Cap_controller.dialog.close();
							// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageToast.show(errMsg);
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// "error"), sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {
					//march 10 P2 change adding below block and commenting older block 
					if (filter == false) {
						Cap_controller.dialog.close();
						/*	var errMsgDropdown = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorSelectDealer"); // change march 10 P2
						sap.m.MessageBox.show(errMsgDropdown, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							"error"), sap.m.MessageBox.Action.OK, null, null); // change march 10 P2
*/
					}
					/*if (filter == false) {
						var oUrl = Cap_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
						for (var i = 0; i < Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length; i++) {
							var status = Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
							if (i == ((Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}

						}
						for (var i = 0; i < Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length; i++) {
							var audit = Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
							if (i == ((Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}
						}
						for (var i = 0; i < Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length; i++) {
							var series = Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(Zzseries eq '" + series + "')";
							if (i == ((Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";
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
								Cap_controller.dialog.close();
								// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
								var BtnNext = Cap_controller.getView().byId("buttonNext");
								if (data.d.results.length <= 0) {
									BtnNext.setEnabled(false);
									Cap_controller.enableExportButton();
								} else {
									BtnNext.setEnabled(true);
								}

								var DataModel = Cap_controller.getView().getModel("CapModel");
								// if (DataModel.getData().length != undefined) {
								// 	for (var m = 0; m < data.d.results.length; m++) {
								// 		DataModel.getData().push(data.d.results[m]);
								// 		DataModel.updateBindings(true);
								// 		//console.log("DataModel.getData()", DataModel.getData());
								// 	}
								// } else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
									Cap_controller.enableExportButton();
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
								// }
							},
							error: function (jqXHR, textStatus, errorThrown) {
								Cap_controller.dialog.close();
								// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
								var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
								// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
								// 	"error"), sap.m.MessageBox.Action.OK, null, null);
								sap.m.MessageToast.show(errMsg);

							}
						});
					} */
					else {

						var oUrl = Cap_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=0&$filter=(";
						for (var i = 0; i < Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length; i++) {
							var status = Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
							if (i == ((Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}

						}
						for (var i = 0; i < Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length; i++) {
							var audit = Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
							if (i == ((Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}
						}
						for (var i = 0; i < Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length; i++) {
							var series = Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems()[i].getKey();
							oUrl = oUrl + "(Zzseries eq '" + series + "')";
							if (i == ((Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length) - 1)) {
								oUrl = oUrl + ") and (";
							} else {
								oUrl = oUrl + " or ";
							}
						}
						// for (var i = 0; i < Cap_controller.getView().byId("cb_dealer_Cap").getSelectedItems().length; i++) {
						var dealer = Cap_controller.getView().byId("cb_dealer_Cap").getSelectedKey();
						oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')) and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";

						$.ajax({
							url: oUrl,
							method: "GET",
							async: false,
							dataType: "json",
							success: function (data, textStatus, jqXHR) {
								Cap_controller.dialog.close();
								// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
								var BtnNext = Cap_controller.getView().byId("buttonNext");
								if (data.d.results.length <= 0) {
									BtnNext.setEnabled(false);
									Cap_controller.enableExportButton();
								} else {
									BtnNext.setEnabled(true);
								}

								var DataModel = Cap_controller.getView().getModel("CapModel");
								// if (DataModel.getData().length != undefined) {
								// 	for (var m = 0; m < data.d.results.length; m++) {
								// 		DataModel.getData().push(data.d.results[m]);
								// 		DataModel.updateBindings(true);
								// 		//console.log("DataModel.getData()", DataModel.getData());
								// 	}
								// } else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
									Cap_controller.enableExportButton();
								}
								DataModel.setData(data.d.results);
								/*	var array3={}; 
							var array4={};
							array3 = data.d.results;
							array4 = sap.ui.getCore().getModel('GlobalChatModel').getData();
							console.log( "array3");
							console.log( array3);console.log(array4);
							*/

								DataModel.updateBindings(true);
								// }
							},
							error: function (jqXHR, textStatus, errorThrown) {
								Cap_controller.dialog.close();
								// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
								var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
								// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
								// 	"error"), sap.m.MessageBox.Action.OK, null, null);
								sap.m.MessageToast.show(errMsg);

							}
						});

					}
				}
			} else {
				Cap_controller.getView().getModel("CapModel").setData();
				Cap_controller.getView().getModel("CapModel").updateBindings(true);
			}
		},
		_dispalySoldOrderDetails: function (evt) {
			Cap_controller.getOwnerComponent().getRouter().navTo("CapView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
		},
		_createNewOrder: function () {
			Cap_controller.getOwnerComponent().getRouter().navto("RetailSoldOrderA", {}, true);
		},
		onLinkVehicle: function (evt) {
			var sPath = evt.oSource.oPropagatedProperties.oBindingContexts.CapModel.sPath;
			var path = sPath.substring(1);
			var data = Cap_controller.getView().getModel('CapModel').getData();
			if (data) {
				zrequest = data[path].ZzsoReqNo;
			}
			//zrequest = evt.getSource().getBindingContext("mainservices").getProperty("ZzsoReqNo");
			var d = new sap.ui.jsfragment(Cap_controller.createId("idFrag_Cap"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				Cap_controller);
			Cap_controller.getView().addDependent(d);
			d.open();
		},
		_searchNLink: function (evt) {
			Cap_controller.dialog.open();
			// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", true);
			var vinVal = Cap_controller.byId("idFrag_Cap--VinIdFrag").getValue();
			var vtinVal = Cap_controller.byId("idFrag_Cap--VtinIdFrag").getValue();
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
				Cap_controller.getView().getModel("mainservices").callFunction("/Cap_VTN_ASSIGN", {
					method: "POST",
					urlParameters: {
						Zzvtn: vtinVal,
						Vhvin: vinVal,
						ZzsoReqNo: zrequest //	Endcustomer:
					},
					// function import parameters
					success: function (oData, response) {
						Cap_controller.dialog.close();
						// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
						if (oData.Type == "E") {
							var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000013", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);
						} else {
							var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000014", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap.m.MessageBox.Action.OK, null, null);
							Cap_controller._refresh();
							//	var oTbl = Cap_controller.getView().byId("tbl_FSOD");
							//	var items = oTbl.getBinding("rows");
							//	items.refresh();
							//	Cap_controller.getView().getElementBinding('mainservices').refresh(true);
							//	Cap_controller.getView().getModel('mainservices').updateBindings(true);
							//	oTbl.getModel().updateBindings(true);
						}
					},
					error: function (oError) {
						Cap_controller.dialog.close();
						// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
					}
				});
			}
		},
		closeDialog: function () {
			//var oDialogBox = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.VinDialog", Cap_controller);
			//	Cap_controller.oDialogBox.close();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionNext: function (oEvent) {
			Cap_controller.dialog.open();
			//Cap_controller code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 100; //chnage 25 sep , 50 earleir

			// if (num === count1) {
			// 	var BtnNext = Cap_controller.getView().byId("buttonNext");
			// 	BtnNext.setEnabled(false);
			// }
			Cap_controller.data();
		},

		enableExportButton: function () {
			var BtnNext = Cap_controller.getView().byId("buttonNext");
			var BtnExport = Cap_controller.getView().byId("idBtnExportToExcel");
			if (BtnNext.getEnabled() == false) {
				BtnExport.setEnabled(true);
			} else {
				//BtnExport.setEnabled(false);
				BtnExport.setEnabled(true); // change 24 sep -requirement change
			}
		},
		onExport: function () {

			var data;
			var DataModel = Cap_controller.getView().getModel("CapTableModel");
			if (DataModel != undefined) {
				data = DataModel.getData();
			} else {
				data = Cap_controller.getView().byId("table_Cap").getModel("CapTableModel").getData();
			}
			Cap_controller.JSONToExcelConvertor(data, "Report", true);

		},
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			//	var arrData = typeof JSONData.results != 'object' ? JSON.parse(JSONData.results) : JSONData.results;
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("appType") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("year") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("dealer") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("modelYear") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("series") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("model") + ",";
			row += Cap_controller.getView().byId("currentmonthnameid").getText()+ ",";
			row += Cap_controller.getView().byId("currentmonthname1id").getText()+ ",";
			row += Cap_controller.getView().byId("currentmonthname2id").getText()+ ",";
			//row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("linkVehicle") + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				// //console.log(arrData[i]);
				// var row = "";
				row = " ";
				row += arrData[i].ZzsoReqNo + ',' +
					arrData[i].ZzendcuName + ',' +
					//'="' + arrData[i].Dealer.substring(5, arrData[i].Dealer.length) + '",="' +
					arrData[i].ZzdealerCode + ',' +
					arrData[i].Zzmoyr + ',' +
					arrData[i].Zzseries + ',' +
					arrData[i].Zzmodel + ',' +
					arrData[i].Zzsuffix + ',' +

					arrData[i].Zzextcol + ',' +
					//	arrData[i].Zzapx +'","' + 
					//
					arrData[i].ZzAuditStatus + ',' +
					arrData[i].ZzsoStatus + ',' +
					arrData[i].Zzvtn + ',' +
					arrData[i].Vhvin + ',';

				//FSOD_controller.dateConverter(arrData[i].ZzreqEtaFrom) +'",="' +
				//FSOD_controller.dateConverter(arrData[i].ZzreqEtaTo) + '",';

				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				//alert("Invalid data");
				return;
			}
			var fileName = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CapSoldOrderReport");
			//	fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CapSoldOrderReport") + ".csv");
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
		data: function (oEvent) {
			Cap_controller.dialog.open();
			// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", true);

			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User" && x != "TCI_Zone_User") {
				var oUrl = Cap_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
				for (var i = 0; i < Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length; i++) {
					var status = Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
					if (i == ((Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length; i++) {
					var audit = Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
					if (i == ((Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length; i++) {
					var series = Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(Zzseries eq '" + series + "')";
					if (i == ((Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < Cap_controller.getView().byId("mcb_dealer_Cap").getSelectedItems().length; i++) {
					var dealer = Cap_controller.getView().byId("mcb_dealer_Cap").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')";
					if (i == ((Cap_controller.getView().byId("mcb_dealer_Cap").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				// Cap_controller.dialog.open();
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						Cap_controller.dialog.close();
						// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
						var BtnNext = Cap_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
							Cap_controller.enableExportButton();
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = Cap_controller.getView().getModel("CapModel");
						if (DataModel.getData().length != undefined) {

							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								// //console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							if (data.d.results.length <= 10) {
								BtnNext.setEnabled(false);
								Cap_controller.enableExportButton();
							}
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}

					},
					error: function (jqXHR, textStatus, errorThrown) {
						Cap_controller.dialog.close();
						// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
						// var page = clicks + 1;
						// Cap_controller.getView().byId("txtPageNum").setText("Page " + page);
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
						// 	"error"), sap.m.MessageBox.Action.OK, null, null);
						sap.m.MessageToast.show(errMsg);
					}
				});
			} else {
				//march 10 P2 change adding below block and commenting older block 
				if (filter == false) {
					Cap_controller.dialog.close();

				} else {

					var oUrl = Cap_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=100&$skip=" + num + "&$filter=(";
					for (var i = 0; i < Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length; i++) {
						var status = Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzsoStatus eq '" + status + "')";
						if (i == ((Cap_controller.getView().byId("mcb_rsStatus_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length; i++) {
						var audit = Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(ZzAuditStatus eq '" + audit + "')";
						if (i == ((Cap_controller.getView().byId("mcb_auditStatus_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					for (var i = 0; i < Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length; i++) {
						var series = Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(Zzseries eq '" + series + "')";
						if (i == ((Cap_controller.getView().byId("mcb_series_Cap").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					// for (var i = 0; i < Cap_controller.getView().byId("cb_dealer_Cap").getSelectedItems().length; i++) {
					var dealer = Cap_controller.getView().byId("cb_dealer_Cap").getSelectedKey();
					oUrl = oUrl + "(ZzdealerCode eq '" + dealer + "')) and (FleetReference eq '') and (ZzsoType eq 'SO')&$orderby=ZzsoReqNo desc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							Cap_controller.dialog.close();
							// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
							var BtnNext = Cap_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
								Cap_controller.enableExportButton();
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = Cap_controller.getView().getModel("CapModel");
							if (DataModel.getData().length != undefined) {
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									// //console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								if (data.d.results.length <= 10) {
									BtnNext.setEnabled(false);
									Cap_controller.enableExportButton();
								}
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							Cap_controller.dialog.close();
							// Cap_controller.getView().getModel("CapModel").setProperty("/CapBusyIndicator", false);
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
							// sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
							// 	"error"), sap.m.MessageBox.Action.OK, null, null);
							sap.m.MessageToast.show(errMsg);

						}
					});

				}
				// var page = clicks + 1;
				// Cap_controller.getView().byId("txtPageNum").setText("Page " + page);
			}
		},
		onLiveChange: function (oEvent) {
			Cap_controller.sSearchQuery = oEvent.getSource().getValue();
			Cap_controller.fnApplyFiltersAndOrdering();
		},
		fnApplyFiltersAndOrdering: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			if (Cap_controller.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("ZzsoReqNo", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzdealerCode", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzAuditStatus", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery),
					new Filter("ZzsoStatus", sap.ui.model.FilterOperator.Contains, Cap_controller.sSearchQuery)
				], false);
				// Cap_controller.sSearchQuery);
				aFilters.push(oFilter);
			}
		},
		onExit: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.updateBindings(true);
			Cap_controller.getView().setModel(oModel, "CapModel");
		}
	});
});