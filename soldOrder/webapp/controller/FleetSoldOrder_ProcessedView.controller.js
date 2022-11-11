sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var FSO_PVController, zrequest, vehicle_no1, vehicle_no2;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ProcessedView", {
		formatter: formatter,

		onInit: function () {
			FSO_PVController = this;
			// FSO_PVController.getBrowserLanguage();
			FSO_PVController.getOwnerComponent().getRouter().getRoute("FleetSoldOrder_ProcessedView").attachPatternMatched(this._getattachRouteMatched,
				FSO_PVController);
			/*var oModel = new sap.ui.model.json.JSONModel();
			FSO_PVController.getView().setModel(oModel, 'ChatModelFleet');
			FSO_PVController.getView().byId("chatListFleet").setNoDataText("No Message");*/
		},
		onPost: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var dealerNumber = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BpDealerModel")[0].BusinessPartner;
			var userType = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			//Dealer_User //TCI_User 9999   //TCI_Zone_User 8888 
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				FSO_PVController.sPrefix = "/soldorder_node";
			} else {
				FSO_PVController.sPrefix = "";
			}
			FSO_PVController.nodeJsUrl = FSO_PVController.sPrefix + "/node";
			var soapMessage1 = {};

			if (userType == "TCI_User") {
				soapMessage1 = {
					Zdealer: "9999",
					ZsoReqNo: zrequest,
					Text: sValue
				};
			} else if (userType == "TCI_Zone_User") {
				soapMessage1 = {
					Zdealer: "8888",
					ZsoReqNo: zrequest,
					Text: sValue
				};
			} else {
				soapMessage1 = {
					Zdealer: dealerNumber,
					ZsoReqNo: zrequest,
					Text: sValue
				};
			}

			var zdataString = JSON.stringify(
				soapMessage1
			);
			var token = FSO_PVController.getView().getModel('mainservices').getSecurityToken();
			var oUrl = FSO_PVController.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ChatBoxSet";

			$.ajax({
				url: oUrl,
				headers: {
					accept: 'application/json',
					'content-type': 'application/json'
				},
				type: "POST",
				dataType: "json",
				data: zdataString,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Content-Type', "application/json");
				},
				success: function (data, textStatus, jqXHR) {
					FSO_PVController.getchat();
				},
				error: function (oError) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap.m.MessageBox.Action.OK, null, null);
				}
			});
			/*	var chatNum=FSO_PVController.getView().getModel('ChatModelFleet').getData().EntryCollection.length;
				AppController.RSO_MSO_ChatNumModel = new sap.ui.model.json.JSONModel();
				AppController.RSO_MSO_ChatNumModel.setData({
					chatNum: chatNum
				});*/
		},
		getchat: function () {

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				FSO_PVController.sPrefix = "/soldorder_node";
			} else {
				FSO_PVController.sPrefix = "";
			}
			FSO_PVController.nodeJsUrl = FSO_PVController.sPrefix + "/node";
			var oUrl = FSO_PVController.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ChatBoxSet?$filter=(ZsoReqNo eq '" + zrequest + "')";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = FSO_PVController.getView().getModel('ChatModelFleet');
					oModel.setData(data.d.results);
					oModel.refresh(true);
					oModel.updateBindings(true);
					sap.ui.getCore().setModel(oModel, 'GlobalChatModelFleet');
					console.log(sap.ui.getCore().getModel('GlobalChatModelFleet').getData());
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_getattachRouteMatched: function (parameters) {
			var requestid = parameters.getParameters().arguments.Soreq;
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Emphasized');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Transparent');
			sap.ui.core.BusyIndicator.show();
			FSO_PVController.getSO(requestid);
			//	FSO_PVController.getchat();
		},
		getSO: function (req) {
			var host = FSO_PVController.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//attachPatternMatched

			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/SO_FLEET_HeaderSet('" + req + "')";
			zrequest = req;
			var zmodel = FSO_PVController.getView().getModel("mainservices");
			//Added by singhmi to make the call asynchronus DMND0002946 on 11/03/2021 end
			//FSO_PVController.getView().getModel("mainservices").bUseBatch = true;
			var sObjectPath = "/SO_FLEET_HeaderSet('" + req + "')";
			var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var sMsg = oBundle.getText("procViewTitle", [req]);

			zmodel.refresh();
			this.getView().bindElement({

				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (oEvent) {
						FSO_PVController.getView().getElementBinding('mainservices').refresh();
						//vehicle_no1 = 0;
						//vehicle_no2 = 0;
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

						var zdealerCode = FSO_PVController.getView().getElementBinding('mainservices').getBoundContext().getProperty(
							'ZzdealerCode');
						FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg + " / " + zdealerCode);

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
					},
					//Added by singhmi to hide busy indicator after success or error DMND0002946 on 11/03/2021 
					dataReceived: function (oEvent) {
						if (oEvent.getParameter("error")) {
						
							sap.ui.core.BusyIndicator.hide();
							// error handling
						} else {
							
							sap.ui.core.BusyIndicator.hide();
							// something useful
						}
					}
				}
			});
		},
		_navToSoldOrder: function (evt) {
			// var sPath = evt.getSource().getBindingContext().sPath;
			//	var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData();
			FSO_PVController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
			// console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex]);
			// console.log(FSO_PVController.getView().byId("tble_FSO_PV").getModel().getData().ProductCollection[oIndex].Category);
		},
		onAfterRendering: function () {
			// var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
			// var sRecipient = "09789898565684"; // FSO_PVController.getView().getModel().getProperty("/recipient/name");
			// var sMsg = oBundle.getText("procViewTitle", [sRecipient]);
			// FSO_PVController.getView().byId("label_FSO_ProcessedViewid").setText(sMsg);
		},
		onNavBack: function (Oevent) {
			FSO_PVController.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary", {refresh : false});
		},
		onApprove: function (Oevent) {
			FSO_PVController.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ZoneApproval", {
				Soreq: zrequest
			}, true);
		}
	});

});