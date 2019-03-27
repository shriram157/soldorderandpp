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
			// 	//	url:  PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing",//?sap-client=200&$format=json",
			// 	url: PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/ZC_HEADER", //?sap-client=200&$format=json",
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
			// 	//	url:  PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing",//?sap-client=200&$format=json",
			// 	url: PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_item", //?sap-client=200&$format=json",
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
			// 	url: PPD_DealerCont.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing", //?sap-client=200&$format=json",
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
		},

		onAfterRendering: function () {
			var mcb_status_PPD_D = PPD_DealerCont.getView().byId("mcb_status_PPD_D");
			var mcb_ordTyp_PPD_D = PPD_DealerCont.getView().byId("mcb_ordTyp_PPD_D");
			var mcb_dealer_PPD_D = PPD_DealerCont.getView().byId("mcb_dealer_PPD_D");
			mcb_status_PPD_D.setSelectedItems(mcb_status_PPD_D.getItems());
			mcb_dealer_PPD_D.setSelectedItems(mcb_dealer_PPD_D.getItems());
			mcb_ordTyp_PPD_D.setSelectedItems(mcb_ordTyp_PPD_D.getItems());
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var dfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
				dfilter.push(new Filter("dealer_code", FilterOperator.EQ, this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey()));
			}
			if (dfilter.length > 0) {
				var filter_dealers = new Filter(dfilter, false);
				//---------------------------------------------------------------
				var items = this.getView().byId("table_PPD_Dealer").getBinding('rows');
				items.filter(filter_dealers);
			}
		},

		_refresh: function () {
            var allfilter = [];
			var items = PPD_DealerCont.getView().byId("table_PPD_Dealer").getBinding("rows");

			var statFilter = [];

			for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
				statFilter.push(new Filter("status", FilterOperator.EQ, this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getText()));
			}
			if(statFilter.length > 0){
			var filter_sstatus = new Filter(statFilter, false);
			allfilter.push(filter_sstatus);
			}
           	//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var dfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
				dfilter.push(new Filter("dealer_code", FilterOperator.EQ, this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey()));
			}
			if(dfilter.length > 0){
			var filter_dealers = new Filter(dfilter, false);
			allfilter.push(filter_dealers);
			}
			
			items.filter(new Filter([filter_sstatus,filter_dealers],true));

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
			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?sap-client=200&$format=json";
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