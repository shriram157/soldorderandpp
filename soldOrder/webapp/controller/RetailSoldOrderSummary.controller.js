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
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderSummary", {
		formatter: formatter,
		onInit: function () {

			// 	var oTbl = RSOS_controller.getView().byId("table_RSOS");
			// //-----------------------------------------------------------
			// //-----Binding without Fleet Reference----------------------
			// //----------------------------------------------------------
			// var items = oTbl.getBinding('rows');
			// items.filter([new Filter("FleetReference", FilterOperator.EQ, '')]);
			//-------------------------------------------------------------------------------
			// var data = oTbl.getModel().getData().ProductCollection;
			//this.getOwnerComponent().getRouter().getRoute("RetailSoldOrderSummary").attachRoutePatternMatched(this._onObjectMatched, this); // 	var host = RSOS_controller.host();
			//this.getOwnerComponent().getRouter().getRoute("RetailSoldOrderSummary").attachPatternMatched(this._onObjectMatched, this);
			this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onObjectMatched, this);

			// var url = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
			// 	"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			// //	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			// $.ajax({
			// 	url: url,
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		if (seriesCB.getValue() !== "") {
			// 			//seriesCB.setValue(" ");
			// 			seriesCB.setSelectedKey(null);
			// 		}
			// 		//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data.d.results);
			// 		RSOA_controller.getView().setModel(oModel, "seriesModel");
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		var errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
			// 		sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("error"), sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
		},
		_onObjectMatched: function (oEvent) {
			RSOS_controller = this;
			RSOS_controller.getBrowserLanguage();
			AppController.getDealer();
			RSOS_controller._handleServiceSuffix_Series();
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);
			var language = RSOS_controller.returnBrowserLanguage();

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
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"), "globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));
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
			var host = RSOS_controller.host();
			// var page = 0;
			// page = clicks + 1;
			// RSOS_controller.getView().byId("txtPageNum").setText("Page" + page);
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
			}

			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				// var dfilter = [];
				// for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
				// 	dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey()));
				// }
				// // if (dfilter.length > 0) {
				// 	var filter_dealers = new Filter(dfilter, false);
				// 	//---------------------------------------------------------------
				// 	var items1 = this.getView().byId("table_RSOS").getBinding('rows');
				// 	items1.filter(filter_dealers);
				RSOS_controller._refresh();

			} else {

				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
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
				// 	for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
				// var dealer = this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
				// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
				// if(i==((this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length)-1))
				// 	{
				// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
				// 	}
				// 	else
				// 	{
				// 		oUrl= oUrl+" or ";
				// 	}
				// }
				sap.ui.core.BusyIndicator.show();
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						sap.ui.core.BusyIndicator.hide();
						var BtnNext = RSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						if (DataModel.getData().length != undefined) {
							// if (DataModel.getData().length < 10) {
							// 	BtnNext.setEnabled(false);
							// } else {
							// 	BtnNext.setEnabled(true);
							// }
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
						// // if (data.d.results.length == undefined) {

						// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// // 	BtnNext.setEnabled(false);
						// // } else 
						// if (data.d.results.length < 10) {
						// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
						// } else {
						// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(true);
						// }
						// // 	// if (oModel.length > 0) {
						// // 	//oModel.getData().ZC_SERIES.unshift({
						// // 	//  "{seriesModel>ModelSeriesNo}": "All",
						// // 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
						// // 	//})
						// // 	// }
						// // 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
						// // }
						// RSOS_controller.getView().setModel(oModel, "retailsumModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.ui.core.BusyIndicator.hide();
						var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
							"error"), sap.m.MessageBox.Action.OK, null, null);

					}
				});

			}

		},
		onAfterRendering: function () {

		},
		_handleServiceSuffix_Series: function () {
			var host = RSOS_controller.host();
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
			sap.ui.core.BusyIndicator.show();
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X' and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					sap.ui.core.BusyIndicator.hide();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					RSOS_controller.getView().setModel(oModel, "seriesModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
					var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
						"error"), sap.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_refreshCombo: function (evt) {
			var host = RSOS_controller.host();
			filter = true;
			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
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
			// if(i==((this.getView().byId("cb_dealer_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			sap.ui.core.BusyIndicator.show();
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					sap.ui.core.BusyIndicator.hide();
					var BtnNext = RSOS_controller.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = RSOS_controller.getView().getModel("retailsumModel");
					if (DataModel.getData().length != undefined) {
						// if (DataModel.getData().length < 10) {
						// 	BtnNext.setEnabled(false);
						// } else {
						// 	BtnNext.setEnabled(true);
						// }
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
					// // if (data.d.results.length == undefined) {

					// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
					// // 	BtnNext.setEnabled(false);
					// // } else 
					// if (data.d.results.length < 10) {
					// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
					// 	BtnNext.setEnabled(false);
					// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
					// } else {
					// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
					// 	BtnNext.setEnabled(true);
					// }
					// // 	// if (oModel.length > 0) {
					// // 	//oModel.getData().ZC_SERIES.unshift({
					// // 	//  "{seriesModel>ModelSeriesNo}": "All",
					// // 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					// // 	//})
					// // 	// }
					// // 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
					// // }
					// RSOS_controller.getView().setModel(oModel, "retailsumModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
					var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
						"error"), sap.m.MessageBox.Action.OK, null, null);

				}
			});
			// clicks = 0;
			// num = 0;
			// var page = clicks + 1;
			// RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);

		},
		_refresh: function (oEvent) {
			var host = RSOS_controller.host();
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
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
				sap.ui.core.BusyIndicator.show();
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						sap.ui.core.BusyIndicator.hide();
						var BtnNext = RSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						if (DataModel.getData().length != undefined) {
							// if (DataModel.getData().length < 10) {
							// 	BtnNext.setEnabled(false);
							// } else {
							// 	BtnNext.setEnabled(true);
							// }
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
						// var BtnNext = RSOS_controller.getView().byId("buttonNext");

						// var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						// if (DataModel.getData().length != undefined) {
						// 	if (DataModel.getData().length < 10) {
						// 		BtnNext.setEnabled(false);
						// 	} else {
						// 		BtnNext.setEnabled(true);
						// 	}
						// 	for (var m = 0; m < DataModel.getData().length - 1; m++) {
						// 		DataModel.getData().push(data.d.results[m]);
						// 	}
						// 	DataModel.updateBindings(true);
						// } else {
						// 	if (data.d.results.length < 10) {
						// 		BtnNext.setEnabled(false);
						// 	} else {
						// 		BtnNext.setEnabled(true);
						// 	}
						// 	DataModel.setData(data.d.results);
						// 	DataModel.updateBindings(true);
						// }
						// var oModel = new sap.ui.model.json.JSONModel();

						// oModel.setData(data.d.results);
						// // if (data.d.results.length == undefined) {

						// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// // 	BtnNext.setEnabled(false);
						// // } else 
						// if (data.d.results.length < 10) {
						// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
						// } else {
						// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(true);
						// }
						// // 	// if (oModel.length > 0) {
						// // 	//oModel.getData().ZC_SERIES.unshift({
						// // 	//  "{seriesModel>ModelSeriesNo}": "All",
						// // 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
						// // 	//})
						// // 	// }
						// // 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
						// // }
						// RSOS_controller.getView().setModel(oModel, "retailsumModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.ui.core.BusyIndicator.hide();
						var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
							"error"), sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (filter == false) {
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
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
					// for (var i = 0; i < this.getView().byId("cb_dealer_RSOS").getSelectedItems().length; i++) {
					// var dealer = this.getView().byId("cb_dealer_RSOS").getSelectedKey();
					// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')) and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
					// if(i==((this.getView().byId("cb_dealer_RSOS").getSelectedItems().length)-1))
					// 	{
					// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
					// 	}
					// 	else
					// 	{
					// 		oUrl= oUrl+" or ";
					// 	}
					// }
					sap.ui.core.BusyIndicator.show();
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							sap.ui.core.BusyIndicator.hide();
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								// if (DataModel.getData().length < 10) {
								// 	BtnNext.setEnabled(false);
								// } else {
								// 	BtnNext.setEnabled(true);
								// }
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var BtnNext = RSOS_controller.getView().byId("buttonNext");

							// var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							// if (DataModel.getData().length != undefined) {
							// 	if (DataModel.getData().length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	for (var m = 0; m < DataModel.getData().length - 1; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 	}
							// 	DataModel.updateBindings(true);
							// } else {
							// 	if (data.d.results.length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	DataModel.setData(data.d.results);
							// 	DataModel.updateBindings(true);
							// }

							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// // if (data.d.results.length == undefined) {

							// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// // 	BtnNext.setEnabled(false);
							// // } else 
							// if (data.d.results.length < 10) {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// } else {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// }
							// // 	// if (oModel.length > 0) {
							// // 	//oModel.getData().ZC_SERIES.unshift({
							// // 	//  "{seriesModel>ModelSeriesNo}": "All",
							// // 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
							// // 	//})
							// // 	// }
							// // 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// // }
							// RSOS_controller.getView().setModel(oModel, "retailsumModel");
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=0&$filter=(";
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
					// if(i==((this.getView().byId("cb_dealer_RSOS").getSelectedItems().length)-1))
					// 	{
					// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
					// 	}
					// 	else
					// 	{
					// 		oUrl= oUrl+" or ";
					// 	}
					// }
					sap.ui.core.BusyIndicator.show();
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							sap.ui.core.BusyIndicator.hide();
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								// if (DataModel.getData().length < 10) {
								// 	BtnNext.setEnabled(false);
								// } else {
								// 	BtnNext.setEnabled(true);
								// }
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var BtnNext = RSOS_controller.getView().byId("buttonNext");

							// var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							// if (DataModel.getData().length != undefined) {
							// 	if (DataModel.getData().length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	for (var m = 0; m < DataModel.getData().length - 1; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 	}
							// 	DataModel.updateBindings(true);
							// } else {
							// 	if (data.d.results.length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	DataModel.setData(data.d.results);
							// 	DataModel.updateBindings(true);
							// }

							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// // if (data.d.results.length == undefined) {

							// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// // 	BtnNext.setEnabled(false);
							// // } else 
							// if (data.d.results.length < 10) {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// } else {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// }
							// // 	// if (oModel.length > 0) {
							// // 	//oModel.getData().ZC_SERIES.unshift({
							// // 	//  "{seriesModel>ModelSeriesNo}": "All",
							// // 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
							// // 	//})
							// // 	// }
							// // 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// // }
							// RSOS_controller.getView().setModel(oModel, "retailsumModel");
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);

						}
					});

				}
			}
			// clicks = 0;
			// num = 0;
			// var page = clicks + 1;
			// RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			// var BtnPrev = this.getView().byId("buttonPrev");
			// BtnPrev.setEnabled(false);
			// var allfilter = [];
			// //-----------------Sold Order Status-----------------
			// var afilter = [];
			// // var status_all = false;
			// // 	var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
			// // var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
			// // for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
			// // 	if(this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey()==="ALL")
			// // 	{
			// // 			mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
			// // 			status_all = true;
			// // 			break;
			// // 	}
			// // }
			// // if(status_all ==false)
			// // {
			// // 			mcb_rsStatus_RSOS.setSelectedItems(null);
			// // }
			// for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
			// 	afilter.push(new Filter("ZzsoStatus", FilterOperator.EQ, this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey()));
			// }
			// if (afilter.length > 0) {
			// 	var filter_sstatus = new Filter(afilter, false);
			// 	allfilter.push(filter_sstatus);
			// }
			// //-----------------Audit Status-----------------
			// var asfilter = [];
			// // var audit_all =false;
			// // 	for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
			// // 		if(this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey()==="ALL")
			// // 	{
			// // 			mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			// // 			audit_all = true;
			// // 			break;		
			// // 	}
			// // }
			// // if(audit_all == false)
			// // {
			// // 	mcb_auditStatus_RSOS.setSelectedItems(null);
			// // }
			// for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
			// 	// 	if(this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey()==="ALL")
			// 	// {
			// 	// 		mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			// 	// 		break;		
			// 	// }
			// 	asfilter.push(new Filter("ZzAuditStatus", FilterOperator.EQ, this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey()));
			// }
			// if (asfilter.length > 0) {
			// 	var filter_asstatus = new Filter(asfilter, false);
			// 	allfilter.push(filter_asstatus);
			// }
			// //---------------------------------------------------------------
			// //-----------------Series-----------------
			// var Sfilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// 	Sfilter.push(new Filter("Zzseries", FilterOperator.EQ, this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey()));
			// }
			// if (Sfilter.length > 0) {
			// 	var filter_series = new Filter(Sfilter, false);
			// 	allfilter.push(filter_series);
			// }
			// //---------------------------------------------------------------
			// //-----------------Dealers-----------------
			// var dfilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
			// 	dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey()));
			// }
			// if (dfilter.length > 0) {
			// 	var filter_dealers = new Filter(dfilter, false);
			// 	allfilter.push(filter_dealers);
			// }
			// //---------------------------------------------------------------
			// var oSorter = new sap.ui.model.Sorter({
			// 	path: "ZzsoReqNo",
			// 	descending: true
			// });
			// var filter_all = new Filter([
			// 	filter_sstatus,
			// 	filter_asstatus,
			// 	filter_series,
			// 	filter_dealers,
			// 	new Filter("FleetReference", FilterOperator.EQ, "")
			// ], true);
			// var items = this.getView().byId("table_RSOS").getBinding("rows");
			// items.filter(filter_all);
			// items.sort(oSorter);
		},
		_dispalySoldOrderDetails: function (evt) {
			// var oTable = RSOS_controller.getView().byId("table_RSOS");
			// var sPath = evt.getSource().getBindingContext().sPath;
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// var model = oTable.getModel();
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
			sap.ui.core.BusyIndicator.show();
			var vinVal = RSOS_controller.byId("idFrag_RSOS--VinIdFrag").getValue();
			var vtinVal = RSOS_controller.byId("idFrag_RSOS--VtinIdFrag").getValue();
			var V_No;
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
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
						if (oData.Type == "E") {
							var oBundle = RSOS_controller.getView().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000013", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);
						} else {
							var oBundle = RSOS_controller.getView().getModel("i18n").getResourceBundle();
							var sMsg = oBundle.getText("SO000014", [zrequest]);
							sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap.m.MessageBox.Action.OK, null, null);
							var oTbl = RSOS_controller.getView().byId("tbl_FSOD");
							var items = oTbl.getBinding("rows");
							items.refresh();
						}
					},
					error: function (oError) {sap.ui.core.BusyIndicator.hide();}
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
			// if (num >= 10) {
			// 	var BtnPrev = this.getView().byId("buttonPrev");
			// 	BtnPrev.setEnabled(true);
			// }
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
			var host = RSOS_controller.host();
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=" + num + "&$filter=(";
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
				sap.ui.core.BusyIndicator.show();
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						sap.ui.core.BusyIndicator.hide();
						var BtnNext = RSOS_controller.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						if (DataModel.getData().length != undefined) {
							// if (DataModel.getData().length < 10) {
							// 	BtnNext.setEnabled(false);
							// } else {
							// 	BtnNext.setEnabled(true);
							// }
							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
						// var BtnNext = RSOS_controller.getView().byId("buttonNext");

						// var DataModel = RSOS_controller.getView().getModel("retailsumModel");
						// if (DataModel.getData().length != undefined) {
						// 	if (DataModel.getData().length < 10) {
						// 		BtnNext.setEnabled(false);
						// 	} else {
						// 		BtnNext.setEnabled(true);
						// 	}
						// 	for (var m = 0; m < DataModel.getData().length - 1; m++) {
						// 		DataModel.getData().push(data.d.results[m]);
						// 	}
						// 	DataModel.updateBindings(true);
						// } else {
						// 	if (data.d.results.length < 10) {
						// 		BtnNext.setEnabled(false);
						// 	} else {
						// 		BtnNext.setEnabled(true);
						// 	}
						// 	DataModel.setData(data.d.results);
						// 	DataModel.updateBindings(true);
						// }

						// if (oModel.length > 0) {
						//oModel.getData().ZC_SERIES.unshift({
						//  "{seriesModel>ModelSeriesNo}": "All",
						//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
						//})
						// if (data.d.results.length == undefined || data.d.results.length == 0) {

						// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
						// 	BtnNext.setEnabled(false);
						// } else 

						// var page = clicks + 1;
						// RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
						sap.ui.core.BusyIndicator.hide();

					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.ui.core.BusyIndicator.hide();
						// var page = clicks + 1;
						// RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
						var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
							"error"), sap.m.MessageBox.Action.OK, null, null);
					}
				});
			} else {
				if (filter == false) {
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=" + num + "&$filter=(";
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
					// 	for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
					// var dealer = this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
					// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
					// if(i==((this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length)-1))
					// 	{
					// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
					// 	}
					// 	else
					// 	{
					// 		oUrl= oUrl+" or ";
					// 	}
					// }
					sap.ui.core.BusyIndicator.show();
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							sap.ui.core.BusyIndicator.hide();
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								// if (DataModel.getData().length < 10) {
								// 	BtnNext.setEnabled(false);
								// } else {
								// 	BtnNext.setEnabled(true);
								// }
								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var BtnNext = RSOS_controller.getView().byId("buttonNext");

							// var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							// if (DataModel.getData().length != undefined) {
							// 	if (DataModel.getData().length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	for (var m = 0; m < DataModel.getData().length - 1; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 	}
							// 	DataModel.updateBindings(true);
							// } else {
							// 	if (data.d.results.length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	DataModel.setData(data.d.results);
							// 	DataModel.updateBindings(true);
							// }
							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// // if (data.d.results.length == undefined || data.d.results.length == 0) {

							// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// // 	BtnNext.setEnabled(false);
							// // } else 
							// if (data.d.results.length < 10) {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// } else {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// }
							// 	// if (oModel.length > 0) {
							// 	//oModel.getData().ZC_SERIES.unshift({
							// 	//  "{seriesModel>ModelSeriesNo}": "All",
							// 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
							// 	//})
							// 	// }
							// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// }
							// RSOS_controller.getView().setModel(oModel, "retailsumModel");
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=50&$skip=" + num + "&$filter=(";
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
					// if(i==((this.getView().byId("cb_dealer_RSOS").getSelectedItems().length)-1))
					// 	{
					// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
					// 	}
					// 	else
					// 	{
					// 		oUrl= oUrl+" or ";
					// 	}
					// }
					sap.ui.core.BusyIndicator.show();
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							sap.ui.core.BusyIndicator.hide();
							var BtnNext = RSOS_controller.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							if (DataModel.getData().length != undefined) {
								// if (DataModel.getData().length < 10) {
								// 	BtnNext.setEnabled(false);
								// } else {
								// 	BtnNext.setEnabled(true);
								// }
								for (var m = 0; m <data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
							// var BtnNext = RSOS_controller.getView().byId("buttonNext");

							// var DataModel = RSOS_controller.getView().getModel("retailsumModel");
							// if (DataModel.getData().length != undefined) {
							// 	if (DataModel.getData().length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	for (var m = 0; m < DataModel.getData().length - 1; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 	}
							// 	DataModel.updateBindings(true);
							// } else {
							// 	if (data.d.results.length < 10) {
							// 		BtnNext.setEnabled(false);
							// 	} else {
							// 		BtnNext.setEnabled(true);
							// 	}
							// 	DataModel.setData(data.d.results);
							// 	DataModel.updateBindings(true);
							// }

							// var oModel = new sap.ui.model.json.JSONModel();

							// oModel.setData(data.d.results);
							// // if (data.d.results.length == undefined) {

							// // 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// // 	BtnNext.setEnabled(false);
							// // } else 
							// if (data.d.results.length < 10) {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(false);
							// 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// } else {
							// 	var BtnNext = RSOS_controller.getView().byId("buttonNext");
							// 	BtnNext.setEnabled(true);
							// }
							// // 	// if (oModel.length > 0) {
							// // 	//oModel.getData().ZC_SERIES.unshift({
							// // 	//  "{seriesModel>ModelSeriesNo}": "All",
							// // 	//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
							// // 	//})
							// // 	// }
							// // 	RSOS_controller.getView().setModel(oModel, "retailsumModel");
							// // }
							// RSOS_controller.getView().setModel(oModel, "retailsumModel");
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.ui.core.BusyIndicator.hide();
							var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(
								"error"), sap.m.MessageBox.Action.OK, null, null);

						}
					});

				}
				var page = clicks + 1;
				RSOS_controller.getView().byId("txtPageNum").setText("Page " + page);
			}
		},
		onLiveChange: function (oEvent) {
			this.sSearchQuery = oEvent.getSource()
				.getValue();
			this.fnApplyFiltersAndOrdering();
		},
		fnApplyFiltersAndOrdering: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			// aSorters.push(new Sorter("dealerId1", this.bDescending));

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