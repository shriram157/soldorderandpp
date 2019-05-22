sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";
	var CFSO_controller;
	var _Table_Data2 = [],
		_Table_Data1 = [],
		_all_data = [];
	return BaseController.extend("toyota.ca.SoldOrder.controller.CreateFleetSoldOrder", {
		formatter: formatter,

		onInit: function () {
			CFSO_controller = this;
			CFSO_controller.getBrowserLanguage();
			var language = CFSO_controller.returnBrowserLanguage();
			var today = new Date();
			var day30 = new Date();
			//day30.setDate(today.getDate() + 30);
			
			CFSO_controller.getView().byId("etaFrom_CFSO").setMinDate(new Date());
			// CFSO_controller._newService1();
			// CFSO_controller._newService2();
			// CFSO_controller._newService3();
			// CFSO_controller._handleServiceSuffix_Series();
			// CFSO_controller._handleRSADropDown();
			this._alldata = new JSONModel({
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
			this.getView().setModel(this._alldata, 'Data');
			this._data = new JSONModel({
				items: _Table_Data2
			});
			this._data.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.getView().setModel(this._data, 'SecondTable');
			this._data2 = new JSONModel({
				items: _Table_Data1
			});
			this._data2.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.getView().setModel(this._data2, 'FirstTable');
			sap.ui.getCore().setModel(this._data2, 'FirstTable');
			this.getOwnerComponent().getRouter().getRoute("CreateFleetSoldOrder").attachPatternMatched(this._onObjectMatched, this);
		var seriesCB = CFSO_controller.getView().byId("series_CFSO");
			
						var host = CFSO_controller.host();
	var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
	var brand;
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					brand = "TOY";


				} else { // set the lexus logo
					brand = "LEX";

					// }
				}
			}
						var url = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
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
					var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_onObjectMatched: function (oEvent) {
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Emphasized');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Transparent');
		},
		//1) Model Code , Model Description :-    Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL ENModelDesc  Model: "BF38KT"

		//2) Suffix  and  Suffix Description : Z_VEHICLE_CATALOGUE_SRV/zc_configuration SuffixDescriptionEN, Suffix
		//     Interior Colour Description     :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  TrimInteriorColor    

		//3)Color Code , Colour Description :  :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  ExteriorColorCode: "0218"ExteriorDescriptionEN: "BLACK"
		_newService1: function () {
			var host = CFSO_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_configuration?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					// console.log("Result from zc_configuration");
					// console.log(data.d.results);
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
					//	CFSO_controller.getView().byId("model_RSOA").setSizeLimit(oModel.getData().length);
					CFSO_controller.getView().setModel(oModel, "oModel3");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
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
		onAfterRendering: function () {
			// CFSO_controller.listOfModelYear();
			// if (AppController.flagPPDUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagNationalSIPUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagNationalPPDUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagDealerUser == true) {

			// }
			// if (AppController.flagZoneUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagTCINationalUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagSIPUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagNationalUser == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
			// if (AppController.flagOrderingDealer == true) {
			// 	CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			// }
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
			var etaFrom = CFSO_controller.getView().byId("etaFrom_CFSO").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				CFSO_controller.getView().byId("etaTo_CFSO").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00009");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
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
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					oModel2.getData().items.splice(index, 1);
				}
				oModel2.refresh();
			}

		},
		_onDelete2: function () {
			var oTable = CFSO_controller.getView().byId("idCFSO_Table2");
			var oModel2 = oTable.getModel('SecondTable');
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					oModel2.getData().items.splice(index, 1);
				}
				oModel2.refresh();
			}
		},
		_onSubmit: function () {
			_all_data.splice(0, _all_data.length);
			var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			_Table_Data1 = this.getView().getModel('FirstTable').getData().items;
			for (var i = 0; i < _Table_Data1.length; i++) {
				_all_data.push({
					FleetSONo: 'FSO',
					FleetSOItem: i.toString(),
					Model: _Table_Data1[i].Model,
					Modelyear: _Table_Data1[i].Modelyear,
					Suffix: _Table_Data1[i].Suffix,
					ExteriorColourCode: _Table_Data1[i].ExteriorColorCode,
					APX: _Table_Data1[i].APX,
					ReqEtaFrom: zdateFormat.parse(_Table_Data1[i].ETAFrom),
					ReqEtaTo: zdateFormat.parse(_Table_Data1[i].ETATo),
					Zzvtn: _Table_Data1[i].ZZVTN
				});
			}
			var length = _Table_Data1.length;
			for (var i = 0; i < _Table_Data2.length; i++) {
				length = length + i;
				_all_data.push({
					FleetSONo: 'FSO',
					FleetSOItem: length.toString(),
					Model: _Table_Data2[i].model,
					Modelyear: _Table_Data2[i].modelYear,
					Suffix: _Table_Data2[i].suffix,
					ExteriorColourCode: _Table_Data2[i].colour,
					APX: _Table_Data2[i].APX,
					ReqEtaFrom: _Table_Data2[i].ETAFrom,
					ReqEtaTo: _Table_Data2[i].ETATime,
					FltSOQty: _Table_Data2[i].quantity
						// series: valSeries,
				});

			}
			this.getView().getModel('Data').getData().Zendcu = this.getView().getModel('Customer').getData().Partner;
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			this.getView().getModel('Data').getData().ZzdealerCode = dealer_no;
			this.getView().getModel('mainservices').create('/SO_FLEET_HeaderSet', this.getView().getModel('Data').getData(), {
				success: function (oData, oResponse) {
					if (oData.ZsoFltReqNo) {
						CFSO_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
							Soreq: oData.ZsoFltReqNo
						}, true);
					}

				},
				error: function (oData, oResponse) {

				}
			});
			// var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
			// var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue();
			// var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue();
			// var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue();

			// if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
			// 	var errForm = formatter.formatErrorType("SO00003");
			// 	var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			// 	sap.m.MessageBox.show(errMsg, sap
			// 		.m.MessageBox.Icon.ERROR, "Error", sap
			// 		.m.MessageBox.Action.OK, null, null);
			// }
			// // set status to "Requested"
			// var str = "abcdefghijk";
			// var res = str.substring(0, 5);
			// var seqNum = "79876875765";
			// var res2 = seqNum.substring(0, 7);
			// var dealerFleetNum = res.concat(res2);
			// console.log(dealerFleetNum);
		},
		_onAddRow2: function () {
			var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getSelectedKey();
			var valSeries = CFSO_controller.getView().byId("series_CFSO").getSelectedKey();
			var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getSelectedKey();
			var	colour = CFSO_controller.getView().byId("color_CFSO").getSelectedKey();
					var apx = CFSO_controller.getView().byId("Apx_CFSO").getSelectedKey();
					var etaFrom = CFSO_controller.getView().byId("etaFrom_CFSO").getDateValue();
					var etaTo = CFSO_controller.getView().byId("etaTo_CFSO").getDateValue();
					var quantity = CFSO_controller.getView().byId("quantity_CFSO").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "" || colour == "" || apx == "" || etaFrom == "" || etaTo == "" || quantity == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				_Table_Data2.push({
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
				this.getView().getModel('SecondTable').refresh();
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

			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("YearPopup", "toyota.ca.SoldOrder.view.fragments.YearPopup", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(Oevent.getSource());

		},
		handleSelectYearPress: function (Oevent) {
			this.getView().byId("modelYr_CFSO").setValue(this._oPopover.getContent()[0].getYear());
					var series = this.getView().byId('series_CFSO').getSelectedKey();
			var modelyear = this.getView().byId('modelYr_CFSO').getValue();
			
			if (series && modelyear) {
						var modelCB = this.getView().byId("modelCode_CFSO");
			var suffixCB = this.getView().byId("suffix_CFSO");
			var apxCB = this.getView().byId("Apx_CFSO");
			var colorCB = this.getView().byId("color_CFSO");
					modelCB.setSelectedKey(null);
			modelCB.destroyItems();
			suffixCB.setSelectedKey(null);
			suffixCB.destroyItems();
			apxCB.setSelectedKey(null);
			apxCB.destroyItems();
			colorCB.setSelectedKey(null);
			colorCB.destroyItems();
			var dealer = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
							new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ,'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: "{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
					})
				});
				// var items_binding = this.getView().byId('model_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
			this._oPopover.close();
		},
		initailyear: function (oEvent) {
			this._oPopover.getContent()[0].setDate(new Date());
		},
		onpreviousyears: function (oEvent) {
			this._oPopover.getContent()[0].previousPage();
		},
		onnextyears: function (oEvent) {
			this._oPopover.getContent()[0].nextPage();
		},
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------

		// // var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
		// // var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue();
		// // var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue();
		// // var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue();
		// series_selected: function (oEvent) {

		// 	// var year = this.getView().byId('modelYr_RSOA').getValue();
		// 	// items="{ path: 'oModel3>/'}"
		// 	var series = oEvent.getSource().getSelectedKey();
		// 	if (series) {
		// 		this.getView().byId("modelCode_CFSO").bindItems("oModel3>/", new sap.ui.core.ListItem({
		// 			key: "{oModel3>Model}",
		// 			text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
		// 		}));
		// 		var items_binding = this.getView().byId("modelCode_CFSO").getBinding('items');
		// 		items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
		// 	}
		// },
		// model_selected: function (oEvent) {
		// 	// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
		// 	var model = oEvent.getSource().getSelectedKey();
		// 	var modelyear = this.getView().byId("modelYr_CFSO").getValue();
		// 	if (model && modelyear) {
		// 		this.getView().byId('suffix_CFSO').bindItems('oModel1>/', new sap.ui.core.ListItem({
		// 			key: "{oModel1>Suffix}",
		// 			text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel1>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
		// 		}));
		// 		var items_binding = this.getView().byId('suffix_CFSO').getBinding('items');
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
		// 	var modelyear = this.getView().byId("modelYr_CFSO").getValue();
		// 	var model = this.getView().byId("modelCode_CFSO").getSelectedKey();
		// 	if (model && modelyear && suffix) {
		// 		// this.getView().byId('Apx_RSOA').bindItems('mode_Model>/', new sap.ui.core.ListItem({
		// 		// 	key: "{mode_Model>zzapx}",
		// 		// 	text: "{mode_Model>zzapx}"
		// 		// }));
		// 		// var items_binding = this.getView().byId('Apx_RSOA').getBinding('items');
		// 		// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
		// 		// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
		// 		// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
		// 		// ], true));
		// 		//-----------------
		// 		//----Color---------
		// 		//----------------
		// 		this.getView().byId('color_CFSO').bindItems('oModel2>/', new sap.ui.core.ListItem({
		// 			key: "{oModel2>ExteriorColorCode}",
		// 			text: "{parts: [{path:'oModel2>ExteriorColorCode'},{path:'oModel2>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
		// 		}));
		// 		var items_binding = this.getView().byId('color_CFSO').getBinding('items');
		// 		items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
		// 			new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
		// 			new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
		// 		], true));

		// 	}
		// },
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------
		series_selected: function (oEvent) {

			// var year = this.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"
	
			var series = this.getView().byId('series_CFSO').getSelectedKey();
			var modelyear = this.getView().byId('modelYr_CFSO').getValue();
			
			if (series && modelyear) {
						var modelCB = this.getView().byId("modelCode_CFSO");
			var suffixCB = this.getView().byId("suffix_CFSO");
			var apxCB = this.getView().byId("Apx_CFSO");
			var colorCB = this.getView().byId("color_CFSO");
					modelCB.setSelectedKey(null);
			modelCB.destroyItems();
			suffixCB.setSelectedKey(null);
			suffixCB.destroyItems();
			apxCB.setSelectedKey(null);
			apxCB.destroyItems();
			colorCB.setSelectedKey(null);
			colorCB.destroyItems();
			var dealer = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

				modelCB.bindItems({
					// path: "VechileModel>/zc_model",
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
							new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ,'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: "{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
					})
				});
				// var items_binding = this.getView().byId('model_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = oEvent.getSource().getSelectedKey();
			var modelyear = this.getView().byId('modelYr_CFSO').getValue();
			var language = CFSO_controller.returnBrowserLanguage();
			var suf;
				if (language === "FR") {
						suf = "{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			else
			{
							suf = "{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			if (model && modelyear) {
					// var modelCB = this.getView().byId("modelCode_CFSO");
			var suffixCB = this.getView().byId("suffix_CFSO");
			var apxCB = this.getView().byId("Apx_CFSO");
			var colorCB = this.getView().byId("color_CFSO");
			// 		modelCB.setSelectedKey(null);
			// modelCB.destroyItems();
			suffixCB.setSelectedKey(null);
			suffixCB.destroyItems();
			apxCB.setSelectedKey(null);
			apxCB.destroyItems();
			colorCB.setSelectedKey(null);
			colorCB.destroyItems();
				suffixCB.bindItems({
					path: 'mainservices>/ZVMS_CDS_SUFFIX',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						text: suf
					})
				});
				// var items_binding = this.getView().byId('Suffix_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
			}
		},
		suffix_selected: function (oEvent) {
			//-----------------
			//----APX---------
			//----------------
			//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
			var suffix = oEvent.getSource().getSelectedKey();
			var modelyear = this.getView().byId('modelYr_CFSO').getValue();
			var model = this.getView().byId('modelCode_CFSO').getSelectedKey();
			if (model && modelyear && suffix) {
					// var suffixCB = this.getView().byId("suffix_CFSO");
			var apxCB = this.getView().byId("Apx_CFSO");
			var colorCB = this.getView().byId("color_CFSO");
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
				// var items_binding = this.getView().byId('Apx_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
				//-----------------
				//----Color---------
				//----------------
					var color;
				var language = CFSO_controller.returnBrowserLanguage();
				if (language === "FR") 
					{
						color = "{VechileModel>ExteriorColorCode}/{VechileModel>MarktgIntDescFR}";
					}
					else
					{
				color = "{VechileModel>ExteriorColorCode}/{VechileModel>MarktgIntDescEN}";
					}
				colorCB.bindItems({
					path: 'VechileModel>/zc_exterior_trim',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>ExteriorColorCode}",
						text: color
					})
				});
				// var items_binding = this.getView().byId('Colour_RSOA').getBinding('items');
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
			if (!this._addNewFanPage) {
				this._addNewFanPage = sap.ui.xmlfragment('FanNo', "toyota.ca.SoldOrder.view.fragments.FanNo", this);
				this.getView().addDependent(this._addNewFanPage);
			}
			// this._addNewFanPage.setModel(this.getView().getModel());
			this._addNewFanPage.open();
		},
		onCloseDialogFan: function (Oevent) {
			var Fan = this.getView().byId("FanNo_CFSO");
			var key = Oevent.getParameter("selectedContexts")[0].getProperty('Partner');
			var text = Oevent.getParameter("selectedContexts")[0].getProperty('BuSort2');
			CFSO_controller.getView().getModel('mainservices').read("/Customer_infoSet('" + key + "')", {
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel(data.CustomerInfo);
					CFSO_controller.getView().setModel(oModel, "Customer");
					Fan.setValue(text);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
						sap
						.m.MessageBox.Action.OK, null, null);
				}
			});

		},
		handleSearchFan: function (oEvent) {

			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("BuSort2", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("NameOrg1", sap.ui.model.FilterOperator.Contains, searchString)
				], false);
			}
			oEvent.getSource().getBinding("items").filter(filters);

		},
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

	});

});