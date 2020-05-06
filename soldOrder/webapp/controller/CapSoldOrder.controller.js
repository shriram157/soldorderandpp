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
	var Cap_controller, num, clicks = 0;

	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.CapSoldOrder", {
		formatter: formatter,
		onInit: function () {
			Cap_controller = this;
			Cap_controller.formatcurrentMonthNameFun();
			AppController.getDealer();
			Cap_controller.listOfApp();
			Cap_controller.getOwnerComponent().getRouter().attachRoutePatternMatched(Cap_controller._onObjectMatched, Cap_controller);
		},
		_onObjectMatched: function (oEvent) {
			clicks = 0;
			num = 0;
			var oModel = new sap.ui.model.json.JSONModel();
			Cap_controller.getView().setModel(oModel, "CapTableModel");
			Cap_controller.tableLoad();
			Cap_controller.ResetCB();
			Cap_controller.dialog = new sap.m.BusyDialog({
				text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
			});
			var dealerVBox = Cap_controller.getView().byId("dealerVBox");
			Cap_controller.readMethod();
		},
		_valuehelpfanno: function (oEvent) {
			var FanNo_Cap = Cap_controller.getView().byId('FanNo_Cap');
			FanNo_Cap.$().find("input").attr("readonly", true);
			if (!Cap_controller._addNewFanPage) {
				Cap_controller._addNewFanPage = sap.ui.xmlfragment('FanNo', "toyota.ca.SoldOrder.view.fragments.FanNo", Cap_controller);
				Cap_controller.getView().addDependent(Cap_controller._addNewFanPage);
			}
			Cap_controller._addNewFanPage.open();
		},
		onCloseDialogFan: function (Oevent) {
			Cap_controller.dialog.open();
			var Fan = Cap_controller.getView().byId("FanNo_Cap");
			var key = Oevent.getParameter("selectedContexts")[0].getProperty('BusinessPartnerKey');
			Cap_controller.dealer = Oevent.getParameter("selectedContexts")[0].getProperty('BusinessPartnerKey');
			var text = Oevent.getParameter("selectedContexts")[0].getProperty('SearchTerm2');
			Cap_controller.getView().getModel('mainservices').read("/Customer_infoSet('" + key + "')", {
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel(data.CustomerInfo);
					Cap_controller.getView().setModel(oModel, "Customer");
					sap.ui.getCore().setModel(oModel, "CustomerData");
					Fan.setValue(text);
					Cap_controller.dialog.close();
					//Cap_controller.listOfModelYear();
					var series = Cap_controller.getView().byId('series_Cap');
					//	var modelyear = Cap_controller.getView().byId('modelYr_Cap');
					if (series && modelyear) {
						series.setSelectedKey(null);
						series.destroyItems();
						//		modelyear.setSelectedKey(null);
					}
					Cap_controller.handleSelectYearPress();
					//Cap_controller.getView().getModel("CapTableModel").setData([]);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					Cap_controller.dialog.close();
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap.m.MessageBox.Action.OK, null, null);
					Cap_controller.getView().getModel("CapTableModel").setData([]);
				}
			});
		},
		handleSearchFan: function (oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("SearchTerm2", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("BusinessPartnerName", sap.ui.model.FilterOperator.Contains, searchString)
				], false);
			}
			oEvent.getSource().getBinding("items").filter(filters);

		},
		readMethod: function () {
			var fanNo = Cap_controller.getView().byId("FanNo_Cap");
			fanNo.addEventDelegate({
				onAfterRendering: function () {
					fanNo.$().find("input").attr("readonly", true);
				}
			});

			var zoneDealer = Cap_controller.getView().byId("cbzoneFanNo_Cap");
			zoneDealer.addEventDelegate({
				onAfterRendering: function () {
					zoneDealer.$().find("input").attr("readonly", true);
				}
			});

			var seriesCB = Cap_controller.getView().byId('series_Cap');
			seriesCB.addEventDelegate({
				onAfterRendering: function () {
					seriesCB.$().find("input").attr("readonly", true);
				}
			});
			/*var ZzmoyrCB = Cap_controller.getView().byId("modelYr_Cap");
			ZzmoyrCB.addEventDelegate({
				onAfterRendering: function () {
					ZzmoyrCB.$().find("input").attr("readonly", true);
				}
			});*/
			var appType = Cap_controller.getView().byId('app_Cap');
			appType.addEventDelegate({
				onAfterRendering: function () {
					appType.$().find("input").attr("readonly", true);
				}
			});

		},

		onZoneRetailDealerSelect: function (evt) {
			var series = Cap_controller.getView().byId('series_Cap');
			//	var modelyear = Cap_controller.getView().byId('modelYr_Cap');
			//	if (series && modelyear) {
			if (series) {
				series.setSelectedKey(null);
				series.destroyItems();
				//		modelyear.setSelectedKey(null);
			}
			Cap_controller.handleSelectYearPress();
			//Cap_controller.getView().getModel("CapTableModel").setData([]);
			//	Cap_controller.listOfModelYear();
		},
		ondealerSelect: function () {
			var series = Cap_controller.getView().byId('series_Cap');
			//	var modelyear = Cap_controller.getView().byId('modelYr_Cap');
			//	if (series && modelyear) {
			if (series) {
				series.setSelectedKey(null);
				series.destroyItems();
				//		modelyear.setSelectedKey(null);
			}
		},
		handleSelectAppPress: function (Oevent) {
			var BtnNext = Cap_controller.getView().byId("capButtonNext");
			BtnNext.setEnabled(false);
			var series = Cap_controller.getView().byId('series_Cap');
			//	var modelyear = Cap_controller.getView().byId('modelYr_Cap');
			var ZzDealerName = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerName;
			var ZzDealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var dealer = ZzDealer + "- " + ZzDealerName;
			var fanNo = Cap_controller.getView().byId("FanNo_Cap");
			var zoneDealer = Cap_controller.getView().byId("cbzoneFanNo_Cap");
			var appType = Cap_controller.getView().byId('app_Cap');
			var appTypeVal = Cap_controller.getView().byId('app_Cap').getSelectedKey();
			appType.setSelectedKey(appTypeVal);
			//if (series && modelyear && fanNo) {
			if (series && fanNo) {
				//		modelyear.setSelectedKey(null);
				//		modelyear.destroyItems();
				series.setSelectedKey(null);
				series.destroyItems();
			} else {
				series.destroyItems();
			}
			Cap_controller.getView().getModel("CapTableModel").setData([]);
			Cap_controller.readMethod();

			var user = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (user == "TCI_Zone_User") {
				if (appTypeVal == "R") {
					fanNo.setVisible(false);
					zoneDealer.setVisible(true);
					zoneDealer.setSelectedKey(null);
					//Cap_controller.handleSelectYearPress();
				} else {
					zoneDealer.setVisible(false);
					fanNo.setVisible(true);
					fanNo.setShowSuggestion(true);
					fanNo.setValue(null);
					fanNo.setShowValueHelp(true);
				}
			} else {
				zoneDealer.setVisible(false);
				fanNo.setVisible(true);
				if (appTypeVal == "F") {
					fanNo.setShowSuggestion(true);
					fanNo.setValue(null);
					fanNo.setShowValueHelp(true);
				} else {
					fanNo.setShowValueHelp(false);
					fanNo.setValue(dealer);
					Cap_controller.handleSelectYearPress();
					//	Cap_controller.listOfModelYear();
				}
			}
			series.setEnabled(true);
			//	modelyear.setEnabled(true);
			fanNo.setEnabled(true);
			zoneDealer.setEnabled(true);
			//	Cap_controller._populateSeries(appTypeVal);
		},
		handleSelectYearPress: function (Oevent) {
			//var modelyearval = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();
			var appTypeVal = Cap_controller.getView().byId('app_Cap').getSelectedKey();
			var series = Cap_controller.getView().byId('series_Cap');
			//	var modelyear = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();
			//	if (series && modelyear) {
			if (series) {
				series.setSelectedKey(null);
				series.destroyItems();
			}
			//Cap_controller._populateSeries(modelyearval, appTypeVal);
			Cap_controller._populateSeries(appTypeVal);
			Cap_controller.tableLoadFilter();
			Cap_controller.readMethod();
			var BtnNext = Cap_controller.getView().byId("capButtonNext");
			BtnNext.setEnabled(true);
		},
		_populateSeries: function (appTypeVal) {
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var nextModelYear = currentModelYear + 1;
			var previous = currentModelYear - 1;

			var host = Cap_controller.host();
			var div = Cap_controller.appDivision();
			var url1 = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_SoldOrder_Series(P_moyr='" + currentModelYear +
				"',P_app_type='" + appTypeVal + "')/Set?$filter=Division eq '" + div + "'";
			var url2 = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_SoldOrder_Series(P_moyr='" + previous +
				"',P_app_type='" + appTypeVal + "')/Set?$filter=Division eq '" + div + "'";
			var url3 = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_SoldOrder_Series(P_moyr='" + nextModelYear +
				"',P_app_type='" + appTypeVal + "')/Set?$filter=Division eq '" + div + "'";
			var seriesCB = Cap_controller.getView().byId("series_Cap");
			var tempArray = [];
			$.ajax({
				url: url1,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					if (seriesCB.getValue() !== "") {
						seriesCB.setSelectedKey(null);
					}
					for (var x = 0; x < data.d.results.length; x++) {
						tempArray.push(data.d.results[x]);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			$.ajax({
				url: url2,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					if (seriesCB.getValue() !== "") {
						seriesCB.setSelectedKey(null);
					}
					for (var x = 0; x < data.d.results.length; x++) {
						tempArray.push(data.d.results[x]);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			$.ajax({
				url: url3,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					if (seriesCB.getValue() !== "") {
						seriesCB.setSelectedKey(null);
					}
					for (var x = 0; x < data.d.results.length; x++) {
						tempArray.push(data.d.results[x]);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			function removeDuplicates(tempModel4) {
				var obj = {}; Cap_controller.tempArray=[];
				for (var i = 0, len = tempModel4.length; i < len; i++)
							obj[tempModel4[i]['ModelSeriesNo']] = tempModel4[i];
				for (var key in obj)
					Cap_controller.tempArray.push(obj[key]);
				return  Cap_controller.tempArray;
			}
			removeDuplicates(tempArray);
			console.log("model", Cap_controller.tempArray);
			var oModel = new sap.ui.model.json.JSONModel( );
			oModel.setData(Cap_controller.tempArray);
			Cap_controller.getView().setModel(oModel, "seriesModel");
			Cap_controller.getView().setModel('seriesModel');
			console.log(Cap_controller.getView().getModel('seriesModel').getData());
			Cap_controller.readMethod();
		},

		series_selected: function (oEvent) {
			Cap_controller.tableLoadFilter();
			Cap_controller.readMethod();
		},
		/*	listOfModelYear: function () {
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
			},*/
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
		tableLoad: function () {

			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var host = Cap_controller.host();
			var d = new Date();
			//	var Zzmoyr = d.getFullYear();
			/*var url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + dealer + "' and  Zzmoyr eq '" + Zzmoyr +
				"' and  ZzappType eq 'R'";*/
			var url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + dealer + "' and ZzappType eq 'R'";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

					var oModel = Cap_controller.getView().getModel("CapTableModel");
					oModel.setData(data.d.results);
					clicks = 0;
					num = 0;
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
			var ZzappType = Cap_controller.getView().byId("app_Cap").getSelectedKey();
			var Zzseries = Cap_controller.getView().byId("series_Cap").getSelectedKey();
			var ZzDealer;
			//	var Zzmoyr = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem().getText();

			var host = Cap_controller.host();
			var url;
			var user = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (user == "TCI_Zone_User") {
				var ZzDealer1 = Cap_controller.getView().byId("cbzoneFanNo_Cap").getSelectedKey();
				ZzDealer = ZzDealer1.substring(ZzDealer1.length - 5, ZzDealer1.length);
			} else {
				ZzDealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

			}
			if (ZzappType == "R") {
				if (ZzappType && ZzDealer && Zzseries == "") {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + ZzDealer +
						"' and  ZzappType eq '" + ZzappType + "'";
				} else if (ZzappType && ZzDealer && Zzseries) {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + ZzDealer +
						"' and  ZzappType eq '" + ZzappType +
						"' and  Zzseries eq '" + Zzseries + "'";
				} else {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + ZzDealer +
						"' and  ZzappType eq '" + ZzappType + "'";
				}
			} else {
				var FanDealerCap = Cap_controller.getView().byId('FanNo_Cap').getValue();
				if (ZzappType && FanDealerCap && Zzseries == "") {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + FanDealerCap +
						"' and  ZzappType eq '" + ZzappType + "'";
				} else if (ZzappType && FanDealerCap && Zzseries) {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + FanDealerCap +
						"' and  ZzappType eq '" + ZzappType +
						"' and  Zzseries eq '" + Zzseries + "'";
				} else {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$filter=ZzDealer eq '" + FanDealerCap +
						"' and  ZzappType eq '" + ZzappType + "'";
				}
			}

			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = Cap_controller.getView().getModel("CapTableModel");
					oModel.setData(data.d.results);
					clicks = 0;
					num = 0;

				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		ResetCB: function () {
			var ZzappType = Cap_controller.getView().byId("app_Cap");
			var Zzseries = Cap_controller.getView().byId("series_Cap");
			//	var Zzmoyr = Cap_controller.getView().byId('modelYr_Cap');
			var ZzDealer1 = Cap_controller.getView().byId("cbzoneFanNo_Cap");
			var FanDealerCap = Cap_controller.getView().byId('FanNo_Cap');

			ZzappType.setSelectedKey(null);
			Zzseries.setSelectedKey(null);
			//	Zzmoyr.setSelectedKey(null);
			ZzDealer1.setSelectedKey(null);
			FanDealerCap.setValue(null);

			Zzseries.setEnabled(false);
			//	Zzmoyr.setEnabled(false);
			ZzDealer1.setEnabled(false);
			FanDealerCap.setEnabled(false);

		},
		formatcurrentMonthNameFun: function () {
			var d = new Date();
			var n = d.getMonth() + 1;
			var currentMonth = " ";
			var currentMonth1 = " ";
			var currentMonth2 = " ";
			if (language == "FR") {
				if (n == "1") {
					currentMonth = "Janv.";
					currentMonth1 = "Févr.";
					currentMonth2 = "Mars";
				} else if (n == "2") {
					currentMonth = "Févr.";
					currentMonth1 = "Mars";
					currentMonth2 = "Avril";
				} else if (n == "3") {
					currentMonth = "Mars";
					currentMonth1 = "Avril";
					currentMonth2 = "Mai";
				} else if (n == "4") {
					currentMonth = "Avril";
					currentMonth1 = "Mai";
					currentMonth2 = "Juin";
				} else if (n == "5") {
					currentMonth = "Mai";
					currentMonth1 = "Juin";
					currentMonth2 = "Juil.";
				} else if (n == "6") {
					currentMonth = "Juin";
					currentMonth1 = "Juil.";
					currentMonth2 = "Août.";
				} else if (n == "7") {
					currentMonth = "Juil.";
					currentMonth1 = "Août.";
					currentMonth2 = "Sept";
				} else if (n == "8") {
					currentMonth = "Août.";
					currentMonth1 = "Sept";
					currentMonth2 = "Oct.";
				} else if (n == "9") {
					currentMonth = "Sept";
					currentMonth1 = "Oct.";
					currentMonth2 = "Nov.";
				} else if (n == "10") {
					currentMonth = "Oct.";
					currentMonth1 = "Nov.";
					currentMonth2 = "Déc.";
				} else if (n == "11") {
					currentMonth = "Nov.";
					currentMonth1 = "Déc.";
					currentMonth2 = "Janv.";
				} else {
					currentMonth = "Déc.";
					currentMonth1 = "Janv.";
					currentMonth2 = "Févr.";
				}

			} else {
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

			}
			Cap_controller.getView().byId("currentmonthnameid").setText(currentMonth);
			Cap_controller.getView().byId("currentmonthname1id").setText(currentMonth1);
			Cap_controller.getView().byId("currentmonthname2id").setText(currentMonth2);
		},
		onAfterRendering: function () {
			var user = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (user == "TCI_Zone_User") {
				Cap_controller.getView().byId("FanNo_Cap").setVisible(false);
				Cap_controller.getView().byId("cbzoneFanNo_Cap").setVisible(true);
			} else {
				Cap_controller.getView().byId("cbzoneFanNo_Cap").setVisible(false);
				Cap_controller.getView().byId("FanNo_Cap").setVisible(true);
			}

			var Zzseries = Cap_controller.getView().byId("series_Cap");
			//	var Zzmoyr = Cap_controller.getView().byId('modelYr_Cap');
			var ZzDealer1 = Cap_controller.getView().byId("cbzoneFanNo_Cap");
			var FanDealerCap = Cap_controller.getView().byId('FanNo_Cap');

			Zzseries.setEnabled(false);
			//	Zzmoyr.setEnabled(false);
			ZzDealer1.setEnabled(false);
			FanDealerCap.setEnabled(false);
		},
		onActionNext: function (oEvent) {
			Cap_controller.dialog.open();
			//Cap_controller code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 100; //chnage 25 Sept , 50 earleir

			// if (num === count1) {
			// 	var BtnNext = Cap_controller.getView().byId("capButtonNext");
			// 	BtnNext.setEnabled(false);
			// }
			Cap_controller.data();
		},
		enableExportButton: function () {
			var BtnNext = Cap_controller.getView().byId("capButtonNext");
			var BtnExport = Cap_controller.getView().byId("idBtnExportToExcel");
			if (BtnNext.getEnabled() == false) {
				BtnExport.setEnabled(true);
			} else {
				//BtnExport.setEnabled(false);
				BtnExport.setEnabled(true); // change 24 Sept -requirement change
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
		formatMonthDataForExcel: function (m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12) {
			var d = new Date();
			var n = d.getMonth() + 1;
			Cap_controller.currentMonth = " ";
			Cap_controller.currentMonth1 = " ";
			Cap_controller.currentMonth2 = " ";
			if (n == "1") {
				Cap_controller.currentMonth = m1;
				Cap_controller.currentMonth1 = m2;
				Cap_controller.currentMonth2 = m3;
			} else if (n == "2") {
				Cap_controller.currentMonth = m2;
				Cap_controller.currentMonth1 = m3;
				Cap_controller.currentMonth2 = m4;
			} else if (n == "3") {
				Cap_controller.currentMonth = m3;
				Cap_controller.currentMonth1 = m4;
				Cap_controller.currentMonth2 = m5;
			} else if (n == "4") {
				Cap_controller.currentMonth = m4;
				Cap_controller.currentMonth1 = m5;
				Cap_controller.currentMonth2 = m6;
			} else if (n == "5") {
				Cap_controller.currentMonth = m5;
				Cap_controller.currentMonth1 = m6;
				Cap_controller.currentMonth2 = m7;
			} else if (n == "6") {
				Cap_controller.currentMonth = m6;
				Cap_controller.currentMonth1 = m7;
				Cap_controller.currentMonth2 = m8;
			} else if (n == "7") {
				Cap_controller.currentMonth = m7;
				Cap_controller.currentMonth1 = m8;
				Cap_controller.currentMonth2 = m9;
			} else if (n == "8") {
				Cap_controller.currentMonth = m8;
				Cap_controller.currentMonth1 = m9;
				Cap_controller.currentMonth2 = m10;
			} else if (n == "9") {
				Cap_controller.currentMonth = m9;
				Cap_controller.currentMonth1 = m10;
				Cap_controller.currentMonth2 = m11;
			} else if (n == "10") {
				Cap_controller.currentMonth = m10;
				Cap_controller.currentMonth1 = m11;
				Cap_controller.currentMonth2 = m12;
			} else if (n == "11") {
				Cap_controller.currentMonth = m11;
				Cap_controller.currentMonth1 = m12;
				Cap_controller.currentMonth2 = m1;
			} else {
				Cap_controller.currentMonth = m12;
				Cap_controller.currentMonth1 = m1;
				Cap_controller.currentMonth2 = m2;
			}
			//	return currentMonth;
		},
		_formatAppType: function (deal) {

			if (deal == "R") {
				Cap_controller.formatAppType = "Retail";
			} else {
				Cap_controller.formatAppType = "Fleet";
			}

		},
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}
			//row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("modelYear") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("appType") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("series") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("dealerFan") + ",";
			row += sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Capyear") + ",";
			row += Cap_controller.getView().byId("currentmonthnameid").getText() + ",";
			row += Cap_controller.getView().byId("currentmonthname1id").getText() + ",";
			row += Cap_controller.getView().byId("currentmonthname2id").getText() + ",";

			CSV += row + '\r\n';

			for (var i = 0; i < arrData.length; i++) {
				Cap_controller.formatMonthDataForExcel(arrData[i].Month01, arrData[i].Month02, arrData[i].Month03, arrData[i].Month04, arrData[i].Month05,
					arrData[i].Month06, arrData[i].Month07, arrData[i].Month08, arrData[i].Month09, arrData[i].Month10, arrData[i].Month11, arrData[
						i].Month12);
				Cap_controller._formatAppType(arrData[i].ZzappType);
				row = " ";
				row +=
					//arrData[i].Zzmoyr + ',' +
					Cap_controller.formatAppType + ',' +
					arrData[i].Zzseries + ',' +

					arrData[i].ZzDealer + ',' +
					arrData[i].CapYear + ',' +
					Cap_controller.currentMonth + ',' +
					Cap_controller.currentMonth1 + ',' +
					Cap_controller.currentMonth2 + ',';
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				//alert("Invalid data");
				return;
			}
			var fileName = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CapSoldOrderReport");

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
			var host = Cap_controller.host();
			var ZzappType = Cap_controller.getView().byId("app_Cap").getSelectedKey();
			var Zzseries = Cap_controller.getView().byId("series_Cap").getSelectedKey();
			//	var Zzmoyr;
			//	var Zzmoyr1 = Cap_controller.getView().byId('modelYr_Cap').getSelectedItem();
			/*	if (Zzmoyr1 == null) {
					var d = new Date();
					Zzmoyr = d.getFullYear();
				} else {
					Zzmoyr = Zzmoyr1.getText();
				}*/
			var ZzDealer;
			// = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			var user = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (user == "TCI_Zone_User") {
				var ZzDealer1 = Cap_controller.getView().byId("cbzoneFanNo_Cap").getSelectedKey();
				if (ZzDealer1) {
					ZzDealer = ZzDealer1.substring(ZzDealer1.length - 5, ZzDealer1.length);
				} else {
					ZzDealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				}
			} else {
				ZzDealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
			}
			var url;
			if (ZzappType == "R") {
				if (ZzappType && ZzDealer && Zzseries == "") {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + ZzDealer +

						"' and  ZzappType eq '" + ZzappType + "'";
				} else if (ZzappType && ZzDealer && Zzseries) {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + ZzDealer +

						"' and  ZzappType eq '" + ZzappType +
						"' and  Zzseries eq '" + Zzseries + "'";
				} else {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + ZzDealer +

						"' and  ZzappType eq '" + ZzappType + "'";
				}
			} else if (ZzappType == "F") {
				var FanDealerCap = Cap_controller.getView().byId('FanNo_Cap').getValue();
				if (ZzappType && FanDealerCap && Zzseries == "") {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + FanDealerCap +

						"' and  ZzappType eq '" + ZzappType + "'";
				} else if (ZzappType && FanDealerCap && Zzseries) {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + FanDealerCap +

						"' and  ZzappType eq '" + ZzappType +
						"' and  Zzseries eq '" + Zzseries + "'";
				} else {
					url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + FanDealerCap +

						"' and  ZzappType eq '" + ZzappType + "'";
				}
			} else {

				url = host + "/ZVMS_SOLD_ORDER_SRV/SoCapTableSet?$top=100&$skip=" + num + "&$filter=ZzDealer eq '" + ZzDealer +

					"' and  ZzappType eq 'R'";

			}
			Cap_controller.dialog.open();
			$.ajax({
				url: url,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					Cap_controller.dialog.close();
					// Cap_controller.getView().getModel("CapTableModel").setProperty("/CapBusyIndicator", false);
					var BtnNext = Cap_controller.getView().byId("capButtonNext");
					if (data.d.results.length <= 10) {
						BtnNext.setEnabled(false);
						Cap_controller.enableExportButton();
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = Cap_controller.getView().getModel("CapTableModel");
					if (DataModel.getData().length != undefined) {
						for (var m = 0; m < data.d.results.length; m++) {
							DataModel.getData().push(data.d.results[m]);
							DataModel.updateBindings(true);
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
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageToast.show(errMsg);
				}
			});

		},
		onExit: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.updateBindings(true);
			Cap_controller.getView().setModel(oModel, "CapTableModel");
		}
	});
});