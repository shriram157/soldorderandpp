sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var FSO_PVController, zrequest, vehicle_no1,vehicle_no2;
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
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//attachPatternMatched

			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet('" + req + "')";
			zrequest = req;
			var zmodel = FSO_PVController.getView().getModel("mainservices");
			var sObjectPath = "/SO_FLEET_HeaderSet('" + req + "')";
			var oBundle = FSO_PVController.getView().getModel("i18n").getResourceBundle();
			var sMsg = oBundle.getText("procViewTitle", [req]);
			FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
			zmodel.refresh();
			this.getView().bindElement({

				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (oEvent) {
						FSO_PVController.getView().getElementBinding('mainservices').refresh();
						vehicle_no1 = 0;
						vehicle_no2 = 0;
						var table1 = FSO_PVController.getView().byId('table1');
						var items1 = table1.getBinding('rows');
						// items1.attachChange(function (sReason) {
						// 	vehicle_no1 = 0;
						// 	vehicle_no1 = vehicle_no1 + items1.getLength();
						// });
						items1.filter([new Filter("WithVtn", FilterOperator.EQ, 'X')]);
						var table2 = FSO_PVController.getView().byId('table2');
						var items2 = table2.getBinding('rows');
						// items2.attachChange(function (sReason) {
						// 	// vehicle_no2 = 0;
						// 	// for (var i = 0; i < items2.getLength(); i++) {
						// 	// 	vehicle_no2 = vehicle_no2 + parseInt(items2.getContexts()[i].getProperty('FltSOQty'), 10);
						// 	// }
      // //                     vehicle_no2 = vehicle_no1 + vehicle_no2; 
						// 	// FSO_PVController.getView().byId('vechilecounter').setText(vehicle_no2.toString());

						// });
						items2.filter([new Filter("WithVtn", FilterOperator.EQ, '')]);
						//-----------------------
						var oTbl = FSO_PVController.getView().byId("tble_FSO_PV");
						var items = oTbl.getBinding('rows');
						items.filter([new Filter("ZzsoFltReqNo", FilterOperator.EQ, req), new Filter("FleetReference", FilterOperator.EQ, 'X'), new Filter(
							"Zzvtn", FilterOperator.NE, '')], true);
						//------------------------
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
			// var sPath = evt.getSource().getBindingContext().sPath;
		//	var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData();
			FSO_PVController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText() }, true);
			// console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex]);
			// console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex].Category);
		},
		onAfterRendering: function () {
			// var oBundle = FSO_PVController.getView().getModel("i18n").getResourceBundle();
			// var sRecipient = "09789898565684"; // FSO_PVController.getView().getModel().getProperty("/recipient/name");
			// var sMsg = oBundle.getText("procViewTitle", [sRecipient]);
			// FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
		},
		onNavback: function (Oevent) {
			FSO_PVController.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary", {}, true);
		},
		onApprove:function(Oevent)
		{
			FSO_PVController.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ZoneApproval", {
				Soreq: zrequest }, true);	
		}
	});

});