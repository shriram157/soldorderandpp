sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.PriceProtectionDetails_Dealer", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Dealer
		 */
		/*	$.ajax({
				url: this.nodeJsUrl + "/zc_campaign_pricing",
				var url2 ="http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv";
				var oDataModel = new sap.ui.model.odata.v2.ODataMode(url2,true);
					var oTable = sap.ui.getCore().byId("table_PPD_Dealer");
					oTable.setModel(oDataModel);
		});
				
		*/
		onInit: function () {
			
			
			          			     var sLocation = window.location.host;
									      var sLocation_conf = sLocation.search("webide");
									    
									      if (sLocation_conf == 0) {
									        this.sPrefix = "/soldorder_node";
									      } else {
									        this.sPrefix = "";
									     }
									      
									      this.nodeJsUrl = this.sPrefix + "/node";
			
			
			          var url = this.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing";

			
						// this.nodeJsUrl = "/node";
				//		var url ="http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv/zc_campaign_pricing";
						//"https://fioridev1.dev.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_MASTER_SRV/zc_vehicle_items";
						//"http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv/zc_campaign_pricing";
						jQuery.ajax({
							url: url,
							method: 'GET',
							async: false,
							dataType: 'json',
							success: function(data, textStatus, jqXHR) {
								console.log("table_PPD_Dealer service getting called");
								console.log(data);
								console.log(data.results);
								
								var oTable = sap.ui.getCore().byId("table_PPD_Dealer");
								var oModel = new sap.ui.model.json.JSONModel(data);
								oTable.setModel(oModel);
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(jqXHR );
								console.log(textStatus );
								console.log(errorThrown);
									console.log("table_PPD_Dealer ERROR in service");
								sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
									.m.MessageBox.Action.OK, null, null);
							}
						});	
			/*var url2 = "http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv";
			var oDataModel = new sap.ui.model.odata.v2.ODataModel(url2, true);
			var oTable = this.getView().byId("table_PPD_Dealer");
			oTable.setModel(oDataModel);*/
		},
		/*	var oModel = new sap.ui.model.odata.ODataModel(url, false);
				var oTable = sap.ui.getCore().byId("table_PPD_Dealer");
				oTable.setModel(oModel);*/

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