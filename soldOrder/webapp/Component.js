sap.ui.define([
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"toyota/ca/SoldOrder/model/models"
], function (Dialog, Text, UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("toyota.ca.SoldOrder.Component", {

		metadata: {
			manifest: "json"
		},
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Get resource bundle
			var bundle = this.getModel('i18n').getResourceBundle();

			this.setModel(models.createLocalDataModel(), "LocalDataModel");

			// Attach XHR event handler to detect 401 error responses for handling as timeout
			var sessionExpDialog = new Dialog({
				title: bundle.getText('SESSION_EXP_TITLE'),
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: bundle.getText('SESSION_EXP_TEXT')
				})
			});
			var origOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function () {
				this.addEventListener('load', function (event) {
					// TODO Compare host name in URLs to ensure only app resources are checked
					if (event.target.status === 401) {
						if (!sessionExpDialog.isOpen()) {
							sessionExpDialog.open();
						}
					}
				});
				origOpen.apply(this, arguments);
			};
			
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			this.brand = "";
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				if (this.sDivision == "10")
				// set the toyoto logo
				{
					this.brand = "TOY";
				} else {
					// set the lexus logo
					this.brand = "LEX"; // }
				}
			}
			
			var oModel = new sap.ui.model.json.JSONModel();
			// oModel.setData();
			sap.ui.getCore().setModel(oModel, "seriesModel");
			
			var ochatModel = new sap.ui.model.json.JSONModel();
			// oModel.setData();
			sap.ui.getCore().setModel(ochatModel, "ChatModel");
			
			
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			// return this.nodeJsUrl;
			this.getSeriesData(this.brand,this.nodeJsUrl);
			this.getFleetCustomer();
		},
		
		getSeriesData:function(brand,nodeJsUrl){
			sap.ui.core.BusyIndicator.show();
			var oUrl = nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X' and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					sap.ui.core.BusyIndicator.hide();
					sap.ui.getCore().getModel("seriesModel").setData(data.d.results);
					sap.ui.getCore().getModel("seriesModel").updateBindings(true);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, sap.ui.getCore().getModel("i18n").getResourceBundle().getText(
						"error"), sap.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		getFleetCustomer: function () {
			sap.ui.core.BusyIndicator.show();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			var sPrefix;
			if (sLocation_conf == 0) {
				sPrefix = "/soldorder_node"; //ecpSales_node_secured
				this.fleetUrl = "/userDetails/FleetCustomers"; //"/userDetails/attributesforlocaltesting";
			} else {
				sPrefix = "";
				this.fleetUrl = "/userDetails/FleetCustomers";
			}

			//======================================================================================================================//			
			//  on init method,  get the token attributes and authentication details to the UI from node layer.  - begin
			//======================================================================================================================//		
			//  get the Scopes to the UI 
			//this.sPrefix ="";

			var that = this;
			// var zjson = new JSONModel();
			// sap.ui.getCore().setModel(zjson,"LoginUserModel");
			$.ajax({
				url: sPrefix + this.fleetUrl,
				type: "GET",
				dataType: "json",
				async: false,
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData.attributes);
					sap.ui.getCore().setModel(oModel, "fleetModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
	});
});