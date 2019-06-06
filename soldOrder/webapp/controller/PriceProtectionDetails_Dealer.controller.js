sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var PPD_DealerCont;
	return BaseController.extend("toyota.ca.SoldOrder.controller.PriceProtectionDetails_Dealer", {
		formatter: formatter,

		onInit: function () {
			PPD_DealerCont = this;
			AppController.getDealer();
				var language = PPD_DealerCont.returnBrowserLanguage();
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if(language== "EN"){
			Obj = {
				"PriceProtectionStatus": [{
		"key": "1",
		"text": "OPEN"
	}, {
		"key": "2",
		"text": "IN PROGRESS"
	}, {
		"key": "3",
		"text": "PRE-APPROVED"
	}, {
		"key": "4",
		"text": "UNDER REVIEW"
	}, {
		"key": "5",
		"text": "APPROVED"
	}, {
		"key": "6",
		"text": "REJECTED"
	}]
			};}
			else{
				Obj = {
		"PriceProtectionStatus": [{
		"key": "1",
		"text": "OPEN"
	}, {
		"key": "2",
		"text": "IN PROGRESS"
	}, {
		"key": "3",
		"text": "PRE-APPROVED"
	}, {
		"key": "4",
		"text": "UNDER REVIEW"
	}, {
		"key": "5",
		"text": "APPROVED"
	}, {
		"key": "6",
		"text": "REJECTED"
	}],
			};
			

			}
			
				globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"),"globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));
			
			
			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			if(language== "EN"){
		Object = { "PriceProtection_OrderType": [{
		"key": "F1",
		"text": "DLR RAC"
	}, {
		"key": "F2",
		"text": "DLR ELITE"
	}, {
		"key": "F3",
		"text": "NAT RAC"
	},
	{
		"key": "F4",
		"text": "NAT ELITE"
	},{
		"key": "F5",
		"text": "MOBILITY"
	},
	{
		"key": "RETAIL SOLD",
		"text": "RETAIL SOLD"
	}
	],};
				
			}
			else{
				Object = { "PriceProtection_OrderType": [{
		"key": "F1",
		"text": "DLR RAC"
	}, {
		"key": "F2",
		"text": "DLR ELITE"
	}, {
		"key": "F3",
		"text": "NAT RAC"
	},
	{
		"key": "F4",
		"text": "NAT ELITE"
	},{
		"key": "F5",
		"text": "MOBILITY"
	},
	{
		"key": "RETAIL SOLD",
		"text": "RETAIL SOLD"
	}
	
	],};
			

			}
			
			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(sap.ui.getCore().getModel("OrderTypeModel"),"OrderTypeModel");
			console.log(sap.ui.getCore().getModel("OrderTypeModel"));
			PPD_DealerCont.getBrowserLanguage();
			PPD_DealerCont._handleServiceSuffix_Series();
			// var sLocation = window.location.host;
			// var sLocation_conf = sLocation.search("webide");
			// if (sLocation_conf == 0) {
			// 	PPD_DealerCont.sPrefix = "/soldorder_node";
			// } else {
			// 	PPD_DealerCont.sPrefix = "";
			// }
			// PPD_DealerCont.nodeJsUrl = PPD_DealerCont.sPrefix + "/node";

			// var Model = this.getOwnerComponent().getModel("mainService");
			// debugger;
			//PPD_DealerCont.getView().setModel("mainService");
			// $.ajax({
			// 	//	url:  PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing",//?$format=json",
			// 	url: PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/ZC_HEADER", //?$format=json",
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		console.log("Data from ZC_HEADER is as follows in next line");
			// 		console.log(data);
			// 		var oModel1 = new sap.ui.model.json.JSONModel(data.d.results);
			// 		PPD_DealerCont.getView().setModel(oModel1, "modelDealerDrpDwn");
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
			// $.ajax({
			// 	//	url:  PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing",//?$format=json",
			// 	url: PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_item", //?$format=json",
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		console.log("Data from zc_item is as follows in next line");
			// 		console.log(data);
			// 		var oTable = PPD_DealerCont.getView().byId("table_PPD_Dealer");
			// 		var oModel = new sap.ui.model.json.JSONModel(data.d.results);
			// 		PPD_DealerCont.getView().setModel(oModel, "modelTbl_PPD_Dealer");
			// 		var mode = PPD_DealerCont.getView().getModel("modelTbl_PPD_Dealer");
			// 		//	oTable.setModel(mode);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
			// $.ajax({
			// 	url: PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing", //?$format=json",
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		console.log("Data from zc_campaign_pricing is as follows in next line");
			// 		console.log(data);
			// 		var oModel1 = new sap.ui.model.json.JSONModel(data.d.results);
			// 		PPD_DealerCont.getView().setModel(oModel1, "model_campaign_pricing");
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
			this.getOwnerComponent().getRouter().getRoute("PriceProtectionDetails_Dealer").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Emphasized');
		},

		onAfterRendering: function () {
			
			var mcb_status_PPD_D = PPD_DealerCont.getView().byId("mcb_status_PPD_D");
			var mcb_ordTyp_PPD_D = PPD_DealerCont.getView().byId("mcb_ordTyp_PPD_D");
			var mcb_dealer_PPD_D = PPD_DealerCont.getView().byId("mcb_dealer_PPD_D");
			mcb_status_PPD_D.setSelectedItems(mcb_status_PPD_D.getItems());
			mcb_dealer_PPD_D.setSelectedItems(mcb_dealer_PPD_D.getItems());
			mcb_ordTyp_PPD_D.setSelectedItems(mcb_ordTyp_PPD_D.getItems());
			
			PPD_DealerCont._refresh();
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			// var dfilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
			// 	dfilter.push(new Filter("dealer_code", FilterOperator.EQ, this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey()));
			// }
			// if (dfilter.length > 0) {
			// 	var filter_dealers = new Filter(dfilter, false);
			// 	//---------------------------------------------------------------
			// 	var items = this.getView().byId("table_PPD_Dealer").getBinding('rows');
			// 	items.filter(filter_dealers);
			// }
			
		},

		_refresh: function () {
			var allfilter = [];
			var items = PPD_DealerCont.getView().byId("table_PPD_Dealer").getBinding("rows");

			var statFilter = [];

			for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
				statFilter.push(new Filter("status", FilterOperator.EQ, this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getText()));
			}
			if (statFilter.length > 0) {
				var filter_sstatus = new Filter(statFilter, false);
				allfilter.push(filter_sstatus);
			}
			
				var ordFilter = [];

			for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
				ordFilter.push(new Filter("zzordtypedesc", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText()));
			}
			if (ordFilter.length > 0) {
				var filter_ord = new Filter(ordFilter, false);
				allfilter.push(filter_ord);
			}
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var dfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
				dfilter.push(new Filter("dealer_code", FilterOperator.EQ, this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey()));
			}
			if (dfilter.length > 0) {
				var filter_dealers = new Filter(dfilter, false);
				allfilter.push(filter_dealers);
			}

			items.filter(new Filter([filter_sstatus, filter_ord, filter_dealers], true));

		},
		_navToRSO: function (evt) {
			// console.log(evt.getSource());
			// console.log(evt.getSource().mProperties);
			// console.log(evt.getSource().mProperties.text);
			// console.log(evt.getSource().getBindingContext());
			// console.log(evt.getSource().getBindingContext().getPath());
			// var sPath = evt.getSource().getBindingContext().sPath;
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// console.log(sPath);
			// var s = PPD_DealerCont.getView().byId("table_PPD_Dealer").getModel().getData().ProductCollection[oIndex].num;
			// console.log(s);

			// var n = s.indexOf("NAT");
			// if (n > -1) {
			// 	PPD_DealerCont.getRouter().navTo("NationalFleetSoldOrderView", {}, true); //page3
			// }
			// var n2 = s.indexOf("SO");
			// if (n2 > -1) {
			// 	PPD_DealerCont.getRouter().navTo("RSOView_ManageSoldOrder", {}, true); //page3
			// }

			var Flags = {
				openCommentBox: "X"
			};
			var oFlagsModel = new sap.ui.model.json.JSONModel(Flags); // created a JSON model       
			sap.ui.getCore().setModel(oFlagsModel, "ppdFlages");

			var selectedRow = evt.getSource().getBindingContext("mainservices").getObject();

			PPD_DealerCont.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);

			if (selectedRow.zzso_type == "SO") {
				// PPD_DealerCont.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				// 	Soreq: evt.getSource().getText()
				// }, true);

				// 	PPD_DealerCont.getOwnerComponent().getRouter().navTo("NationalFleetSoldOrderView", {
				// 	Soreq: evt.getSource().getText()
				// }, true);

			} else {
				// PPD_DealerCont.getOwnerComponent().getRouter().navTo("NationalFleetSoldOrderView", {
				// 	Soreq: evt.getSource().getText()
				// }, true);

				// 				PPD_DealerCont.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				// 	Soreq: evt.getSource().getText()
				// }, true);

			}

		},
		_handleServiceSuffix_Series: function () {
			var host = PPD_DealerCont.host();
			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					PPD_DealerCont.getView().setModel(oModel, "seriesModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

	});

});