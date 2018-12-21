sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var PPD_Zone_controller;

	return BaseController.extend("toyota.ca.SoldOrder.controller.PriceProtectionDetails_Zone_PPD", {
		formatter: formatter,

		onInit: function () {
			PPD_Zone_controller = this;
			PPD_Zone_controller.getBrowserLanguage();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				PPD_Zone_controller.sPrefix = "/soldorder_node";
			} else {
				PPD_Zone_controller.sPrefix = "";
			}
			PPD_Zone_controller.nodeJsUrl = PPD_Zone_controller.sPrefix + "/node";
			$.ajax({
				url: PPD_Zone_controller.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing", //?sap-client=200&$format=json",
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oTable = PPD_Zone_controller.getView().byId("table_PPD_ZoneDealer");
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					oTable.setModel(oModel);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});

		},
		onAfterRendering: function () {
			var mcb_status_PPD_Z = PPD_Zone_controller.getView().byId("mcb_status_PPD_Z");
			var mcb_series_PPD_Z = PPD_Zone_controller.getView().byId("mcb_series_PPD_Z");
			var mcb_ordTyp_PPD_Z = PPD_Zone_controller.getView().byId("mcb_ordTyp_PPD_Z");
			var mcb_dealer_PPD_Z = PPD_Zone_controller.getView().byId("mcb_dealer_PPD_Z");

			mcb_series_PPD_Z.setSelectedItems(mcb_series_PPD_Z.getItems());
			mcb_status_PPD_Z.setSelectedItems(mcb_status_PPD_Z.getItems());
			mcb_dealer_PPD_Z.setSelectedItems(mcb_dealer_PPD_Z.getItems());
			mcb_ordTyp_PPD_Z.setSelectedItems(mcb_ordTyp_PPD_Z.getItems());

			if (AppController.flagZoneUser == true) {
				PPD_Zone_controller.getView().byId("lbl_dealer_PPD_Z").setVisible(true);
				PPD_Zone_controller.getView().byId("mcb_dealer_PPD_Z").setVisible(true);
			}
			if (AppController.flagNationalUser == true) {
				PPD_Zone_controller.getView().byId("lbl_dealer_PPD_Z").setVisible(true);
				PPD_Zone_controller.getView().byId("mcb_dealer_PPD_Z").setVisible(true);
			}
		},

		_refresh: function () {

		},
		_navToRSO: function (evt) {
				var sPath = evt.getSource().getBindingContext().sPath;
				var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
				console.log(sPath);
				var s = PPD_Zone_controller.getView().byId("table_PPD_ZoneDealer").getModel().getData().ProductCollection[oIndex].num;
				console.log(s);

				var n = s.indexOf("NAT");
				if (n > -1) {
					PPD_Zone_controller.getRouter().navTo("NationalFleetSoldOrderView", {}, true); //page3
				}
				var n2 = s.indexOf("SO");
				if (n2 > -1) {
					PPD_Zone_controller.getRouter().navTo("RSOView_ManageSoldOrder", {}, true); //page3
				}
			}
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Zone_PPD
			 */
			//	onInit: function() {
			//
			//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Zone_PPD
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Zone_PPD
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.PriceProtectionDetails_Zone_PPD
		 */
		//	onExit: function() {
		//
		//	}

	});

});