sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";
	var CFSO_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.CreateFleetSoldOrder", {
		formatter: formatter,

		onInit: function () {
			CFSO_controller = this;
			CFSO_controller.getBrowserLanguage();
			var today = new Date();
			var day30 = new Date();
			day30.setDate(today.getDate() + 30);
			CFSO_controller.getView().byId("etaFrom_CFSO").setMinDate(day30);
			// CFSO_controller._newService1();
			// CFSO_controller._newService2();
			// CFSO_controller._newService3();
			CFSO_controller._handleServiceSuffix_Series();
			// CFSO_controller._handleRSADropDown();
		},

		//1) Model Code , Model Description :-    Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL ENModelDesc  Model: "BF38KT"

		//2) Suffix  and  Suffix Description : Z_VEHICLE_CATALOGUE_SRV/zc_configuration SuffixDescriptionEN, Suffix
		//     Interior Colour Description     :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  TrimInteriorColor    

		//3)Color Code , Colour Description :  :Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim  ExteriorColorCode: "0218"ExteriorDescriptionEN: "BLACK"
		_newService1: function () {
			var host = CFSO_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_configuration?sap-client=200&$format=json";
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
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim?sap-client=200&$format=json";
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
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/zc_model?sap-client=200&$format=json";
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
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_PIO_DIO?sap-client=200&$format=json";
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
		_handleServiceSuffix_Series: function () {
			var host = CFSO_controller.host();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_MODEL_DETAILS?sap-client=200&$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

					// console.log("Result from ZC_MODEL_DETAILS ");
					// console.log(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();

					var arr = [];
					var j = 0;
					for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["TCISeries"], arr) < 0) {
								arr[j] = data.d.results[i]["TCISeries"];
								j++;

							}
						}
					}

					oModel.setData(arr);
					CFSO_controller.getView().setModel(oModel, "seriesModel");
					// console.log(CFSO_controller.getView().getModel("seriesModel").getData());

					var oModel2 = new sap.ui.model.json.JSONModel();

					var arr2 = [''];
					var k = 0;
					for (var q = 0; q < data.d.results.length; q++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["suffix"], arr2) < 0) {
								arr2[k] = data.d.results[i]["suffix"];
								k++;
							}
						}
					}
					// console.log(arr2);
					oModel2.setData(arr2);
					CFSO_controller.getView().setModel(oModel2, "suffix_Model");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		onAfterRendering: function () {
			// CFSO_controller.listOfModelYear();
			if (AppController.flagPPDUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagNationalSIPUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagNationalPPDUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagDealerUser == true) {

			}
			if (AppController.flagZoneUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagTCINationalUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagSIPUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagNationalUser == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
			if (AppController.flagOrderingDealer == true) {
				CFSO_controller.getView().byId("idCFSO_Table1").setSelectionMode("None");
			}
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
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().ProductCollection;
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					aRows.splice(index, 1);
					oTable.setSelectedIndex(-1);
				}
				oModel2.setData({
					ProductCollection: aRows
				});
				oTable.setModel(oModel2);
			}

		},
		_onDelete2: function () {
			var oTable = CFSO_controller.getView().byId("idCFSO_Table2");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().ProductCollection;
			var aContexts = oTable.getSelectedIndices();

			if (aContexts.length === 0) {
				var errForm = formatter.formatErrorType("SO00007");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			} else {
				for (var i = aContexts.length - 1; i >= 0; i--) {
					var index = aContexts[i];
					aRows.splice(index, 1);
					oTable.setSelectedIndex(-1);
				}
				oModel2.setData({
					ProductCollection: aRows
				});
				oTable.setModel(oModel2);
			}
		},
		_onSubmit: function () {
			var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue();
			var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue();
			var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			// set status to "Requested"
			var str = "abcdefghijk";
			var res = str.substring(0, 5);
			var seqNum = "79876875765";
			var res2 = seqNum.substring(0, 7);
			var dealerFleetNum = res.concat(res2);
			// console.log(dealerFleetNum);
		},
		_onAddRow: function () {
			var valModelYr = CFSO_controller.getView().byId("modelYr_CFSO").getValue();
			var valSuffix = CFSO_controller.getView().byId("suffix_CFSO").getValue().getSelectedKey();
			var valSeries = CFSO_controller.getView().byId("series_CFSO").getValue().getSelectedKey();
			var valModelCode = CFSO_controller.getView().byId("modelCode_CFSO").getValue().getSelectedKey();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valModelCode == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = CFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
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
			var series = oEvent.getSource().getSelectedKey();
			if (series) {
				this.getView().byId("modelCode_CFSO").bindItems({
					path: "VechileModel>/zc_model",
					filters: new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>Model}",
						text: "{parts: [{path:'VechileModel>Model'},{path:'VechileModel>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
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
			if (model && modelyear) {
				this.getView().byId('suffix_CFSO').bindItems({
					path: 'VechileModel>/zc_configuration',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{VechileModel>Suffix}",
						text: "{parts: [{path:'VechileModel>Suffix'},{path:'VechileModel>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
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
				// this.getView().byId('Apx_RSOA').bindItems({path:'VechileModel>/ZC_PIO_DIO',
				// filters:new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true),
				// template:new sap.ui.core.ListItem({
				// 	key: "{VechileModel>zzapx}",
				// 	text: "{VechileModel>zzapx}"
				// })});
				// var items_binding = this.getView().byId('Apx_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
				//-----------------
				//----Color---------
				//----------------
				this.getView().byId('color_CFSO').bindItems({path:'VechileModel>/zc_exterior_trim',
				filters:new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
					new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
					new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				], true),
				template:new sap.ui.core.ListItem({
					key: "{VechileModel>ExteriorColorCode}",
					text: "{parts: [{path:'VechileModel>ExteriorColorCode'},{path:'VechileModel>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
				})});
				// var items_binding = this.getView().byId('Colour_RSOA').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		}

	});

});