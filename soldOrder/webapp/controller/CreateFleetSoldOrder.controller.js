sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";
	var CFSO_controller;
	var TableData2 = [],
		TableData1 = [],
		_all_data = [];

	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.CreateFleetSoldOrder", {
			formatter: formatter,

			onInit: function () {
				CFSO_controller = this;

				// CFSO_controller.getBrowserLanguage();
				CFSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
				var today = new Date();
				var day30 = new Date();
				/*var tableModelCreate=new sap.ui.model.json.JSONModel([]);
				sap.ui.getCore().setModel(tableModelCreate,'tableModelCreate');
				CFSO_controller.getView().setModel('tableModelCreate');*/
				//console.log(tableModelCreate.getData());
				// CFSO_controller.getFleetCustomer();
				CFSO_controller.getView().setModel(sap.ui.getCore().getModel("fleetModel"), "fleetModel");
				CFSO_controller.initialSeriesData = sap.ui.getCore().getModel("seriesModelF").getData();
				//day30.setDate(today.getDate() + 30);
				var num = 0;
				var endDate = new Date();
				var day5 = new Date();
				// day1.setDate(today.getDate()); //+ 1
				// var cDate = zdateFormat.parse(day1);
				while (num < 5) {
					endDate = new Date(day5.setDate(day5.getDate() + 1));
					if (endDate.getDay() != 0 && endDate.getDay() != 6) {
						//Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
						num++;
					}
				}
				CFSO_controller.getView().byId("etaFrom_CFSO").setMinDate(day5);
				CFSO_controller._alldata = new JSONModel({
					ZsoFltReqNo: 'FSO',
					ZzdealerCode: '',
					ZfanNo: '',
					Zendcu: '',
					ZsoFltStatus: '',
					ZpoNumber: '',
					ZzoneApproval: '',
					ZdriverLiNum: '',
					ZfleetComment: '',
					ZpriceApproval: '',
					ZstatusComment: '',
					FHeadertoItems: _all_data
				});
				CFSO_controller.getView().setModel(CFSO_controller._alldata, 'Data');
				CFSO_controller.secondTblModel = new JSONModel({
					items: TableData2
				});
				CFSO_controller.secondTblModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				CFSO_controller.getView().setModel(CFSO_controller.secondTblModel, 'SecondTable');
				sap.ui.getCore().setModel(CFSO_controller.secondTblModel, 'SecondTable');
				CFSO_controller.firstTblModel = new JSONModel({
					items: TableData1,
					submitEnabled: false,
					invtSelectEnabled: false,
					newFanSelected: false
				});
				CFSO_controller.firstTblModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				CFSO_controller.getView().setModel(CFSO_controller.firstTblModel, 'FirstTable');
				sap.ui.getCore().setModel(CFSO_controller.firstTblModel, 'FirstTable');
				CFSO_controller.getOwnerComponent().getRouter().getRoute("CreateFleetSoldOrder").attachPatternMatched(CFSO_controller._onObjectMatched,
					CFSO_controller);
				var seriesCB = CFSO_controller.getView().byId("series_CFSO");

				var host = CFSO_controller.host();
				var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
				var brand;
				if (isDivisionSent) {
					CFSO_controller.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

					if (CFSO_controller.sDivision == '10') // set the toyoto logo
					{
						CFSO_controller.brand = "TOY";

					} else { // set the lexus logo
						CFSO_controller.brand = "LEX";

						// }
					}
				}

				// var url = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				// 	"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
				// //	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
				// $.ajax({
				// 	url: url,
				// 	method: 'GET',
				// 	async: false,
				// 	dataType: 'json',
				// 	success: function (data, textStatus, jqXHR) {
				// 		var obj = {
				// 			"results": []
				// 		};
				// 		if (seriesCB.getValue() !== "") {
				// 			//seriesCB.setValue(" ");
				// 			seriesCB.setSelectedKey(null);
				// 		}
				// 		//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
				// 		var oModel = new sap.ui.model.json.JSONModel();
				// 		if (CFSO_controller.getView().getModel("Customer").getData().Kukla == "M") {
				// 			for (var m = 0; m < data.d.results.length; m++) {
				// 				if (data.d.results[m].TCISeries == "SIE") {
				// 					obj.results.push(data.d.results[m]);
				// 				}
				// 			}
				// 			oModel.setData(obj);
				// 		} else {
				// 			oModel.setData(data.d.results);
				// 		}

				// 		CFSO_controller.getView().setModel(oModel, "seriesModel");

				// 	},
				// 	error: function (jqXHR, textStatus, errorThrown) {
				// 		var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
				// 		sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
				// 			.m.MessageBox.Action.OK, null, null);
				// 	}
				// });
			},
			_onObjectMatched: function (oEvent) {

				/*	var tableModelCreate= sap.ui.getCore().getModel('tableModelCreate');
					var tableModel=sap.ui.getCore().getModel('tableModel');
					console.log(tableModel.getData());
					tableModelCreate.getData().push(tableModel.getData());
					console.log(tableModelCreate.getData());*/
				//	console.log("CFSO_controller.initialSeriesData", CFSO_controller.initialSeriesData);
				var seriesModel = new sap.ui.model.json.JSONModel();
				if (CFSO_controller.initialSeriesData[0] && CFSO_controller.initialSeriesData[0].ModelSeriesNo === "ALL") {
					delete CFSO_controller.initialSeriesData[0];
					CFSO_controller.initialSeriesData.shift();
				}
				var temp = CFSO_controller.initialSeriesData;
				if (CFSO_controller.getView().getModel("Customer") && CFSO_controller.getView().getModel("Customer").getData().Kukla == "M") {
					var temp2 = temp.filter(function (val) {
						return val.ModelSeriesNo == "SIE";
					})
				} else {
					temp2 = temp;
				}
				//console.log("temp2", temp2);
				seriesModel.setData(temp2);
				CFSO_controller.getView().setModel(seriesModel, "seriesModel");
				CFSO_controller.dialog = new sap.m.BusyDialog({
					text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
				});
				CFSO_controller.getView().byId("idmenu1").setType('Transparent');
				CFSO_controller.getView().byId("idmenu2").setType('Transparent');
				CFSO_controller.getView().byId("idmenu3").setType('Emphasized');
				CFSO_controller.getView().byId("idmenu4").setType('Transparent');
				CFSO_controller.getView().byId("idmenu5").setType('Transparent');
				CFSO_controller.getView().byId("idmenu9").setType('Transparent');
				// if ((sap.ui.getCore().getModel('FirstTable').getData() && sap.ui.getCore().getModel('FirstTable').getData().items.length <= 0) || (sap.ui.getCore().getModel('SecondTable') != undefined &&
				// 		sap.ui.getCore().getModel('FirstTable').getData() && sap.ui.getCore().getModel('FirstTable').getData().items.length <= 0)) {
				// 	CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
				// }
				if (TableData2) {
					TableData2 = [];
				}
				if (sap.ui.getCore().getModel('FirstTable').getData() && sap.ui.getCore().getModel('FirstTable').getData().items.length <= 0) {
					CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
				}
				// else if (sap.ui.getCore().getModel('SecondTable') != undefined) {
				// 	if (sap.ui.getCore().getModel('FirstTable').getData().items.length <= 0) {
				// 		CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
				// 	} else {
				// 		CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
				// 	}
				// }
				else {
					CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
				}

				var FanNo_CFSO = this.getView().byId('FanNo_CFSO');
				FanNo_CFSO.$().find("input").attr("readonly", true);
				var modelYr_CFSO = this.getView().byId("modelYr_CFSO");
				modelYr_CFSO.$().find("input").attr("readonly", true);
				var modelCode_CFSO = this.getView().byId("modelCode_CFSO");
				modelCode_CFSO.$().find("input").attr("readonly", true);
				var suffix_CFSO = this.getView().byId("suffix_CFSO");
				suffix_CFSO.$().find("input").attr("readonly", true);
				var color_CFSO = this.getView().byId("color_CFSO");
				color_CFSO.$().find("input").attr("readonly", true);
				var Apx_CFSO = this.getView().byId("Apx_CFSO");
				Apx_CFSO.$().find("input").attr("readonly", true);

			},
			_newService1: function () {
				var host = CFSO_controller.host();
				var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_configuration?$format=json";
				$.ajax({
					url: oUrl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel(data.d.results);
						CFSO_controller.getView().setModel(oModel, "oModel1");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			},
			_newService2: function () {
				var host = CFSO_controller.host();
				var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim?$format=json";
				$.ajax({
					url: oUrl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						// console.log("Result from zc_exterior_trim");
						// console.log(data.d.results);
						var oModel = new sap.ui.model.json.JSONModel(data.d.results);
						CFSO_controller.getView().setModel(oModel, "oModel2");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			},
			_newService3: function () {
				var host = CFSO_controller.host();
				// ZC_BRAND_MODEL_DETAIL
				var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_model?$format=json";
				$.ajax({
					url: oUrl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						// console.log("Result from ZC_BRAND_MODEL_DETAIL");
						// console.log(data.d.results);

						var oModel = new sap.ui.model.json.JSONModel(data.d.results);
						oModel.setData(data.d.results);
						//	CFSO_controller.getView().byId("model_RSOA").setSizeLimit(oModel.getData().length);
						CFSO_controller.getView().setModel(oModel, "oModel3");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			},
			_handleToDateChange: function () {
				// Handle th Validation Date "YYYYMMdd"
				var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				var etaFrom = CFSO_controller.getView().byId("etaFrom_CFSO").getValue();
				var count = 0;
				var endDate = new Date();
				var CDate = zdateFormat.parse(etaFrom);
				var day5 = new Date();
				if (etaFrom !== "") {
					while (count < 5) {
						endDate = new Date(CDate.setDate(CDate.getDate() + 1));
						if (endDate.getDay() != 0 && endDate.getDay() != 6) {
							//Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
							count++;
						}
					}

					CFSO_controller.getView().byId("etaTo_CFSO").setMinDate(CDate);
				} else {
					var errForm = formatter.formatErrorType("SO00002");
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap.m.MessageBox.Action.OK, null, null);
				}

				// var etaFrom = CFSO_controller.getView().byId("etaFrom_RSOA").getValue();
				// if (etaFrom !== "") {
				// 	var CDate = new Date(etaFrom);
				// 	var day5 = CDate;
				// 	day5.setDate(CDate.getDate() + 5);
				// 	CFSO_controller.getView().byId("etaTo_RSOA").setMinDate(day5);
				// } else {
				// 	var errForm = formatter.formatErrorType("SO00002");
				// 	var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				// 	sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				// }
			},
			_handleRSADropDown: function () {
				var host = CFSO_controller.host();
				var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_PIO_DIO?$format=json";
				$.ajax({
					url: oUrl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						// console.log("Result from ZC_PIO_DIO");
						// console.log(data.d.results);
						var oModel = new sap.ui.model.json.JSONModel(data.d.results);
						CFSO_controller.getView().setModel(oModel, "mode_Model");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			},

			listOfModelYear: function () {
				var d = new Date();
				var currentModelYear = d.getFullYear();
				var previousModelYear = currentModelYear - 1;
				var nextModelYear = currentModelYear + 1;
				var previousModelYear2 = previousModelYear - 1;
				var nextModelYear2 = nextModelYear + 1;

				var data = {
					"modelYear": [{
						"key": "1",
						"text": previousModelYear2
					}, {
						"key": "2",
						"text": previousModelYear
					}, {
						"key": "3",
						"text": currentModelYear
					}, {
						"key": "4",
						"text": nextModelYear
					}, {
						"key": "5",
						"text": nextModelYear2
					}]
				};
				var modelYearModel2 = new JSONModel();
				modelYearModel2.setData(data);
				CFSO_controller.getView().byId("modelYr_CFSO").setModel(modelYearModel2);

			},
			_handleChange: function () {
				// Handle th Validation Date "YYYYMMdd"
				var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				var etaFrom = CFSO_controller.getView().byId("etaFrom_CFSO").getValue();
				var count = 0;
				var endDate = new Date();
				var CDate = zdateFormat.parse(etaFrom);
				var day5 = new Date();
				if (etaFrom !== "") {
					while (count < 5) {
						endDate = new Date(CDate.setDate(CDate.getDate() + 1));
						if (endDate.getDay() != 0 && endDate.getDay() != 6) {
							//Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
							count++;
						}
					}

					CFSO_controller.getView().byId("etaTo_CFSO").setMinDate(CDate);
				} else {
					var errForm = formatter.formatErrorType("SO00002");
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap.m.MessageBox.Action.OK, null, null);
				}

				// var etaFrom = CFSO_controller.getView().byId("etaFrom_RSOA").getValue();
				// if (etaFrom !== "") {
				// 	var CDate = new Date(etaFrom);
				// 	var day5 = CDate;
				// 	day5.setDate(CDate.getDate() + 5);
				// 	CFSO_controller.getView().byId("etaTo_RSOA").setMinDate(day5);
				// } else {
				// 	var errForm = formatter.formatErrorType("SO00002");
				// 	var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				// 	sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				// }
			},
			onColumnResize: function (oEvent) {
				oEvent.preventDefault();
			},
			_addVehiclesToInventory: function () {
				CFSO_controller.getOwnerComponent().getRouter().navTo("InventoryVehicleSelection", {}, true); //page 12
			},
			_onDelete1: function () {
				var oTable = CFSO_controller.getView().byId("idCFSO_Table1");
				var oModel2 = oTable.getModel('FirstTable');

				var aContexts = oTable.getSelectedIndices();

				if (aContexts.length === 0) {
					var errForm = formatter.formatErrorType("SO00007");
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					for (var i = aContexts.length - 1; i >= 0; i--) {
						var index = aContexts[i];
						oModel2.getData().items.splice(index, 1);
					}
					oModel2.refresh();
					// if (oModel2.getData().items.length <= 0) {
					// 	CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
					// } else {
					// 	CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
					// }
				}
				oTable.clearSelection("true"); // 23 sep change
			},
			onMandatoryValChange: function (evt) {
				// 			if (evt.getParameter("value").length > 0) {
				// 				CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
				// 			}
				var modelCB = CFSO_controller.getView().byId("modelCode_CFSO");
				var suffixCB = CFSO_controller.getView().byId("suffix_CFSO");
				var series = CFSO_controller.getView().byId("series_CFSO");
				var apxCB = CFSO_controller.getView().byId("Apx_CFSO");
				var colorCB = CFSO_controller.getView().byId("color_CFSO");
				CFSO_controller.getView().byId("quantity_CFSO").setValue("");
				CFSO_controller.getView().byId("etaFrom_CFSO").setDateValue(null);
				CFSO_controller.getView().byId("etaTo_CFSO").setDateValue(null);
				CFSO_controller.getView().byId("modelYr_CFSO").setValue("");
				series.setSelectedKey(null);
				series.destroyItems();
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();

			},
			_onDelete2: function () {
				var oTable = CFSO_controller.getView().byId("idCFSO_Table2");
				var oModel2 = oTable.getModel('SecondTable');
				var aContexts = oTable.getSelectedIndices();

				if (aContexts.length === 0) {
					var errForm = formatter.formatErrorType("SO00007");
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					for (var i = aContexts.length - 1; i >= 0; i--) {
						var index = aContexts[i];
						oModel2.getData().items.splice(index, 1);
					}
					oModel2.refresh();
					if (oModel2.getData().items.length <= 0) {
						CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
					} else {
						CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
					}
				}
				oTable.clearSelection("true"); // 24 sep change
			},
			_onSubmit: function () {
				CFSO_controller.dialog.open();
				if (CFSO_controller.getView().byId("FanNo_CFSO").getValue() !== "") {
					CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
					//CFSO_controller.getView().byId("ID_PONumber");
					_all_data.splice(0, _all_data.length);
					var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-ddTHH:mm:ss"
					});
					TableData1 = CFSO_controller.getView().getModel('FirstTable').getData().items;
					for (var i = 0; i < TableData1.length; i++) {
						_all_data.push({
							FleetSONo: 'FSO',
							FleetSOItem: i.toString(),
							Model: TableData1[i].Model,
							Modelyear: TableData1[i].Modelyear,
							Suffix: TableData1[i].Suffix,
							ExteriorColourCode: TableData1[i].ExteriorColorCode,
							APX: TableData1[i].APX,
							ReqEtaFrom: zdateFormat.parse(TableData1[i].ETAFrom),
							ReqEtaTo: zdateFormat.parse(TableData1[i].ETATo),
							Zzvtn: TableData1[i].ZZVTN
						});
					}
					var length = TableData1.length;
					for (var i = 0; i < TableData2.length; i++) {
						length = length + i;
						_all_data.push({
							FleetSONo: 'FSO',
							FleetSOItem: length.toString(),
							Model: TableData2[i].model,
							Modelyear: TableData2[i].modelYear,
							Suffix: TableData2[i].suffix,
							ExteriorColourCode: TableData2[i].colour,
							APX: TableData2[i].APX,
							ReqEtaFrom: TableData2[i].ETAFrom,
							ReqEtaTo: TableData2[i].ETATime,
							FltSOQty: TableData2[i].quantity
								// series: valSeries,
						});

					}
					CFSO_controller.getView().getModel('Data').getData().Zendcu = CFSO_controller.getView().getModel('Customer').getData().Partner;
					var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
					CFSO_controller.getView().getModel('Data').getData().ZzdealerCode = dealer_no;
					CFSO_controller.getView().getModel('mainservices').create('/SO_FLEET_HeaderSet', CFSO_controller.getView().getModel('Data').getData(), {
						success: function (oData, oResponse) {
							CFSO_controller.dialog.close();
							if (CFSO_controller.getView().getModel('FirstTable')) {
								CFSO_controller.getView().getModel('FirstTable').getData().items = "";
							}
							if (CFSO_controller.getView().getModel('SecondTable')) {
								CFSO_controller.getView().getModel('SecondTable').getData().items = "";
								CFSO_controller.getView().byId("idCFSO_Table2").getModel("SecondTable").setData({
									items: ""
								});
							}
							CFSO_controller.getView().getModel("Customer").setData("");
							CFSO_controller.getView().byId("FanNo_CFSO").setValue("");
							CFSO_controller.getView().byId("ID_PONumber").setValue("");
							CFSO_controller.getView().byId("quantity_CFSO").setValue("");
							//CFSO_controller.getView().byId("modelYr_CFSO").setSelectedKey();
							CFSO_controller.getView().byId("suffix_CFSO").setSelectedKey();
							CFSO_controller.getView().byId("color_CFSO").setSelectedKey();
							//	CFSO_controller.getView().byId("quantity_CFSO").setValue("");
							CFSO_controller.getView().byId("etaFrom_CFSO").setDateValue(null);
							CFSO_controller.getView().byId("etaTo_CFSO").setDateValue(null);

							CFSO_controller.getView().byId("modelYr_CFSO").setValue("");
							CFSO_controller.getView().byId("Apx_CFSO").setSelectedKey();
							CFSO_controller.getView().byId("modelCode_CFSO").setSelectedKey();
							CFSO_controller.getView().byId("series_CFSO").setSelectedKey();

							if (oData.ZsoFltReqNo) {
								CFSO_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
									Soreq: oData.ZsoFltReqNo
								}, true);
							}

						},
						error: function (oData, oResponse) {
							CFSO_controller.dialog.close();
						}
					});
				} else {
					CFSO_controller.dialog.close();
					CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
					sap.m.MessageBox.show(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("CompleteAllFields"), sap.m.MessageBox
						.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error"), sap.m.MessageBox.Action.OK, null,
						null);
				}
				
				CFSO_controller.getView().getModel('SecondTable').refresh(true);
				CFSO_controller.getView().getModel('SecondTable').updateBindings(true);
			},
			_onAddRow2: function () {
				CFSO_controller.allocatedNo = 2;
				var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
				var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getSelectedKey();
				var valSeries = CFSO_controller.getView().byId("series_CFSO").getSelectedKey();
				var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getSelectedKey();
				var colour = CFSO_controller.getView().byId("color_CFSO").getSelectedKey();
				var apx = CFSO_controller.getView().byId("Apx_CFSO").getSelectedKey();
				var etaFrom = CFSO_controller.getView().byId("etaFrom_CFSO").getDateValue();
				var etaTo = CFSO_controller.getView().byId("etaTo_CFSO").getDateValue();
				var quantity = CFSO_controller.getView().byId("quantity_CFSO").getValue();
			//	var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
				var fanNo=CFSO_controller.getView().byId("FanNo_CFSO").getValue();
				//	var apptype="F";// cr 76
				var host = CFSO_controller.host();
				
				var zurl = host + "/ZVMS_SOLD_ORDER_SRV/SoCapSet(Zzmoyr='" + valModelYr + "',ZzappType='F',Zzseries='" + valSeries + "',Zzmodel='" +valModelCode+"',ZzDealer='" +fanNo+"')";
			//	var zurl = host + "/ZVMS_SOLD_ORDER_SRV/SoCapSet(Zzmoyr='" + valModelYr + "',ZzappType='F',Zzseries='" + valSeries + "',Zzmodel='" +valModelCode+"',ZzDealer='" +CFSO_controller.dealer+"')";
		 
			if (quantity.length > 0) {
				$.ajax({
					url: zurl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						CFSO_controller.allocatedNo = data.d.results.Allowed;
						if (CFSO_controller.allocatedNo >= quantity) {
							var remQ=CFSO_controller.allocatedNo-quantity;
							var sMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("informAllocation", [remQ]);
							sap.m.MessageBox.show(sMsg, {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Information"),
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction == "YES") {
										for (var i = 0; i < quantity.length; i++) {
											if (isNaN(quantity[i])) {
												var errMsgNum = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorNumber");
												sap.m.MessageBox.show(errMsgNum, sap.m.MessageBox.Icon.ERROR, "Error", sap
													.m.MessageBox.Action.OK, null, null);
											}
										}
									} else {
									}

								}
							});

						} else {
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorAllocation");
							var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
								.m.MessageBox.Action.OK, null, null);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});

			}
			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "" || colour == "" || apx == "" || etaFrom === null ||
				etaTo === null || quantity == "") {
				var errForm = formatter.formatErrorType("SO00003");
				CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", false);
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);

			} else {
				TableData2.push({
					modelYear: valModelYr,
					suffix: valSuffix,
					series: valSeries,
					model: valModelCode,
					colour: CFSO_controller.getView().byId("color_CFSO").getSelectedKey(),
					APX: CFSO_controller.getView().byId("Apx_CFSO").getSelectedKey(),
					ETAFrom: CFSO_controller.getView().byId("etaFrom_CFSO").getDateValue(),
					ETATime: CFSO_controller.getView().byId("etaTo_CFSO").getDateValue(),
					quantity: CFSO_controller.getView().byId("quantity_CFSO").getValue(),
				});
				CFSO_controller.getView().byId("idCFSO_Table2").getModel("SecondTable").setData({
					items: TableData2
				});
				CFSO_controller.getView().getModel('SecondTable').refresh(true);
				CFSO_controller.getView().getModel('SecondTable').updateBindings(true);
				CFSO_controller.getView().getModel('FirstTable').setProperty("/submitEnabled", true);
			}
		},

		//for (var i = aContexts.length - 1; i >= 0; i--) {
		/*	var oCFSO_controllerObj = aContexts[i].getObject();
			var index = $.map(aRows, function (obj, index) {
				if (obj === oCFSO_controllerObj) {
					return index;
				}
			});*/
		//-----------------------------------------
		//---------Handling Select Year----------
		//--------------------------------------------
		select_year: function (Oevent) {

			if (!CFSO_controller._oPopover) {
				CFSO_controller._oPopover = sap.ui.xmlfragment("YearPopup", "toyota.ca.SoldOrder.view.fragments.YearPopup", CFSO_controller);
				CFSO_controller.getView().addDependent(CFSO_controller._oPopover);
			}
			CFSO_controller._oPopover.openBy(Oevent.getSource());
			var input_ref = Oevent.getSource();
			var mYear = input_ref.getValue();
			//	RSOA_controller._handleSeries(mYear);

		},
		_handleSeries: function (modelyear) {
			var host = CFSO_controller.host();
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				if (this.sDivision == '10') {
					CFSO_controller.divison = "TOY";
				} else { // set the lexus logo
					CFSO_controller.divison = "LEX";
				}
			}

			//var modelyear = this.getView().byId('modelYr_CFSO').getValue();
			var url = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_SoldOrder_Series(P_moyr='" + modelyear +
				"',P_app_type='F')/Set?$filter=Division eq '" + CFSO_controller.divison + "'";
			/*"/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
					"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";*/
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			var seriesCB = CFSO_controller.getView().byId("series_CFSO");
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
					//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					CFSO_controller.getView().setModel(oModel, "seriesModel");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("Error1");
					var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		handleSelectYearPress: function (Oevent) {
			CFSO_controller.getView().byId("modelYr_CFSO").setValue(CFSO_controller._oPopover.getContent()[0].getYear());
			var series = CFSO_controller.getView().byId('series_CFSO').getSelectedKey();
			var modelyear = CFSO_controller.getView().byId('modelYr_CFSO').getValue();
			CFSO_controller._handleSeries(modelyear);
			if (series && modelyear) {
				var modelCB = CFSO_controller.getView().byId("modelCode_CFSO");
				var suffixCB = CFSO_controller.getView().byId("suffix_CFSO");
				var apxCB = CFSO_controller.getView().byId("Apx_CFSO");
				var colorCB = CFSO_controller.getView().byId("color_CFSO");
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				var model;
				// var language = CFSO_controller.returnBrowserLanguage();

				if (language === "FR") {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				} else {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				}
				var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = CFSO_controller.getView().byId('model_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
			CFSO_controller._oPopover.close();
		},
		initailyear: function (oEvent) {
			CFSO_controller._oPopover.getContent()[0].setDate(new Date());
		},
		onpreviousyears: function (oEvent) {
			CFSO_controller._oPopover.getContent()[0].previousPage();
		},
		onnextyears: function (oEvent) {
			CFSO_controller._oPopover.getContent()[0].nextPage();
		},

		series_selected: function (oEvent) {

			// var year = CFSO_controller.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"

			var series = CFSO_controller.getView().byId('series_CFSO').getSelectedKey();
			var modelyear = CFSO_controller.getView().byId('modelYr_CFSO').getValue();

			if (series && modelyear) {
				var modelCB = this.getView().byId("modelCode_CFSO");
				modelCB.$().find("input").attr("readonly", true);
				var suffix_CFSO = this.getView().byId("suffix_CFSO");
				suffix_CFSO.$().find("input").attr("readonly", true);
				var color_CFSO = this.getView().byId("color_CFSO");
				color_CFSO.$().find("input").attr("readonly", true);
				var Apx_CFSO = this.getView().byId("Apx_CFSO");
				Apx_CFSO.$().find("input").attr("readonly", true);

				var modelCB = CFSO_controller.getView().byId("modelCode_CFSO");
				var suffixCB = CFSO_controller.getView().byId("suffix_CFSO");
				var apxCB = CFSO_controller.getView().byId("Apx_CFSO");
				var colorCB = CFSO_controller.getView().byId("color_CFSO");
				CFSO_controller.getView().byId("quantity_CFSO").setValue("");
				CFSO_controller.getView().byId("etaFrom_CFSO").setDateValue(null);
				CFSO_controller.getView().byId("etaTo_CFSO").setDateValue(null);
				modelCB.setSelectedKey(null);
				modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				var model;
				// var language = CFSO_controller.returnBrowserLanguage();
				var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				if (language === "FR") {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				} else {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				}
				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = CFSO_controller.getView().byId('model_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var modelYr_CFSO = this.getView().byId("modelYr_CFSO");
			modelYr_CFSO.$().find("input").attr("readonly", true);
			var modelCode_CFSO = this.getView().byId("modelCode_CFSO");
			modelCode_CFSO.$().find("input").attr("readonly", true);
			var suffix_CFSO = this.getView().byId("suffix_CFSO");
			suffix_CFSO.$().find("input").attr("readonly", true);
			var color_CFSO = this.getView().byId("color_CFSO");
			color_CFSO.$().find("input").attr("readonly", true);
			var Apx_CFSO = this.getView().byId("Apx_CFSO");
			Apx_CFSO.$().find("input").attr("readonly", true);

			var model = oEvent.getSource().getSelectedKey();
			var modelyear = CFSO_controller.getView().byId('modelYr_CFSO').getValue();
			// var language = CFSO_controller.returnBrowserLanguage();
			var suf;
			var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

			var brand;
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				CFSO_controller.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (CFSO_controller.sDivision == '10') // set the toyoto logo
				{
					CFSO_controller.brand = "TOYOTA";

				} else { // set the lexus logo
					CFSO_controller.brand = "LEXUS";

					// }
				}
			}
			if (language === "FR") {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			} else {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			if (model && modelyear) {
				// var modelCB = CFSO_controller.getView().byId("modelCode_CFSO");
				var suffixCB = CFSO_controller.getView().byId("suffix_CFSO");
				var apxCB = CFSO_controller.getView().byId("Apx_CFSO");
				var colorCB = CFSO_controller.getView().byId("color_CFSO");
				CFSO_controller.getView().byId("quantity_CFSO").setValue("");
				CFSO_controller.getView().byId("etaFrom_CFSO").setDateValue(null);
				CFSO_controller.getView().byId("etaTo_CFSO").setDateValue(null);
				// 		modelCB.setSelectedKey(null);
				// modelCB.destroyItems();
				suffixCB.setSelectedKey(null);
				suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				suffixCB.bindItems({
					path: "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "',typ='F')/Set",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("brand", sap.ui.model.FilterOperator.EQ, CFSO_controller.brand)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						// text:"{parts: [{path:'mainservices>suffix'},{path:'mainservices>option_1_desc_en'},{path:'mainservices>suffix_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}"
						text: suf
					})
				});
				// var items_binding = CFSO_controller.getView().byId('Suffix_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
			}
		},
		suffix_selected: function (oEvent) {

			var suffix_CFSO = this.getView().byId("suffix_CFSO");
			suffix_CFSO.$().find("input").attr("readonly", true);
			var color_CFSO = this.getView().byId("color_CFSO");
			color_CFSO.$().find("input").attr("readonly", true);
			var Apx_CFSO = this.getView().byId("Apx_CFSO");
			Apx_CFSO.$().find("input").attr("readonly", true);

			var suffix = oEvent.getSource().getSelectedKey();
			var modelyear = CFSO_controller.getView().byId('modelYr_CFSO').getValue();
			var model = CFSO_controller.getView().byId('modelCode_CFSO').getSelectedKey();
			if (model && modelyear && suffix) {
				// var suffixCB = CFSO_controller.getView().byId("suffix_CFSO");

				CFSO_controller.getView().byId("quantity_CFSO").setValue("");
				CFSO_controller.getView().byId("etaFrom_CFSO").setDateValue(null);
				CFSO_controller.getView().byId("etaTo_CFSO").setDateValue(null);
				var apxCB = CFSO_controller.getView().byId("Apx_CFSO");
				var colorCB = CFSO_controller.getView().byId("color_CFSO");

				// 		modelCB.setSelectedKey(null);
				// modelCB.destroyItems();
				// suffixCB.setSelectedKey(null);
				// suffixCB.destroyItems();
				apxCB.setSelectedKey(null);
				apxCB.destroyItems();
				colorCB.setSelectedKey(null);
				colorCB.destroyItems();
				apxCB.bindItems({
					path: 'mainservices>/ZVMS_CDS_APX',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						// key: "{VechileModel>zzapx}",
						key: "{mainservices>zzapx}",
						// text: "{VechileModel>zzapx}"
						text: "{mainservices>zzapx}"
					})
				});

				var color;
				// var language = CFSO_controller.returnBrowserLanguage();
				if (language === "FR") {
					color = "{mainservices>ext}/{mainservices>mktg_desc_fr}";
				} else {
					color = "{mainservices>ext}/{mainservices>mktg_desc_en}";
				}
				colorCB.bindItems({
					path: 'mainservices>/ZVMS_CDS_Colour',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>ext}",
						text: color
					})
				});
				// var items_binding = CFSO_controller.getView().byId('Colour_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		},
		//----------------------------------
		//----------Fan Number---------------
		//----------------------------------
		_valuehelpfanno: function (oEvent) {
			var FanNo_CFSO = this.getView().byId('FanNo_CFSO');
			FanNo_CFSO.$().find("input").attr("readonly", true);

			if (!CFSO_controller._addNewFanPage) {
				CFSO_controller._addNewFanPage = sap.ui.xmlfragment('FanNo', "toyota.ca.SoldOrder.view.fragments.FanNo", CFSO_controller);
				CFSO_controller.getView().addDependent(CFSO_controller._addNewFanPage);
			}
			// CFSO_controller._addNewFanPage.setModel(CFSO_controller.getView().getModel());
			CFSO_controller._addNewFanPage.open();
		},

		isNumberKey: function (evt) {
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
				sap.m.MessageBox.show("Please enter a numeric value", sap.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
				return false;
			}
			return true;
		},
		onCloseDialogFan: function (Oevent) {
			CFSO_controller.dialog.open();
			CFSO_controller.getView().byId("series_CFSO").setSelectedKey();
			CFSO_controller.getView().getModel('FirstTable').setProperty("/invtSelectEnabled", true);
			var Fan = CFSO_controller.getView().byId("FanNo_CFSO");
			var key = Oevent.getParameter("selectedContexts")[0].getProperty('BusinessPartnerKey');
			CFSO_controller.dealer=Oevent.getParameter("selectedContexts")[0].getProperty('BusinessPartnerKey');
			var text = Oevent.getParameter("selectedContexts")[0].getProperty('SearchTerm2');
			CFSO_controller.getView().getModel('mainservices').read("/Customer_infoSet('" + key + "')", {
				success: function (data, textStatus, jqXHR) {
					CFSO_controller.getView().getModel('FirstTable').setProperty("/newFanSelected", true);
					var oModel = new sap.ui.model.json.JSONModel(data.CustomerInfo);
					CFSO_controller.getView().setModel(oModel, "Customer");
					sap.ui.getCore().setModel(oModel, "CustomerData");
					Fan.setValue(text);
					CFSO_controller.onMandatoryValChange();
					CFSO_controller.updateSeries();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					CFSO_controller.dialog.close();
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
						sap.m.MessageBox.Action.OK, null, null);
				}
			});

		},

		updateSeries: function () {
			CFSO_controller.dialog.close();
			var dataUpdated;
			var data = CFSO_controller.initialSeriesData;
			if (data[0] && data[0].ModelSeriesNo === "ALL") {
				delete data[0];
				data.shift();
			}
			if (CFSO_controller.getView().getModel("Customer").getData().Kukla == "M") {
				dataUpdated = data.filter(function (val) {
					return val.ModelSeriesNo == "SIE";
				})
			} else {
				dataUpdated = data;
			}
			//	console.log("dataUpdated", dataUpdated);
			CFSO_controller.getView().getModel("seriesModel").setData(dataUpdated);
			//	console.log("data", CFSO_controller.getView().getModel("seriesModel"));
			CFSO_controller.getView().getModel("seriesModel").updateBindings(true);

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
		onAfterRendering: function () {
			var FanNo_CFSO = this.getView().byId("FanNo_CFSO");
			FanNo_CFSO.addEventDelegate({
				onAfterRendering: function () {
					FanNo_CFSO.$().find("input").attr("readonly", true);
				}
			});
			var modelYr_CFSO = this.getView().byId("modelYr_CFSO");
			modelYr_CFSO.addEventDelegate({
				onAfterRendering: function () {
					modelYr_CFSO.$().find("input").attr("readonly", true);
				}
			});

			var modelCode_CFSO = this.getView().byId("modelCode_CFSO");
			modelCode_CFSO.addEventDelegate({
				onAfterRendering: function () {
					modelCode_CFSO.$().find("input").attr("readonly", true);
				}
			});
			var suffix_CFSO = this.getView().byId("suffix_CFSO");
			suffix_CFSO.addEventDelegate({
				onAfterRendering: function () {
					suffix_CFSO.$().find("input").attr("readonly", true);
				}
			});
			var color_CFSO = this.getView().byId("color_CFSO");
			color_CFSO.addEventDelegate({
				onAfterRendering: function () {
					color_CFSO.$().find("input").attr("readonly", true);
				}
			});
			var Apx_CFSO = this.getView().byId("Apx_CFSO");
			Apx_CFSO.addEventDelegate({
				onAfterRendering: function () {
					Apx_CFSO.$().find("input").attr("readonly", true);
				}
			});

		}
		// _handleServiceSuffix_Series: function () {
		// 	var host = CFSO_controller.host();
		// 	var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?$format=json";
		// 	$.ajax({
		// 		url: oUrl,
		// 		method: 'GET',
		// 		async: false,
		// 		dataType: 'json',
		// 		success: function (data, textStatus, jqXHR) {
		// 			var oModel = new sap.ui.model.json.JSONModel();
		// 			oModel.setData(data.d.results);
		// 			CFSO_controller.getView().setModel(oModel, "seriesModel");
		// 		},
		// 		error: function (jqXHR, textStatus, errorThrown) {
		// 			sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
		// 				.m.MessageBox.Action.OK, null, null);
		// 		}
		// 	});
		// },
		// _handleServiceSuffix_Series: function () {
		// 	var host = CFSO_controller.host();
		// 	var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_MODEL_DETAILS?$format=json";
		// 	$.ajax({
		// 		url: oUrl,
		// 		method: 'GET',
		// 		async: false,
		// 		dataType: 'json',
		// 		success: function (data, textStatus, jqXHR) {

		// 			// console.log("Result from ZC_MODEL_DETAILS ");
		// 			// console.log(data.d.results);
		// 			var oModel = new sap.ui.model.json.JSONModel();

		// 			var arr = [];
		// 			var j = 0;
		// 			for (var c = 0; c < data.d.results.length; c++) {
		// 				for (var i = 0; i < data.d.results.length; i++) {
		// 					if ($.inArray(data.d.results[i]["TCISeries"], arr) < 0) {
		// 						arr[j] = data.d.results[i]["TCISeries"];
		// 						j++;

		// 					}
		// 				}
		// 			}

		// 			oModel.setData(arr);
		// 			CFSO_controller.getView().setModel(oModel, "seriesModel");
		// 			// console.log(CFSO_controller.getView().getModel("seriesModel").getData());

		// 			var oModel2 = new sap.ui.model.json.JSONModel();

		// 			var arr2 = [''];
		// 			var k = 0;
		// 			for (var q = 0; q < data.d.results.length; q++) {
		// 				for (var i = 0; i < data.d.results.length; i++) {
		// 					if ($.inArray(data.d.results[i]["suffix"], arr2) < 0) {
		// 						arr2[k] = data.d.results[i]["suffix"];
		// 						k++;
		// 					}
		// 				}
		// 			}
		// 			// console.log(arr2);
		// 			oModel2.setData(arr2);
		// 			CFSO_controller.getView().setModel(oModel2, "suffix_Model");

		// 		},
		// 		error: function (jqXHR, textStatus, errorThrown) {
		// 			sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
		// 				.m.MessageBox.Action.OK, null, null);
		// 		}
		// 	});
		// },

		// getFleetCustomer: function () {
		// 	var sLocation = window.location.host;
		// 	var sLocation_conf = sLocation.search("webide");

		// 	var sPrefix;
		// 	if (sLocation_conf == 0) {
		// 		sPrefix = "/soldorder_node"; //ecpSales_node_secured
		// 		CFSO_controller.fleetUrl = "/userDetails/FleetCustomers"; //"/userDetails/attributesforlocaltesting";
		// 	} else {
		// 		sPrefix = "";
		// 		CFSO_controller.fleetUrl = "/userDetails/FleetCustomers";
		// 	}

		// 	//======================================================================================================================//			
		// 	//  on init method,  get the token attributes and authentication details to the UI from node layer.  - begin
		// 	//======================================================================================================================//		
		// 	//  get the Scopes to the UI 
		// 	//CFSO_controller.sPrefix ="";

		// 	var that = CFSO_controller;
		// 	// var zjson = new JSONModel();
		// 	// sap.ui.getCore().setModel(zjson,"LoginUserModel");
		// 	$.ajax({
		// 		url: sPrefix + CFSO_controller.fleetUrl,
		// 		type: "GET",
		// 		dataType: "json",
		// 		async: false,
		// 		success: function (oData) {
		// 			var oModel = new sap.ui.model.json.JSONModel();
		// 			oModel.setData(oData.attributes);
		// 			CFSO_controller.getView().setModel(oModel, "fleetModel");

		// 		},
		// 		error: function (jqXHR, textStatus, errorThrown) {
		// 			var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
		// 			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
		// 				.m.MessageBox.Action.OK, null, null);
		// 		}
		// 	});
		// },
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------

		// // var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
		// // var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue();
		// // var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue();
		// // var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue();
		// series_selected: function (oEvent) {

		// 	// var year = CFSO_controller.getView().byId('modelYr_RSOA').getValue();
		// 	// items="{ path: 'oModel3>/'}"
		// 	var series = oEvent.getSource().getSelectedKey();
		// 	if (series) {
		// 		CFSO_controller.getView().byId("modelCode_CFSO").bindItems("oModel3>/", new sap.ui.core.ListItem({
		// 			key: "{oModel3>Model}",
		// 			text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
		// 		}));
		// 		var items_binding = CFSO_controller.getView().byId("modelCode_CFSO").getBinding('items');
		// 		items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
		// 	}
		// },
		// model_selected: function (oEvent) {
		// 	// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
		// 	var model = oEvent.getSource().getSelectedKey();
		// 	var modelyear = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
		// 	if (model && modelyear) {
		// 		CFSO_controller.getView().byId('suffix_CFSO').bindItems('oModel1>/', new sap.ui.core.ListItem({
		// 			key: "{oModel1>Suffix}",
		// 			text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel1>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
		// 		}));
		// 		var items_binding = CFSO_controller.getView().byId('suffix_CFSO').getBinding('items');
		// 		items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
		// 			new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
		// 		], true));
		// 	}
		// },
		// suffix_selected: function (oEvent) {
		// 	//-----------------
		// 	//----APX---------
		// 	//----------------
		// 	//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
		// 	var suffix = oEvent.getSource().getSelectedKey();
		// 	var modelyear = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
		// 	var model = CFSO_controller.getView().byId("modelCode_CFSO").getSelectedKey();
		// 	if (model && modelyear && suffix) {
		// 		// CFSO_controller.getView().byId('Apx_RSOA').bindItems('mode_Model>/', new sap.ui.core.ListItem({
		// 		// 	key: "{mode_Model>zzapx}",
		// 		// 	text: "{mode_Model>zzapx}"
		// 		// }));
		// 		// var items_binding = CFSO_controller.getView().byId('Apx_RSOA').getBinding('items');
		// 		// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
		// 		// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
		// 		// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
		// 		// ], true));
		// 		//-----------------
		// 		//----Color---------
		// 		//----------------
		// 		CFSO_controller.getView().byId('color_CFSO').bindItems('oModel2>/', new sap.ui.core.ListItem({
		// 			key: "{oModel2>ExteriorColorCode}",
		// 			text: "{parts: [{path:'oModel2>ExteriorColorCode'},{path:'oModel2>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
		// 		}));
		// 		var items_binding = CFSO_controller.getView().byId('color_CFSO').getBinding('items');
		// 		items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
		// 			new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
		// 			new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
		// 		], true));

		// 	}
		// },
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------
	});

});