sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var FSO_Z_controller, zrequest, vehicle_no;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ZoneApproval", {
		formatter: formatter,

		onInit: function () {
			FSO_Z_controller = this;
			// FSO_Z_controller.getBrowserLanguage();
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrder_ZoneApproval").attachPatternMatched(this._getattachRouteMatched,
				this);
			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			 //FSO_Z_controller.returnBrowserLanguage();
			if (language == "EN") {
				Object = {
					"FSOSummary_OrderType": [{
						"key": "F1",
						"text": "DLR RAC"
					}, {
						"key": "F2",
						"text": "DLR ELITE"
					}, {
						"key": "F3",
						"text": "NAT RAC"
					}, {
						"key": "F4",
						"text": "NAT ELITE"
					}, {
						"key": "F5",
						"text": "MOBILITY"
					}],
				};

			} else {
				Object = {
					"FSOSummary_OrderType": [{
						"key": "F1",
						"text": "DLR RAC"
					}, {
						"key": "F2",
						"text": "DLR ELITE"
					}, {
						"key": "F3",
						"text": "NAT RAC"
					}, {
						"key": "F4",
						"text": "NAT ELITE"
					}, {
						"key": "F5",
						"text": "MOBILITY"
					}],
				};

			}

			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(sap.ui.getCore().getModel("OrderTypeModel"), "OrderTypeModel");
			//console.log(sap.ui.getCore().getModel("OrderTypeModel"));
			// FSO_Z_controller.flagZoneUser=false;
			// FSO_Z_controller.zoneUserToTrue();
		},
		_getattachRouteMatched: function (parameters) {
			var requestid = parameters.getParameters().arguments.Soreq;
			FSO_Z_controller.getSO(requestid);
		},
		getSO: function (req) {
			var host = FSO_Z_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//attachPatternMatched

			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet('" + req + "')";
			zrequest = req;
			var zmodel = FSO_Z_controller.getView().getModel("mainservices");
			var sObjectPath = "/SO_FLEET_HeaderSet('" + req + "')";
			var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var sMsg = oBundle.getText("zoneApprovalTitle", [req]);
			FSO_Z_controller.getView().byId("label_FSO_ZoneApprovaid").setText(sMsg);
			zmodel.refresh();
			this.getView().bindElement({

				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (oEvent) {
						vehicle_no = 0;
						var table1 = FSO_Z_controller.getView().byId('table1');
						var items1 = table1.getBinding('rows');
						items1.attachChange(function (sReason) {
							vehicle_no = vehicle_no + items1.getLength();
						});
						items1.filter([new Filter("WithVtn", FilterOperator.EQ, 'X')]);
						var table2 = FSO_Z_controller.getView().byId('table2');
						var items2 = table2.getBinding('rows');
						items2.attachChange(function (sReason) {
							for (var i = 0; i < items2.getLength(); i++) {
								vehicle_no = vehicle_no + parseInt(items2.getContexts()[i].getProperty('FltSOQty'), 10);
							}

							FSO_Z_controller.getView().byId('vechilecounter').setText(vehicle_no.toString());

						});
						items2.filter([new Filter("WithVtn", FilterOperator.EQ, '')]);
						var partner = FSO_Z_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zendcu');

						FSO_Z_controller.getView().getModel('mainservices').read("/Customer_infoSet('" + partner + "')", {
							success: function (data, textStatus, jqXHR) {
								var oModel = new sap.ui.model.json.JSONModel(data.CustomerInfo);
								FSO_Z_controller.getView().setModel(oModel, "Customer");
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

		/*zoneUserToTrue:function(){
			FSO_Z_controller.flagZoneUser=true;
			FSO_Z_controller.getView().byId("btn_approve_FSOZA").setVisible(true);
			FSO_Z_controller.getView().byId("btn_reject_FSOZA").setVisible(true);
			FSO_Z_controller.getView().byId("btn_back_FSOZA").setVisible(true); 
			FSO_Z_controller.getView().byId("orderType_FSOZA").setEnabled(true);
		},*/
		_approveFleetSoldRequest: function () {
			if (FSO_Z_controller.getView().byId('orderType_FSOZA').getSelectedKey() == "" || FSO_Z_controller.getView().byId('zoneapproval').getValue() ==
				"") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				// var errForm2 = formatter.formatErrorType("SO00004");
				// errMsg2 = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg; // + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				FSO_Z_controller.getView().getModel('mainservices').callFunction("/Approve_Fleet_Order", {
					method: "POST",
					urlParameters: {
						ZSO_FLT_REQ_NO: zrequest,
						ZZORDER_TYPE: FSO_Z_controller.getView().byId('orderType_FSOZA').getSelectedKey(),
						ZSO_FLT_STATUS: 'APPROVED',
						ZZONE_APPROVAL: FSO_Z_controller.getView().byId('zoneapproval').getValue()
					}, // function import parameters  
					// 
					success: function (oData, response) {
						FSO_Z_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
							Soreq: zrequest
						}, true);
					},
					error: function (oError) {

					}
				});
			}
		},
		_rejectFleetSoldRequest: function () {
			if (FSO_Z_controller.getView().byId('orderType_FSOZA').getSelectedKey() == "" || FSO_Z_controller.getView().byId('zoneapproval').getValue() ==
				"") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				// var errForm2 = formatter.formatErrorType("SO00004");
				// errMsg2 = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg; // + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				FSO_Z_controller.getView().getModel('mainservices').callFunction("/Approve_Fleet_Order", {
					method: "POST",
					urlParameters: {
						ZSO_FLT_REQ_NO: zrequest,
						ZZORDER_TYPE: FSO_Z_controller.getView().byId('orderType_FSOZA').getSelectedKey(),
						ZSO_FLT_STATUS: 'REJECTED',
						ZZONE_APPROVAL: FSO_Z_controller.getView().byId('zoneapproval').getValue()
					}, // function import parameter 
					success: function (oData, response) {
						FSO_Z_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
							Soreq: zrequest
						}, true);
					},
					error: function (oError) {

					}
				});
			}
		},
		onAfterRendering: function () {
			// var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
			// var sRecipient = "09787878784"; // FSO_Z_controller.getView().getModel().getProperty("/recipient/name");
			// var sMsg = oBundle.getText("zoneApprovalTitle", [sRecipient]);
			// FSO_Z_controller.getView().byId("label_FSO_ZoneApprovaid").setText(sMsg);

			// if (AppController.flagZoneUser == true) {
			FSO_Z_controller.getView().byId("btn_approve_FSOZA").setVisible(true);
			FSO_Z_controller.getView().byId("btn_reject_FSOZA").setVisible(true);
			FSO_Z_controller.getView().byId("btn_back_FSOZA").setVisible(true);
			// FSO_Z_controller.getView().byId("orderType_FSOZA").setEnabled(true);
			// }

		},
		onNavBack: function (oEvent) {
			FSO_Z_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView", {
				Soreq: zrequest
			}, true);
		}

	});

});