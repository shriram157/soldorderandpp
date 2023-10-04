sap.ui.define([
		"toyota/ca/SoldOrder/controller/BaseController",
		"sap/ui/model/resource/ResourceModel",
		"toyota/ca/SoldOrder/util/formatter",
		"sap/ui/model/Filter",
		"sap/ui/core/Fragment",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel"
	],
	function (BaseController, ResourceModel, formatter, Filter, Fragment, FilterOperator, JSONModel) {
		"use strict";
		var RSO_MSO_controller;
		var zrequest;
		//	var aEntries = [];
		var ppdFlages;
		var zcustomerModel, zinventoryModel;
		var SelectVehicleOption = false;
		var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
		return BaseController.extend("toyota.ca.SoldOrder.controller.RSOView_ManageSoldOrder", {
			formatter: formatter,

			onInit: function (OEvent) {
				RSO_MSO_controller = this;
				// RSO_MSO_controller.getBrowserLanguage();
				RSO_MSO_controller._handleServiceSuffix_Series();
				RSO_MSO_controller._oBusyDialog = new sap.m.BusyDialog();
				//this.getView().byId("feedId").setVisible(false);
				zcustomerModel = new JSONModel({});
				zinventoryModel = new JSONModel({});
				RSO_MSO_controller.getView().setModel(zcustomerModel, 'Customer');
				RSO_MSO_controller.getView().setModel(zinventoryModel, 'Inventory');
				//RSO_MSO_controller.getOwnerComponent().getRouter().getRoute("RSOView_ManageSoldOrder").attachPatternMatched(RSO_MSO_controller._getattachRouteMatched, this);
				this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._getattachRouteMatched, this);
				// var language = RSO_MSO_controller.returnBrowserLanguage();
				RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
				var salesTypeModel = new sap.ui.model.json.JSONModel();
				var Obj;
				if (language == "EN") {
					Obj = {
						"SalesType": [{
							"key": "1",
							"text": "CASH"
						}, {
							"key": "2",
							"text": "LEASE"
						}, {
							"key": "3",
							"text": "FINANCE"
						}],
					};
				} else {
					Obj = {

						"SalesType": [{
							"key": "1",
							"text": "COMPTANT"
						}, {
							"key": "2",
							"text": "BAIL"
						}, {
							"key": "3",
							"text": "LA FINANCE"
						}],

					};
				}

				salesTypeModel.setData(Obj);

				salesTypeModel.updateBindings(true);
				sap.ui.getCore().setModel(salesTypeModel, "salesTypeModel");
				RSO_MSO_controller.getView().setModel(sap.ui.getCore().getModel("salesTypeModel"), "salesTypeModel");
				// //console.log(sap.ui.getCore().getModel("salesTypeModel"));

				var oModel = new sap.ui.model.json.JSONModel();
				RSO_MSO_controller.getView().setModel(oModel, 'ChatModel');

				//RSO_MSO_controller.getView().byId("chatList").setShowNoData(false);
				RSO_MSO_controller.getView().byId("chatList").setNoDataText("No Message");
			},

			onPost: function (oEvent) {
				/*	var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						style: "medium"
					});*/
				//	var oDate = new Date();
				//	var sDate = oFormat.format(oDate);
				var sValue = oEvent.getParameter("value");
				//var user = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
				var dealerNumber = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BpDealerModel")[0].BusinessPartner;
				var signature = sap.ui.getCore().getModel("LoginUserModel").getProperty('/Signaturetype');
				var userType = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
				//
				/*	var signModel=sap.ui.getCore().getModel('SignatureModel')
					if(signModel){
					console.log(sap.ui.getCore().getModel('SignatureModel').getData().userProfile.id);	
					}*/
				//Dealer_User //TCI_User 9999   //TCI_Zone_User 8888 
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					RSO_MSO_controller.sPrefix = "/soldorder_node";
				} else {
					RSO_MSO_controller.sPrefix = "";
				}
				RSO_MSO_controller.nodeJsUrl = RSO_MSO_controller.sPrefix + "/node";
				var soapMessage1 = {};

				if (userType == "TCI_User") {
					soapMessage1 = {
						Zdealer: "9999",
						Zusertype: signature,
						ZsoReqNo: zrequest,
						Text: sValue
					};
				} else if (userType == "TCI_Zone_User") {
					soapMessage1 = {
						Zdealer: "8888",
						Zusertype: signature,
						ZsoReqNo: zrequest,
						Text: sValue
					};
				} else {
					soapMessage1 = {
						Zdealer: dealerNumber,
						Zusertype: signature,
						ZsoReqNo: zrequest,
						Text: sValue
					};
				}

				var zdataString = JSON.stringify(
					soapMessage1
				);
				var token = RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken();
				var oUrl = RSO_MSO_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ChatBoxSet";
				/*?$filter=(ZsoReqNo eq '" + zrequest +
					"' and Zdealer eq '" +
					dealerNumber + "')";*/
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

						RSO_MSO_controller.getchat();
					},
					error: function (oError) {
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
							sap.m.MessageBox.Action.OK, null, null);
					}

				});

				/*	var chatNum=RSO_MSO_controller.getView().getModel('ChatModel').getData().EntryCollection.length;
					AppController.RSO_MSO_ChatNumModel = new sap.ui.model.json.JSONModel();
					AppController.RSO_MSO_ChatNumModel.setData({
						chatNum: chatNum
					});*/
			},
			getchat: function () {
				//	var dealerNumber = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BpDealerModel")[0].BusinessPartner;
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					RSO_MSO_controller.sPrefix = "/soldorder_node";
				} else {
					RSO_MSO_controller.sPrefix = "";
				}
				RSO_MSO_controller.nodeJsUrl = RSO_MSO_controller.sPrefix + "/node";
				/*var oUrl1 = RSO_MSO_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ChatBoxSet?$filter=(ZsoReqNo eq '" + zrequest +
					"' and Zdealer eq '" +
					dealerNumber + "')";*/
				var oUrl = RSO_MSO_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ChatBoxSet?$filter=(ZsoReqNo eq '" + zrequest + "')";

				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						var oModel = RSO_MSO_controller.getView().getModel('ChatModel');
						//console.log(data.d.results);
						oModel.setData(data.d.results);
						oModel.refresh(true);
						oModel.updateBindings(true);
						sap.ui.getCore().setModel(oModel, 'GlobalChatModel');
						//console.log(sap.ui.getCore().getModel('GlobalChatModel').getData());
						RSO_MSO_controller.chatNum = sap.ui.getCore().getModel('GlobalChatModel').getData().length;

						// for (var i = 0; i < RSO_MSO_controller.getView().byId("chatList").getItems().length; i++) {
						if (RSO_MSO_controller.getView().byId("chatList").getItems()[0]) {
							RSO_MSO_controller.getView().byId("chatList").getItems()[0].focus(RSO_MSO_controller.chatNum);
						}
						/*if (AppController.chatNum !== undefined) {

							var feed = RSO_MSO_controller.getView().byId("feedId");
							if (AppController.chatNum > 0) {
								feed.setEnabled(true);
							} else {
								feed.setEnabled(false);
							}
						}*/
						//	var chatNumber = AppController.chatMessageNum; //RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('ChatMessages');
						//	var chatNum = parseInt(chatNumber);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
							sap.m.MessageBox.Action.OK, null, null);
					}
				});
			},
			_getattachRouteMatched: function (parameters) {
				//	var cb_chat = RSO_MSO_controller.getView().byId("ChatCB");
				RSO_MSO_controller = this;
				// INC0238832 sold order comments (SOPP issue)  Shriram  9-Aug-2023  setting TextArea value blank file loading  line 228
				RSO_MSO_controller.getView().byId('idComments_TA_RSO_ManageSO').setValue('');
				var feed = RSO_MSO_controller.getView().byId("feedId");
				var chatVBox = RSO_MSO_controller.getView().byId("chatVBox");
				var oDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				var requestid = parameters.getParameters().arguments.Soreq;
				var userType = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
				if (requestid) {
					/// changes done by Minakshi for INC0195063
					RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/pageArg", parameters.getParameters().arguments.mainPG ||
						"");
					//	RSO_MSO_controller.pageNum = parameters.getParameters().arguments.pageNum || "";
					chatVBox.setVisible(false);
					/*	if (cb_chat.getSelected() == true) {
							cb_chat.setSelected(false);
						} else {
							cb_chat.setSelected(false);
						}*/

					if (oDivision == "10") {
						RSO_MSO_controller.sDivision = "TOY";
					} else {
						RSO_MSO_controller.sDivision = "LEX";
					}

					var RSO_MSO_Model = new sap.ui.model.json.JSONModel();
					RSO_MSO_Model.setData({
						NFVisible: false,
						SOVisible: true
					});
					RSO_MSO_controller.getView().setModel(RSO_MSO_Model, "RSO_MSO_Model");

					setTimeout(function () {
						var attachButton = RSO_MSO_controller.getView().byId("btn_addAttach_RSO_MSO");
						var _Eligibility1 = RSO_MSO_controller.getView().byId("RSO_PRC_Eligilibity");
						//	_Eligilibity = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("Eligilibity");
						if (_Eligibility1.getText() == "YES") {
							attachButton.setEnabled(true);
						} else {
							attachButton.setEnabled(false);
						}

					}, (1 * 1000));

					RSO_MSO_controller.getSO(requestid);

					if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext() !== null) {
						var SOType = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("ZzsoType");
						// 	//console.log("So status", SOType);
						//For FLeet Details only
						if (SOType == "NF" || SOType == "FO") {
							RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/NFVisible", true);
							// RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/SOVisible", false);
						} else {
							RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/NFVisible", false);
							// RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/SOVisible", true);
						}
					}
					//	console.log(RSO_MSO_controller.getView().byId("chatList").getItems());
					RSO_MSO_controller.getView().byId("feedId").setValue(null);
					if (RSO_MSO_controller.getView().byId("chatList").getItems()[0]) {
						RSO_MSO_controller.getView().byId("chatList").getItems()[0].focus();
					}
					RSO_MSO_controller.getchat();

					if (userType == "TCI_User") {
						feed.setVisible(true);
						feed.setEnabled(true);
						//	cb_chat.setVisible(true);
						chatVBox.setVisible(true);
						//	cb_chat.setEnabled(true);
						/*	if (AppController.chatNum !== undefined) {
								if (AppController.chatNum > 0) {
									cb_chat.setSelected(true);
									feed.setEnabled(true);
								} else {
									cb_chat.setSelected(false);
									feed.setEnabled(false);
								}
							}*/
					} else {
						if (RSO_MSO_controller.chatNum !== undefined) {
							if (RSO_MSO_controller.chatNum > 0) {
								feed.setEnabled(true);
								feed.setVisible(true);
								//	cb_chat.setVisible(false);
								chatVBox.setVisible(true);
							} else {
								feed.setEnabled(false);
								feed.setVisible(false);
								//	cb_chat.setVisible(false);
								chatVBox.setVisible(false);
							}
						}
					}

				}

			},

			getSO: function (req) {
				ppdFlages = sap.ui.getCore().getModel("ppdFlages");
				if (ppdFlages) {
					if (ppdFlages.getData().openCommentBox == 'X') {
						RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").setEnabled(true);
						RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").setVisible(true);
					}
				}
				var user = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
				// var status = RSO_MSO_controller.getView().getModel('mainservices').getData().ZzsoStatus;
				if (user == "Dealer_User") //&& status !="Cancelled"
				{
					RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEditable(true);
					RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEnabled(true);

				}

				//"""""""""""""""""""""""""""""""""""""""
				var host = RSO_MSO_controller.host();
				//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
				//attachPatternMatched
				// changes done for INC0217519 start by Minakshi
				// if (!RSO_MSO_controller.pageNum) {
				//this.byId("suffix_CSOR").setSelectedKey("");//commented this line--- changes by swetha for INC225765 on 27/01/2023 
				//this.byId("colour_CSOR").setSelectedKey("");//commented this line--- changes by swetha for INC225765 on 27/01/2023

				//	}
				// changes done for INC0217519 end by Minakshi
				//var oURL = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet('" + req + "')";
				zrequest = req;
				// var _Eligilibity = " ";
				var zmodel = RSO_MSO_controller.getView().getModel("mainservices");
				RSO_MSO_controller.getView().getModel("mainservices").bUseBatch = false;
				var sObjectPath = "/Retail_Sold_OrderSet('" + req + "')";
				RSO_MSO_controller.getView().getModel("mainservices").setProperty('/Zzmodel', "");
				RSO_MSO_controller.getView().getModel("mainservices").setProperty('/Zzmoyr', "");
				RSO_MSO_controller.getView().getModel("mainservices").setProperty('/Zzsuffix', "");
				RSO_MSO_controller.getView().getModel("mainservices").setProperty('/Zzextcol', "");
				RSO_MSO_controller.getView().getModel("mainservices").setProperty('/Zzseries', "");
				this.byId('model_CSOR').setSelectedItem().setValue("");
				zmodel.refresh();
				// this.getOwnerComponent().getModel('mainservices').refresh();
				// this.getOwnerComponent().getModel("mainservices").updateBindings();
				RSO_MSO_controller.getView().bindElement({
					path: sObjectPath,
					model: "mainservices",
					events: {
						dataRequested: function (oEvent) {
							RSO_MSO_controller.byId('model_CSOR').setSelectedItem().setValue("");
							//RSO_MSO_controller.getOwnerComponent().getModel('mainservices')._refresh;
						},
						change: RSO_MSO_controller._getSOChangeEvt.bind(this, sObjectPath, req),
						dataReceived: function (oEvent) {

						}
					}
				});

			},

			_getSOChangeEvt: function (sObjectPath, req) {
				//RSO_MSO_controller.getOwnerComponent().getModel('mainservices')._refresh;
				// Filter for Display Data Sold Order
				this.byId('model_CSOR').setSelectedItem().setValue("");
				var attachButton = RSO_MSO_controller.getView().byId("btn_addAttach_RSO_MSO");
				var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
				var sMsg = oBundle.getText("mangSoldOrder", [req]);
				/*	AppController.chatMessageNum = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
						'ChatMessages');*/
				var _Eligilibity = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("Eligilibity");
				if (_Eligilibity == "YES") {
					attachButton.setEnabled(true);
				} else {
					attachButton.setEnabled(false);
				}
				var zcustomerNumber = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					'Zzendcu');
				//added by Minakshi for DMND0002960 start
				var zdealerCode = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					'ZzdealerCode');

				RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg + " / " + zdealerCode);
				//added by Minakshi for DMND0002960 end
				RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Zcustomer_No", zcustomerNumber);

				RSO_MSO_controller.model = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					'Zzmodel');
				RSO_MSO_controller.modYear = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					'Zzmoyr');
				RSO_MSO_controller.dealerAllocation = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					'ZzdealerCode');
				RSO_MSO_controller.series = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					'Zzseries');
				if (RSO_MSO_controller.getView().getElementBinding("mainservices").getBoundContext().getProperty("ZzsoType") == "SO") {
					RSO_MSO_controller.apptypeAllocation = "R";
				} else if (RSO_MSO_controller.getView().getElementBinding("mainservices").getBoundContext().getProperty("ZzsoType") == "FO") {
					RSO_MSO_controller.apptypeAllocation = "F";
				} else {
					RSO_MSO_controller.apptypeAllocation = "R";
				}
				sap.ui.getCore().setModel(new JSONModel({
					model: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel'),
					modelyear: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr'),
					suffix: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix'),
					color: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol'),
					series: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries'),
					dealer: RSO_MSO_controller.dealerAllocation,
					apptypeAllocation: RSO_MSO_controller.apptypeAllocation
				}), 'Vehicle_Selection');
				var host = RSO_MSO_controller.host();
				var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
				if (isDivisionSent) {
					this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
					if (this.sDivision == '10') {
						RSO_MSO_controller.divison = "TOY";
					} else { // set the lexus logo
						RSO_MSO_controller.divison = "LEX";
					}
				}
				/*console.log("1:"+RSO_MSO_controller.model);
				console.log("2:"+RSO_MSO_controller.modYear);
				console.log("3:"+RSO_MSO_controller.dealer);
				console.log("4:"+RSO_MSO_controller.series);
				console.log("5:"+RSO_MSO_controller.apptype);
				*/

				//Filter Data Sold Order
				var SOType = RSO_MSO_controller.getView().getElementBinding("mainservices").getBoundContext().getProperty("ZzsoType");
				//For FLeet Details only
				if (SOType == "NF" || SOType == "FO") {
					RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/NFVisible", true);
					// RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/SOVisible", false);
				} else {
					RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/NFVisible", false);
					// RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/SOVisible", true);
				}

				//----------------------------------------------------------
				var status = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzsoStatus');
				console.log("status:" + status + "BoundContext:" + RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext()) //14-Apr-2023 Shriram
					/// changes done by Minakshi for INC0195063
				if (RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/pageArg") == "F") {
					RSO_MSO_controller.getView().byId("btn_orderChange_RSO_MSO").setEnabled(false);
				}
				if (status === "Cancelled") {
					RSO_MSO_controller.getView().byId("btn_update").setEnabled(false);
					RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setEnabled(false);
					RSO_MSO_controller.getView().byId("btn_orderChange_RSO_MSO").setEnabled(false);
					RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(false);
					RSO_MSO_controller.getView().byId("btn_addAttach_RSO_MSO").setEnabled(false);
					RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").setEnabled(false);
					RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEnabled(false);
				} else {
					RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(true);
				}
				//changes done by Swetha for INC0213630
				if (sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType") == "Dealer_User" && SOType == "NF") {
					RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(false);
				}
				if (status == "CHANGED") {
					RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(false); //changes by swetha
				}
				// var vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();
				// var dealer_no = RSO_MSO_controller .getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;

				_Eligilibity = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
					"Eligilibity");
				//changes by swetha for DMND0003239
				if ((RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("PriceStatus") == "UNDER-REVIEW") &&
					(RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("PRCPROTADD1") == "")) {
					RSO_MSO_controller.getView().byId("btn_linkrdrvin").setVisible(true);
				} else {
					RSO_MSO_controller.getView().byId("btn_linkrdrvin").setVisible(false);
				}
				if (_Eligilibity == "YES") {
					attachButton.setEnabled(true);
					RSO_MSO_controller.getView().byId("btn_SimulatePrice").setVisible(true);
					RSO_MSO_controller.getView().byId("btn_SimulatePrice").setEnabled(true); //changes by swetha for DMND0003239
				} else {
					attachButton.setEnabled(false);
					RSO_MSO_controller.getView().byId("btn_SimulatePrice").setVisible(false)
					RSO_MSO_controller.getView().byId("btn_SimulatePrice").setEnabled(false); //changes by swetha for DMND0003239
				}
				var zvtn = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzvtn');
				if (zvtn != "") {
					var OBJNew = {};
					var _oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-dd"
					});
					var ETAFrom = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("EtaFrom"); //ETAFrom earleir
					var ETATo = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty("EtaTo"); //ETATo
					if (ETAFrom === null && ETATo === null) {
						var datemodel = sap.ui.getCore().getModel("dateSO_BModel");
						var etaToText = RSO_MSO_controller.getView().byId("idtoText").getText();
						var etaFromText = RSO_MSO_controller.getView().byId("idfromText").getText();
						//INC0225765 SOPP and PEIS show wrong Suffix descriptions for some order---Shriram 18-Jan-2023 Code Start
						// Since the model is defined in RetailSoldOrderB.controller.js,when this controller is not loaded before, datemodel comes as undefined
						if (datemodel != undefined) {
							var data = datemodel.getData();
							var ETAFrom1 = data.fromDate;
							var ETATo1 = data.toDate;
							OBJNew.ETAFrom = _oDateFormat.format(new Date(ETAFrom1));
							OBJNew.ETATo = _oDateFormat.format(new Date(ETATo1));
							SelectVehicleOption = false;
							zinventoryModel.setData(OBJNew);
							zinventoryModel.updateBindings(true);
						}
						//INC0225765 SOPP and PEIS show wrong Suffix descriptions for some order---Shriram 18-Jan-2023 Code End
					} else {
						OBJNew.ETAFrom = _oDateFormat.format(new Date(ETAFrom));
						OBJNew.ETATo = _oDateFormat.format(new Date(ETATo));
						SelectVehicleOption = false;
						zinventoryModel.setData(OBJNew);
						zinventoryModel.updateBindings(true);
					}
				} else if (zvtn == "" && !!SelectVehicleOption && sap.ui.getCore().getModel('ModelCore')) {
					OBJNew = {};
					var year = sap.ui.getCore().getModel('ModelCore').getData().ETAFrom.substring(0, 4);
					var month = sap.ui.getCore().getModel('ModelCore').getData().ETAFrom.substring(4, 6);
					var day = sap.ui.getCore().getModel('ModelCore').getData().ETAFrom.substring(6, 8);
					ETAFrom = year + "-" + month + "-" + day;

					year = sap.ui.getCore().getModel('ModelCore').getData().ETATo.substring(0, 4);
					month = sap.ui.getCore().getModel('ModelCore').getData().ETATo.substring(4, 6);
					day = sap.ui.getCore().getModel('ModelCore').getData().ETATo.substring(6, 8);
					ETATo = year + "-" + month + "-" + day;

					RSO_MSO_controller.getView().byId("idVTN").setText(sap.ui.getCore().getModel('ModelCore').getData().ZZVTN);
					OBJNew.ETAFrom = ETAFrom;
					OBJNew.ETATo = ETATo;
					SelectVehicleOption = false;
					zinventoryModel.setData(OBJNew);
					zinventoryModel.updateBindings(true);
					sap.ui.getCore().getModel('ModelCore').setData({});

				} else {
					SelectVehicleOption = false;
					zinventoryModel.setData({});
					zinventoryModel.updateBindings(true);

				}
				if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu')) {
					var zcustomerNumber = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty(
						'Zzendcu');
					var regFlag = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('CustAtReg');

					RSO_MSO_controller._SOType = RSO_MSO_controller.getView().getElementBinding("mainservices").getBoundContext().getProperty(
						"ZzsoType");
					// if (_SOType == "SO") {
					// RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/NFVisible", false);
					// RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/SOVisible", true);
					var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber;

					$.ajax({
						url: url,
						headers: {
							accept: 'application/json'
						},
						type: "GET",
						dataType: "json",
						contentType: "text/xml; charset=\"utf-8\"",
						success: function (data, textStatus, jqXHR) {
							//console.log("customer data", data);
							if (data.customer) {
								data.customer.phones[0].phoneNumber = data.customer.phones[0].areaCode + data.customer.phones[0].localNumber;
								zcustomerModel.setData(data.customer);
							}
						},
						error: function (request, errorText, errorCode) {
							if (RSO_MSO_controller._SOType !== "NF" && RSO_MSO_controller._SOType !== "FO") {
								zcustomerModel.setData([]); // change 16 sep
								//console.log(request.responseText);
								var str = request.responseText;
								//	var obj = JSON.stringify(str);
								var obj2 = JSON.parse(str);
								sap.m.MessageToast.show(obj2.messages[0].errorText); // 17 sep change 
							}
							//	//console.log("empty data", data);// change 16 sep
						}
					});
					// } else {
					// 	RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/NFVisible", true);
					// 	RSO_MSO_controller.getView().getModel("RSO_MSO_Model").setProperty("/SOVisible", false);
					// }
				}

				RSO_MSO_controller.getOwnerComponent().getModel("mainservices").read(sObjectPath, {
					success: $.proxy(function (soOData) {
						RSO_MSO_controller.byId("model_CSOR").setSelectedKey(soOData.Zzmodel);
						RSO_MSO_controller.byId("suffix_CSOR").setSelectedKey(soOData.Zzsuffix);
						console.log("Read: " + sObjectPath + "ZzsoStatus :" + soOData.ZzsoStatus); //14-Apr-2023 Shriram
						RSO_MSO_controller.byId("RSOV_MSO_SoStatus").setText(soOData.ZzsoStatus); //13-Apr-2023 Shriram
						this.byId('model_CSOR').setSelectedItem().setValue("");
						RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Zzmodel", soOData.Zzmodel);
						RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/zzSuffix", soOData.Zzsuffix);
						if (soOData.Zzsuffix == 'XX') {
							RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Zzextcol", '');
						} else {
							RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Zzextcol", soOData.Zzextcol);
						}
						RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/Zzapx", soOData.Zzapx);
						RSO_MSO_controller.series_selected();
						RSO_MSO_controller.model_selected();
						RSO_MSO_controller.suffix_selected();
					}, this),
					error: function () {}
				});
				//changes by swetha for DMND0003239 on 18th Sept, 2023 Start 
				var ppdModellength = sap.ui.getCore().getModel("ppdModel").getData().length;
				var that = this;
				for (var i = 0; i < ppdModellength; i++) {
					if (sap.ui.getCore().getModel("ppdModel").getData()[i].dealer_ord == req) {
						if (sap.ui.getCore().getModel("ppdModel").getData()[i].status == "UNDER-REVIEW") {
							that.getView().getModel('mainservices').callFunction("/RSO_RDR_LINK", {
								method: "GET",
								urlParameters: {
									ZzsoReqNo: req,
									Vhvin: that.getView().getElementBinding('mainservices').getBoundContext().getProperty('Vhvin'),
									Status: sap.ui.getCore().getModel("ppdModel").getData()[i].status
								}, // function import parameters
								success: function (data, response) {
									if (data.MessageV1 == 'X') {
										RSO_MSO_controller.getView().byId("btn_linkrdrvin").setEnabled(true);
									} else {
										RSO_MSO_controller.getView().byId("btn_linkrdrvin").setEnabled(false);
									} //page
								},
								error: function (oData, oResponse) {
									sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
								}
							});
						}
					} else {
						RSO_MSO_controller.getView().byId("btn_linkrdrvin").setEnabled(false);
					}
				}
				//changes by swetha for DMND0003239 on 18th Sept, 2023 End
			},

			_updateSoldOrderRequest: function () {
				var comment = RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").getValue();
				var _data = {
					"Comment": comment,
					"ZzsoReqNo": zrequest

				};
				var host = RSO_MSO_controller.host();
				var url = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet('" + zrequest + "')";
				var dataString = JSON.stringify(
					_data
				);
				//--------------------------------------------------------------------------
				//----Checking if there is no Token , it will refresh to get another one---- 
				//---------------------------------------------------------------------------

				if (!RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken()) {
					RSO_MSO_controller.getView().getModel('mainservices').refreshSecurityToken();
				}
				var token = RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken();

				$.ajax({
					type: 'PUT',
					url: url,
					data: dataString,
					dataType: 'json',
					beforeSend: function (xhr) {
						xhr.setRequestHeader('X-CSRF-Token', token);
						xhr.setRequestHeader('Content-Type', "application/json");

					},
					// RSO_MSO_controller.getView().getModel('mainservices').callFunction("/Retail_Sold_OrderSet", {
					// 		method: "PUT",
					// 		urlParameters: {
					// 			ZzsoReqNo: zrequest
					// 		}, // function import parameters
					// 		data: dataString,
					success: function (oData, response) {
						//console.log(oData);
					},
					error: function (oError) {
						//console.log(oError);

					}
				});
				// window.location.reload();
			},
			_updateAuditSoldOrderRequest: function () {
				this.btnAudit = RSO_MSO_controller.getView().byId("btn_AuditComp_RSO_MSO");
				var that = this;
				RSO_MSO_controller.getView().getModel('mainservices').callFunction("/Update_Audit_Status", {
					method: "POST",
					urlParameters: {
						ZZ_AUDIT_STATUS: 'COMPLETE',
						ZzsoReqNo: zrequest
					}, // function import parameters
					success: function (oData, response) {
						//console.log(oData); //17 sep change 
						//console.log(oData.Message); //18 sep change
						var msg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("auditStatusCompletion");
						sap.m.MessageToast.show(msg); //17 sep change
						that.btnAudit.setEnabled(false); // 18 sep change 
						RSO_MSO_controller.getView().getElementBinding('mainservices').refresh(true);
						RSO_MSO_controller.getView().getModel('mainservices').updateBindings(true);

					},
					error: function (oError) {

					}

				});
				// AppController.flgSoldOrderReqStatus = "Audit - Complete";
			},
			_approvePriceProtectionDetails: function () {
				if (RSO_MSO_controller.getView().byId("RSO_PRC_Eligilibity").getText() === "YES") {

					RSO_MSO_controller.getView().getModel("mainservices").callFunction("/Approve_Price_Details", {
						method: "POST",
						urlParameters: {
							ZzsoReqNo: zrequest,
							comment: RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").getValue()
						}, // function import parameters
						success: function (oData, response) {
							if (oData.Type == 'E') {
								// var oBundle = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oData.Message;
								//	sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "ERROR", sap.m.MessageBox.Action.OK, null, null);

								sap.m.MessageBox.show(sMsg, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "ERROR",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function (oAction) {
										RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");

									}
								});

							} else {
								sMsg = oData.Message;
								sap.m.MessageBox.show(sMsg, {
									icon: sap.m.MessageBox.Icon.SUCCESS,
									title: "SUCCESS",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function (oAction) {
										RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");
									}
								});

							}

						},
						error: function (oError) {

						}
					});
				} else {
					var sMsg = "This Order is Not Eligible To Price Protection Approval";
					sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			},
			_rejectPriceProtectionDetails: function () {
				//AppController.flgPriceProtectionStatus = "Rejected";
				RSO_MSO_controller.getView().getModel("mainservices").callFunction("/Reject_Price_Details", {
					method: "POST",
					urlParameters: {
						ZzsoReqNo: zrequest,
						comment: RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").getValue()
					}, // function import parameters
					success: function (oData, response) {
						if (oData.Type == 'E') {
							// var oBundle = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle();
							var sMsg = oData.Message;

							sap.m.MessageBox.show(sMsg, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "ERROR",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oAction) {
									RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");
								}
							});

						} else {
							sMsg = oData.Message;

							sap.m.MessageBox.show(sMsg, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "SUCCESS",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oAction) {
									RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");
								}
							});

						}

					},
					error: function (oError) {

					}
				});
			},
			_getVehiclesToFillSoldOrderRequest: function () {
				//	var host = RSO_MSO_controller.host();
				SelectVehicleOption = true;
				RSO_MSO_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_DealerInventory", {
					Soreq: zrequest
				}, true);
				sap.ui.core.BusyIndicator.show();

			},
			_navCancleOrder: function () {
				var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorCancel");
				var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title4");
				var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});
				var msg = new sap.m.HBox({
					items: [icon, new sap.m.Text({
						text: errMsg
					})]
				});
				sap.m.MessageBox.show(msg, {
					title: title,
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction == "YES") {

							RSO_MSO_controller.getOwnerComponent().getRouter().navTo("RetailSoldOrderCancelRequest", {
								Soreq: zrequest
							}, true); //page6
						} else {
							//
						}
					},
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit,
					contentWidth: "10rem"
				});
			},
			_onDeleteAttachment: function (evt) {
				var evtContext = evt.getSource().getBindingContext('mainservices'); // "/ProductCollection/0"
				var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
				var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title1");
				var index = evt.getSource().getParent().getIndex();
				var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});
				var msg = new sap.m.HBox({
					items: [icon, new sap.m.Text({
						text: errMsg
					})]
				});
				sap.m.MessageBox.show(msg, {
					//icon: sap.m.MessageBox.Icon.WARNING,
					title: title,
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction == "YES") {
							RSO_MSO_controller.deleteAtt(evtContext, index);
						} else {
							//
						}
					},
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit,
					contentWidth: "10rem"
				});
			},
			deleteAtt: function (evtContext, index) {
				var oTable = RSO_MSO_controller.getView().byId("table_RSOViewManageSO");
				var sPath = evtContext.sPath;
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					this.sPrefix = "/soldorder_node";
				} else {
					this.sPrefix = "";
				}
				this.nodeJsUrl = this.sPrefix + "/node";
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV" + sPath;
				// 				$.ajax({
				//     url: oUrl,
				//     type: 'DELETE',
				//     success: function(result) {
				// 		console("DELETED");
				//         // Do something with the result
				//     }
				// });
				// Commented DELETE method below
				RSO_MSO_controller.getView().getModel('mainservices').remove(sPath, {
					// method: "DELETE",
					success: function (data, oResponse) {
						oTable.getModel('mainservices').refresh();
						//RSO_MSO_controller.getView().getModel('mainservices').refresh(true);
					},
					error: function (oData, oResponse) {
						sap.m.MessageBox.show("Error Remove File. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap.m
							.MessageBox.Action.OK, null, null);
					}
				});
			},
			_addAttachment: function () {
				var com = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").getValue();
				var textArea = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO");

				var oFileUploader = RSO_MSO_controller.getView().byId("idRSOV_MSO_fileUpl");
				var zcomment = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO");
				oFileUploader.removeAllHeaderParameters();
				//INC0193457 changes done for removing special characters from the file name during upload. SinghMi 29/06/2021
				var pattern = /[^\w\d\.\s]/gi;
				var oFileName = oFileUploader.getValue().replace(pattern, "");
				oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "slug",
					value: oFileName + "," + zcomment.getValue()
				}));

				oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "x-csrf-token",
					value: RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken()
				}));

				oFileUploader.setSendXHR(true);
				oFileUploader.upload();
			},

			_navToRSOrderChange: function () {
				var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorChange");
				var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title3");
				var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});
				var msg = new sap.m.HBox({
					items: [icon, new sap.m.Text({
						text: errMsg
					})]
				});
				sap.m.MessageBox.show(msg, {
					title: title,
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction == "YES") {
							RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/changeRsKey", "");
							RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/comment_ch_res", "");
							RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").setProperty("/resonCancelId_val", "");
							RSO_MSO_controller.getOwnerComponent().getRouter().navTo("SoldOrderChangeReason", {
								Soreq: zrequest
							}, true); //page7
						} else {}
					},
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit,
					contentWidth: "10rem"
				});
			},
			////////////////////////////////////////////////////////////////////////////
			onUpload: function (e) {
				var t = RSO_MSO_controller;
				var fU = RSO_MSO_controller.getView().byId("idfileUploader");
				var domRef = fU.getFocusDomRef();
				var file = domRef.files[0];
				var dublicateValue = [];
				try {
					if (file) {
						var that = RSO_MSO_controller;
						that._oBusyDialog.open();

						// To Fetch CSRF Token

						var sUrl = "/sap/opu/odata/SAP/Z***SRV/";
						$.ajax({
							url: sUrl,
							type: "GET",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", "Fetch");
							},
							success: function (data, textStatus, XMLHttpRequest) {
								var oToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
								var oHeaders = {
									"x-csrf-token": oToken,
								};

								// ****To Fetch CSRF Token To Upload File

								var oURL = "/sap/opu/odata/SAP/Z***SRV/UploadSet";
								$.ajax({
									type: 'POST',
									url: oURL,
									headers: oHeaders,
									cache: false,
									contentType: ["csv"],
									processData: false,
									data: file,
									success: function (data) {

										var isIE = false || !!document.documentMode;
										if (isIE == true) {
											var ev_result = data.childNodes[0].lastChild.childNodes[1].textContent;
											var ev_error = data.childNodes[0].lastChild.childNodes[0].textContent;
										} else {
											var ev_result = data.getElementsByTagName("entry")[0].children[6].children[1].innerHTML;
											var ev_error = data.getElementsByTagName("entry")[0].children[6].children[0].innerHTML;
										}

										// Success  
										var valSuccessArray = ev_result.split("//");
										var itemsArray = [];
										for (var i = 0; i < valSuccessArray.length; i++) {
											var splitVal = valSuccessArray[i].split(",");
											var items = {
												product: splitVal[0],
												productname: splitVal[1],
												uom: splitVal[2]

											};
											itemsArray.push(items);
										}

										function removeDuplicates(originalArray, prop) {
											var newArray = [];
											var lookupObject = {};

											for (var i in originalArray) {
												lookupObject[originalArray[i][prop]] = originalArray[i];
											}

											for (i in lookupObject) {
												newArray.push(lookupObject[i]);
											}
											return newArray;
										}

										var itemsSuccessArray = removeDuplicates(itemsArray, "product");

										for (var k = 0; k < itemsSuccessArray.length; k++) {
											var countK = k + 1
											var prodcnt = "0000000" + countK;
											prodcnt = prodcnt.substring(prodcnt.length - 8);
											itemsSuccessArray[k].prodno = prodcnt;
										}

										var jsonModel = new sap.ui.model.json.JSONModel(itemsSuccessArray);
										sap.ui.getCore().setModel(jsonModel, 'successModel');
										that.getView().byId("idTable").setModel(jsonModel);
										// Error  
										that._oBusyDialog.close();
									},
									error: function (data) {
										sap.m.MessageToast.show("Error");
										that._oBusyDialog.close();
									}
								});
							}
						});
					}
				} catch (oException) {
					jQuery.sap.log.error("File upload failed:\n" + oException.message);
				}
			},

			handleUploadComplete: function (c) {
				if (RSO_MSO_controller.getView().byId("RSO_PRC_Eligilibity").getText() === "YES") {
					//alert("MEDHAT Yes");
					RSO_MSO_controller.getView().getModel("mainservices").callFunction("/Price_Protection_Ownership_Doc", {
						method: "POST",
						urlParameters: {
							ZzsoReqNo: zrequest,
							OwnerShip: 'X'
						}, // function import parameters
						success: function (oData, response) {
							if (oData.Type == 'E') {
								// var oBundle = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oData.Message;

							} else {
								var sMsg = oData.Message;

							}

						},
						error: function (oError) {

						}
					});
				}
				sap.m.MessageBox.show(RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("FileUploaded") + zrequest, sap.m
					.MessageBox
					.Icon.SUCCESS, RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("TitleSuccess"), sap
					.m.MessageBox.Action.OK, null, null);
				RSO_MSO_controller.getView().getModel('mainservices').refresh(true);
				// RSO_MSO_controller.getView().byId('idRSOV_MSO_fileUpl').setValue('');
				RSO_MSO_controller.getView().byId('idComments_TA_RSO_ManageSO').setValue('');
				c.getSource().setValue("");

			},
			getControllerInstance: function () {
				var _ = null;
				return _;

			},
			Xml2Json: function (n) {
				var a = {},
					t = RSO_MSO_controller;
				var A = function (e, v) {
					if (a[e]) {
						if (a[e].constructor !== Array) {
							a[e] = [a[e]];
						}
						a[e][a[e].length] = v;
					} else {
						a[e] = v;
					}
				};
				var c, b;
				for (c = 0; c < n.attributes.length; c++) {
					b = n.attributes[c];
					A(b.name, b.value);
				}
				for (c = 0; c < n.childNodes.length; c++) {
					b = n.childNodes[c];
					if (b.nodeType === 1) {
						if (b.childNodes.length === 1 && b.firstChild.nodeType === 3) {
							A(b.nodeName, b.firstChild.nodeValue);
						} else {
							A(b.nodeName, t.Xml2Json(b));
						}
					}
				}
				return a;
			},
			onNavBack: function (Oevent) {

				if (ppdFlages) {
					if (ppdFlages.getData().openCommentBox == 'X') {
						ppdFlages.getData().openCommentBox = '';
						sap.ui.getCore().setModel(ppdFlages, "ppdFlages");
						RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer", {
							refresh: false
						});
					} else {
						RSO_MSO_controller.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary", {
							refresh: false
						});
					}
				} else if (RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/pageArg") == "F") {
					RSO_MSO_controller.getOwnerComponent().getRouter().navTo("FleetSoldOrderDetails", {
						refresh: false
					});
				} else {
					//window.history.go(-1);
					RSO_MSO_controller.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary", {
						refresh: false
					});
				}
			},
			//---------------------------------------
			//--------Handling Filter---------------
			//----------------------------------
			series_selected: function (oEvent) {

				// var year = this.getView().byId('modelYr_RSOA').getValue();
				// items="{ path: 'oModel3>/'}"

				var modelkey = RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/Zzmodel");
				this.getView().byId('model_CSOR').setSelectedKey(modelkey);
				if (this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries') && this.getView().getElementBinding(
						'mainservices').getBoundContext().getProperty('Zzmoyr')) {
					var series = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
					var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
					modelkey = RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/Zzmodel");
					// var language = RSO_MSO_controller.returnBrowserLanguage();
					var model;
					if (language === "FR") {
						model =
							"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

					} else {
						model =
							"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

					}
					var dealerno = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzdealerCode');
					var dealer = dealerno.slice(-5);
					//this.getView().getModel('mainservices')._refresh;
					this.getView().byId('model_CSOR').bindItems({
						path: "mainservices>/ZVMS_Model_EXCLSet",
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),

							new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, modelkey),
							new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
							new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
							new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
						], true),
						template: new sap.ui.core.ListItem({
							key: "{mainservices>model}",
							text: model
						})
					});
				}
			},
			model_selected: function (oEvent) {
				var pathAB = "";
				// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
				var model = this.getView().byId('model_CSOR').getSelectedKey();
				var suffix = this.getView().byId('suffix_CSOR').getSelectedKey();
				if (!suffix) {
					this.getView().byId('suffix_CSOR').setSelectedKey(RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty(
						"/zzSuffix"));
				}

				// var language = RSO_MSO_controller.returnBrowserLanguage();
				var suf;
				if (language === "FR") {
					suf =
						"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

				} else {
					suf =
						"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

				}
				// var dealer = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

				if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr')) {
					var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
					var dealerno = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzdealerCode');
					var dealer = dealerno.slice(-5);

					// if (AppController.RSOB == true) {
					// 	 pathAB = "mainservices>/ZVMS_SUFFIX_PIPLINE";
					// }
					// else 
					if (this.RSOA == true) {
						pathAB = "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "',typ='R')/Set";
						//mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "')/Set";
					} else {
						pathAB = "mainservices>/ZVMS_SUFFIX_PIPLINE";
					}
					//this.getView().getModel('mainservices')._refresh;
					this.getView().byId('suffix_CSOR').bindItems({
						path: pathAB, //"mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "')/Set",
						filters: new sap.ui.model.Filter([
							new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
							new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
							new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix)
						], true),
						template: new sap.ui.core.ListItem({
							key: "{mainservices>suffix}",
							text: suf
						})
					});
				}

			},
			suffix_selected: function (oEvent) {
				//-----------------
				//----APX---------
				//----------------
				//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
				let suffix = RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/zzSuffix");
				let extcolor = RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/Zzextcol");
				if (suffix != "XX" && suffix != "") {
					this.getView().byId('suffix_CSOR').setSelectedKey(suffix);
					this.getView().byId('colour_CSOR').setSelectedKey(extcolor);
				} else {
					this.getView().byId('colour_CSOR').setSelectedKey('');
				}

				this.getView().byId('apx_CSOR').setSelectedKey(RSO_MSO_controller.getOwnerComponent().getModel("LocalDataModel").getProperty(
					"/Zzapx"));

				var model = this.getView().byId('model_CSOR').getSelectedKey();
				if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr') && suffix) {
					var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
					// this.getOwnerComponent().getModel('mainservices').refresh();
					// this.getOwnerComponent().getModel("mainservices").updateBindings();
					this.getView().byId('apx_CSOR').bindItems({
						path: 'mainservices>/ZVMS_CDS_APX',
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
							new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
							new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
						], true),
						template: new sap.ui.core.ListItem({
							key: "{mainservices>zzapx}",
							text: "{mainservices>zzapx}"
						})
					});
					var color;
					// var language = RSO_MSO_controller.returnBrowserLanguage();
					if (language === "FR") {
						color = "{mainservices>ext}/{mainservices>mktg_desc_fr}";
					} else {
						color = "{mainservices>ext}/{mainservices>mktg_desc_en}";
					}
					//this.getView().getModel('mainservices')._refresh;
					this.getView().byId('colour_CSOR').bindItems({
						path: 'mainservices>/ZVMS_CDS_Colour',
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
							new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix),
							new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
							new sap.ui.model.Filter("ext", sap.ui.model.FilterOperator.EQ, extcolor)
						], true),
						template: new sap.ui.core.ListItem({
							key: "{mainservices>ext}",
							text: color
						})
					});
				}
			},
			_handleServiceSuffix_Series: function () {
				var host = RSO_MSO_controller.host();

				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?$format=json";
				$.ajax({
					url: oUrl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(data.d.results);
						RSO_MSO_controller.getView().setModel(oModel, "seriesModel");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");

						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			},
			onExit: function () {
				SelectVehicleOption = false;
				sap.ui.getCore().getModel('ModelCore').getData().ZZVTN = "";
				//sap.ui.getCore().getModel('ModelCore').updateBindings();
			},
			//changes by swetha for DMND0003239 added fragment on click of Link RDR VIN button on 19th Sept, 2023-----Start
			_onlinkrdrvin: function (oEvent) {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.LinkRDRVIN", this);
					this.getView().addDependent(this._oDialog);
				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				sap.ui.getCore().byId("rdrvin").setValue('');
				var Zlinkrdrvin = sap.ui.getCore().byId("rdrvin").getValue(); //changes by swetha for DMND0003239 for VIN validation
				if (Zlinkrdrvin != "") {
					sap.ui.getCore().byId("idrdr_date").setVisible(true);
					sap.ui.getCore().byId("idrdrcustname").setVisible(true);
					sap.ui.getCore().byId("iderrmsg").setVisible(true);	
				} else {
					sap.ui.getCore().byId("idrdr_date").setVisible(false);
					sap.ui.getCore().byId("idrdrcustname").setVisible(false);
					sap.ui.getCore().byId("iderrmsg").setVisible(false);	
				}
				this._oDialog.open();
				//	var oDialogBox = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.LinkRDRVIN", this);
				//	this.getView().addDependent(oDialogBox);
				//	oDialogBox.open();
			},
			//changes by swetha for DMND0003239 added fragment on click of Link RDR VIN button on 19th Sept, 2023-----End
			//changes by swetha for DMND0003239 to close the Dialog on 19th Sept, 2023-----Start
			onCloseDialog: function (oEvent) {
				this._oDialog.close();
			},
			//changes by swetha for DMND0003239 to close the Dialog on 19th Sept, 2023-----End
			//changes by swetha for DMND0003239 for Credit Simulation Screen on 23rd Sept, 2023-----Start
			_simulateprice: function () {
				var host = RSO_MSO_controller.host();
				var zrequest = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzsoReqNo');
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Simulate_PriceSet?$filter=(ZZSO_REQ_NO eq '" + zrequest + "')";
				var that = this;
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(data.d);
						sap.ui.getCore().setModel(oModel, "SimulatePriceModel");
						// that.getView().setModel(oModel, "SimulatePriceModel");
						RSO_MSO_controller.getView().setModel(oModel, "SimulatePriceModel");

					},
					error: function (jqXHR, textStatus, errorThrown) {
						var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");

						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
				if (!this._soDialog) {

					this._soDialog = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.CreditSimulation", this);
					this.getView().addDependent(this._soDialog);
				}
				// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._soDialog);
				this._soDialog.open();
				//changes by swetha for DMND0003239 for Vehicle Wholesale date field
				if (RSO_MSO_controller.getView().getModel("SimulatePriceModel").getData().results[0].WHOLESALE_DATE_FLAG == "W") {
					sap.ui.getCore().byId("idWhoDate").setVisible(true);
					sap.ui.getCore().byId("idSimulationDate").setVisible(false);
				} else {
					sap.ui.getCore().byId("idSimulationDate").setVisible(true);
					sap.ui.getCore().byId("idWhoDate").setVisible(false);
				}

			},
			//changes by swetha for DMND0003239 for Credit Simulation Screen on 23rd Sept, 2023-----End
			//changes by swetha for DMND0003239 for Credit Simulation Screen  Close Dialog on 23rd Sept, 2023-----Start
			onCloseSDialog: function (oEvent) {
				this._soDialog.close();
			},
			//changes by swetha for DMND0003239 for Credit Simulation Screen CLose Dialog on 23rd Sept, 2023-----End
			//changes by swetha for DMND0003239 added fragment on click of Link RDR VIN button on 2nd Oct, 2023-----Start
			_validateVIN: function () {
				var that = this;
				var host = RSO_MSO_controller.host();
				var Zlinkrdrvin = sap.ui.getCore().byId("rdrvin").getValue(); //changes by swetha for DMND0003239 for VIN validation
				var Zseries = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
				var ZModel_Year = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				var ZDealercode =  this.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzdealerCode');
				var token = RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken();
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Vin_ValidationSet?$filter=(VHVIN eq '" + Zlinkrdrvin +"' and SERIES eq '" +Zseries + "' and MODEL_YEAR eq '" +ZModel_Year+ "' and SO_DEALER eq '" +ZDealercode+ "')" ;
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(data.d);
						sap.ui.getCore().setModel(oModel, "LinkRDRModel");
						RSO_MSO_controller.getView().setModel(oModel, "LinkRDRModel");
						var msg = RSO_MSO_controller.getView().getModel("LinkRDRModel").getData().results[0].MESSAGE;
						if (Zlinkrdrvin !="" && RSO_MSO_controller.getView().getModel("LinkRDRModel").getData().results[0].MSG_FLAG == "E") {
							sap.m.MessageToast.show(msg);
							sap.ui.getCore().byId("rdrvin").setValueState("None");	
							sap.ui.getCore().byId("idrdr_date").setVisible(false);
							sap.ui.getCore().byId("idrdrcustname").setVisible(false);
							sap.ui.getCore().byId("iderrmsg").setVisible(false);
							sap.ui.getCore().byId("idconfirm").setVisible(false);
							sap.ui.getCore().byId("idYesNo").setVisible(false);
						} else if(Zlinkrdrvin !="" && RSO_MSO_controller.getView().getModel("LinkRDRModel").getData().results[0].MSG_FLAG == "S") {
							sap.ui.getCore().byId("rdrvin").setValueState("None");	
							sap.ui.getCore().byId("idrdr_date").setVisible(true);
							sap.ui.getCore().byId("idrdrcustname").setVisible(true);
							sap.ui.getCore().byId("iderrmsg").setVisible(true);	
							sap.ui.getCore().byId("idconfirm").setVisible(true);
							sap.ui.getCore().byId("idYesNo").setVisible(true);
						} else {
							sap.ui.getCore().byId("rdrvin").setValueState("Error");	
							sap.ui.getCore().byId("idrdr_date").setVisible(false);
							sap.ui.getCore().byId("idrdrcustname").setVisible(false);
							sap.ui.getCore().byId("iderrmsg").setVisible(false);
							sap.ui.getCore().byId("idconfirm").setVisible(false);
							sap.ui.getCore().byId("idYesNo").setVisible(false);
						}
						
					},
					error: function (oError) {

					}
				});
			},
			onclickYes: function(){
				var Zlinkrdrvin = sap.ui.getCore().byId("rdrvin").getValue();
				var zrequest = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzsoReqNo');
				var token = RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken();
				var oUrl = RSO_MSO_controller.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/Vin_ValidationSet?$filter=(VHVIN '" + Zlinkrdrvin +"' and SO_NUMBER eq '" +zrequest+ "')";
				$.ajax({
					url: oUrl,
					headers: {
						accept: 'application/json',
						'content-type': 'application/json'
					},
					type: "POST",
					dataType: "json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('X-CSRF-Token', token);
						xhr.setRequestHeader('Content-Type', "application/json");

					},
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(data.d);
						sap.ui.getCore().setModel(oModel, "ClickYesModel");
						RSO_MSO_controller.getView().setModel(oModel, "ClickYesModel");	
					},
					error: function (oError) {
						var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
							sap.m.MessageBox.Action.OK, null, null);
					}

				});	
			},
			//changes by Swetha for DMND0003239 added fragment on click of Link RDR VIN button on 2nd Oct, 2023-----End
		});
	});