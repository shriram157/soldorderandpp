sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var FSO_PVController, zrequest;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ProcessedView", {
		formatter: formatter,

		onInit: function () {
			FSO_PVController = this;
			FSO_PVController.getBrowserLanguage();
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrder_ProcessedView").attachPatternMatched(this._getattachRouteMatched,
				this);
		},
		_getattachRouteMatched: function (parameters) {
			var requestid = parameters.getParameters().arguments.Soreq;
			FSO_PVController.getSO(requestid);
		},
		getSO: function (req) {
			var host = FSO_PVController.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?sap-client=200&$format=json";
			//attachPatternMatched

			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet('" + req + "')";
			zrequest = req;
			var zmodel = FSO_PVController.getView().getModel("mainservices");
			var sObjectPath = "/SO_FLEET_HeaderSet('" + req + "')";
			var oBundle = FSO_PVController.getView().getModel("i18n").getResourceBundle();
			var sMsg = oBundle.getText("procViewTitle", [req]);
			FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
			this.getView().bindElement({

				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (oEvent) {
						var partner = FSO_PVController.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zendcu');
						FSO_PVController.getView().getModel('mainservices').read("/Customer_infoSet('" + partner + "')", {
							success: function (data, textStatus, jqXHR) {
								var oModel = new sap.ui.model.json.JSONModel(data.CustomerInfo);
								FSO_PVController.getView().setModel(oModel, "Customer");
							},
							error: function (jqXHR, textStatus, errorThrown) {
								sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
									"Error",
									sap
									.m.MessageBox.Action.OK, null, null);
							}
						});
					}
				}
			});
		},
		_navToSoldOrder: function (evt) {
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData();
			FSO_PVController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {}, true); //page3
			// console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex]);
			// console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex].Category);
		},
		onAfterRendering: function () {
			// var oBundle = FSO_PVController.getView().getModel("i18n").getResourceBundle();
			// var sRecipient = "09789898565684"; // FSO_PVController.getView().getModel().getProperty("/recipient/name");
			// var sMsg = oBundle.getText("procViewTitle", [sRecipient]);
			// FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
		},
		onNavback:function(Oevent)
		{
		FSO_PVController.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary", {}, true);	
		}
	});

});