sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var PPD_DealerCont;
	return BaseController.extend("toyota.ca.SoldOrder.controller.PriceProtectionDetails_Dealer", {
		formatter: formatter,
	
		/*	$.ajax({
				url: this.nodeJsUrl + "/zc_campaign_pricing",
				var url2 ="http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv";
				var oDataModel = new sap.ui.model.odata.v2.ODataMode(url2,true);
					var oTable = sap.ui.getCore().byId("table_PPD_Dealer");
					oTable.setModel(oDataModel);
		});	*/
		
		onInit: function () {
			PPD_DealerCont = this;
			this.getBrowserLanguage();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			$.ajax({
				url: this.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing",//?sap-client=200&$format=json",
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oTable = PPD_DealerCont.getView().byId("table_PPD_Dealer");
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					oTable.setModel(oModel);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});

		},
		onAfterRendering:function(){
		
			var mcb_status_PPD_D= PPD_DealerCont.getView().byId("mcb_status_PPD_D");
		
			var mcb_ordTyp_PPD_D = PPD_DealerCont.getView().byId("mcb_ordTyp_PPD_D");
		
			var mcb_dealer_PPD_D = PPD_DealerCont.getView().byId("mcb_dealer_PPD_D");

		
			mcb_status_PPD_D.setSelectedItems(mcb_status_PPD_D.getItems());
		
			mcb_dealer_PPD_D.setSelectedItems(mcb_dealer_PPD_D.getItems());
			mcb_ordTyp_PPD_D.setSelectedItems(mcb_ordTyp_PPD_D.getItems());
			
		},
		_refresh: function () {

		},
		_navToRSO: function (evt) {
				var sPath = evt.getSource().getBindingContext().sPath;
				var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
				console.log(sPath);
				var s = this.getView().byId("table_PPD_Dealer").getModel().getData().ProductCollection[oIndex].num;
				console.log(s);

				var n = s.indexOf("NAT");
				if (n > -1) {
					this.getRouter().navTo("NationalFleetSoldOrderView", {}, true); //page3
				}
				var n2 = s.indexOf("SO");
				if (n2 > -1) {
					this.getRouter().navTo("RSOView_ManageSoldOrder", {}, true); //page3
				}
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Dealer
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Dealer
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Dealer
		 */
		//	onExit: function() {
		//
		//	}

	});

});