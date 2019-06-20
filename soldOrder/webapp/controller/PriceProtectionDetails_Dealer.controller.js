sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var PPD_DealerCont,clicks = 0, num = 0,pricepro=false;
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
		"key": "OPEN",
		"text": "OPEN"
	}, {
		"key": "IN PROGRESS",
		"text": "IN PROGRESS"
	}, {
		"key": "PRE-APPROVED",
		"text": "PRE-APPROVED"
	}, {
		"key": "UNDER REVIEW",
		"text": "UNDER REVIEW"
	}, {
		"key": "APPROVED",
		"text": "APPROVED"
	}, {
		"key": "REJECTED",
		"text": "REJECTED"
	}, {
		"key": "CLOSED",
		"text": "CLOSED"
	}]
			};}
			else{
				Obj = {
		"PriceProtectionStatus": [{
		"key": "OPEN",
		"text": "OPEN"
	}, {
		"key": "IN PROGRESS",
		"text": "IN PROGRESS"
	}, {
		"key": "PRE-APPROVED",
		"text": "PRE-APPROVED"
	}, {
		"key": "UNDER REVIEW",
		"text": "UNDER REVIEW"
	}, {
		"key": "APPROVED",
		"text": "APPROVED"
	}, {
		"key": "REJECTED",
		"text": "REJECTED"
	}, {
		"key": "CLOSED",
		"text": "CLOSED"
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
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
						var host = PPD_DealerCont.host();

				if (x != "TCI_User") {
			PPD_DealerCont._refresh();
				}
				else
				{
					
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") &$orderby=dealer_ord desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			// 	for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
			// var dealer = this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(dealer_code eq'" +dealer+"')";
			// if(i==((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") &$orderby=dealer_ord desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
					}
					else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
			   			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			
					
				}
					clicks=0;
			num=0;
			var page=clicks+1;
			PPD_DealerCont.getView().byId("txtPageNum").setText("Page "+page);
			 var BtnPrev = this.getView().byId("buttonPrev");
			   			 BtnPrev.setEnabled(false);	
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
			
			var host = PPD_DealerCont.host();
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(dealer_code eq'" +dealer+"')";
			if(i==((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") &$orderby=dealer_ord desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
					}
					else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
			   			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			}
			else
			{
				if(pricepro==true){
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				// for (var i = 0; i < this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
			oUrl=oUrl+"(dealer_code eq'" +dealer+"')";
			// if(i==((this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length)-1))
			// 	{
					oUrl= oUrl+"and &$orderby=dealer_ord desc) ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
				
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
					
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			}
			else
			{
				
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") &$orderby=dealer_ord desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			// 	// for (var i = 0; i < this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length; i++) {
			// var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
			// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
			// if(i==((this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length)-1))
			// 	{
					// oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
					
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			
			}
			}
			clicks=0;
			num=0;
			var page=clicks+1;
			PPD_DealerCont.getView().byId("txtPageNum").setText("Page "+page);
			 var BtnPrev = this.getView().byId("buttonPrev");
			   			 BtnPrev.setEnabled(false);	
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
		
// 			var allfilter = [];
// 			var items = PPD_DealerCont.getView().byId("table_PPD_Dealer").getBinding("rows");

// 			var statFilter = [];

// 			for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
// 				statFilter.push(new Filter("status", FilterOperator.EQ, this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getText()));
// 			}
// 			if (statFilter.length > 0) {
// 				var filter_sstatus = new Filter(statFilter, false);
// 				allfilter.push(filter_sstatus);
// 			}
			
// 				var ordFilter = [];

// 			for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
// 				ordFilter.push(new Filter("zzordtypedesc", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText()));
// 			}
// 			if (ordFilter.length > 0) {
// 				var filter_ord = new Filter(ordFilter, false);
// 				allfilter.push(filter_ord);
// 			}
// 			//=======================================================================================================
// 			//==================Start Binidng By Dealer=========================================================
// 			//=====================================================================================================
// 			var dfilter = [];
// 			for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
// 				dfilter.push(new Filter("dealer_code", FilterOperator.EQ, this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey()));
// 			}
// 			if (dfilter.length > 0) {
// 				var filter_dealers = new Filter(dfilter, false);
// 				allfilter.push(filter_dealers);
// 			}
// 				var oSorter = new sap.ui.model.Sorter({path:'dealer_ord', descending:true});

// 			items.filter(new Filter([filter_sstatus, filter_ord, filter_dealers], true));
// items.sort(oSorter);
		},
		_refreshCombo:function(evt)
		{
			pricepro=true;
			var host = PPD_DealerCont.host();
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				// for (var i = 0; i < this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
			oUrl=oUrl+"(dealer_code eq'" +dealer+"'))";
			// if(i==((this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length)-1))
			// 	{
					oUrl= oUrl+"&$orderby=dealer_ord desc ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
					
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
							clicks=0;
			num=0;
			var page=clicks+1;
			PPD_DealerCont.getView().byId("txtPageNum").setText("Page "+page);
			 var BtnPrev = this.getView().byId("buttonPrev");
			   			 BtnPrev.setEnabled(false);	
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

			var selectedRow = evt.getSource().getBindingContext("ppdModel").getObject();

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
onActionNext: function (oEvent) {
			//This code was generated by the layout editor.
			if(clicks < 0)
			{
			 clicks = 0;
			 clicks += 1;	     
			}
			else{		   
		     clicks += 1;
			}		 
			num = clicks * 10;
			
				// if(num === count1)
				// {
				//  var BtnNext = this.getView().byId("buttonNext");
				//  BtnNext.setEnabled(false);
				// }				
				if(num >= 10)
				{	
			   		    var BtnPrev = this.getView().byId("buttonPrev");
			   			 BtnPrev.setEnabled(true);			   			
				}	
				PPD_DealerCont.data();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionPrevious: function (oEvent) {
			//This code was generated by the layout editor.
			clicks -= 1;
			if(clicks <= 0)
			{		
			  num = 0;
			}
			else{	       		
			 num = clicks * 10;   
			}   
   //			if(num < count1)
			// {		  
			//  var BtnNext = this.getView().byId("buttonNext");
			//  BtnNext.setEnabled(true);
			// }
   			if(num === 0)
   			{
   		     var Btn = this.getView().byId("buttonPrev");
   			 Btn.setEnabled(false);
   			}   
   			PPD_DealerCont.data();
		},
		data:function (oEvent){
			
			var host = PPD_DealerCont.host();
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip="+num+"&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(dealer_code eq'" +dealer+"')";
			if(i==((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") &$orderby=dealer_ord desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
					}
					else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
			   			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			}
			else
			{
				if(pricepro==false)
				{
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip="+num+"&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") &$orderby=dealer_ord desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
				$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
					
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
				}
				else
				{
					
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip="+num+"&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(status eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			oUrl=oUrl+"(zzordtypedesc eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				// for (var i = 0; i < this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
			oUrl=oUrl+"(dealer_code eq'" +dealer+"')";
			// if(i==((this.getView().byId("cb_dealer_PPD_D").getSelectedItems().length)-1))
			// 	{
					oUrl= oUrl+"and &$orderby=dealer_ord desc) ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
					
						
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}else{
						 var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					PPD_DealerCont.getView().setModel(oModel, "ppdModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			}
				}
			// 	for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zzseries eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_series_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
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
		
			
			// clicks=0;
			// num=0;
			var page=clicks+1;
			PPD_DealerCont.getView().byId("txtPageNum").setText("Page "+page);
			 //var BtnPrev = this.getView().byId("buttonPrev");
			 //  			 BtnPrev.setEnabled(false);	
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
		
// 			var allfilter = [];
// 			var items = PPD_DealerCont.getView().byId("table_PPD_Dealer").getBinding("rows");

// 			var statFilter = [];

// 			for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
// 				statFilter.push(new Filter("status", FilterOperator.EQ, this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getText()));
// 			}
// 			if (statFilter.length > 0) {
// 				var filter_sstatus = new Filter(statFilter, false);
// 				allfilter.push(filter_sstatus);
// 			}
			
// 				var ordFilter = [];

// 			for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
// 				ordFilter.push(new Filter("zzordtypedesc", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText()));
// 			}
// 			if (ordFilter.length > 0) {
// 				var filter_ord = new Filter(ordFilter, false);
// 				allfilter.push(filter_ord);
// 			}
// 			//=======================================================================================================
// 			//==================Start Binidng By Dealer=========================================================
// 			//=====================================================================================================
// 			var dfilter = [];
// 			for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
// 				dfilter.push(new Filter("dealer_code", FilterOperator.EQ, this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey()));
// 			}
// 			if (dfilter.length > 0) {
// 				var filter_dealers = new Filter(dfilter, false);
// 				allfilter.push(filter_dealers);
// 			}
// 				var oSorter = new sap.ui.model.Sorter({path:'dealer_ord', descending:true});

// 			items.filter(new Filter([filter_sstatus, filter_ord, filter_dealers], true));
// items.sort(oSorter);
		},
	});

});