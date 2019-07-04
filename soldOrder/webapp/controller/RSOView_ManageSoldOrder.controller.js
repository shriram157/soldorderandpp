sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, Filter, FilterOperator, JSONModel) {
	"use strict";
	var RSO_MSO_controller;
	var zrequest;
	var ppdFlages;
	var zcustomerModel, zinventoryModel;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RSOView_ManageSoldOrder", {
		formatter: formatter,

		onInit: function (OEvent) {
			RSO_MSO_controller = this;
			RSO_MSO_controller.getBrowserLanguage();
			RSO_MSO_controller._handleServiceSuffix_Series();
			RSO_MSO_controller._oBusyDialog = new sap.m.BusyDialog();
			zcustomerModel = new JSONModel({});
			zinventoryModel = new JSONModel({});
			this.getView().setModel(zcustomerModel, 'Customer');
			this.getView().setModel(zinventoryModel, 'Inventory');
			this.getOwnerComponent().getRouter().getRoute("RSOView_ManageSoldOrder").attachPatternMatched(this._getattachRouteMatched, this);
			var language = RSO_MSO_controller.returnBrowserLanguage();

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
						"text": "ENCAISSER"
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
			this.getView().setModel(sap.ui.getCore().getModel("salesTypeModel"), "salesTypeModel");
			console.log(sap.ui.getCore().getModel("salesTypeModel"));

		},
		_getattachRouteMatched: function (parameters) {
			var requestid = parameters.getParameters().arguments.Soreq;
			RSO_MSO_controller.getSO(requestid);
		},
		getSO: function (req) {
			//"""""""""""""""""""""""""""""""""""""""
			//Medhat

			ppdFlages = sap.ui.getCore().getModel("ppdFlages");
			if (ppdFlages) {
				if (ppdFlages.getData().openCommentBox == 'X') {
					RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").setEnabled(true);
					RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").setVisible(true);
				}
			}
			var user = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			// var status = this.getView().getModel('mainservices').getData().ZzsoStatus;
			if (user == "Dealer_User") //&& status !="Cancelled"
			{
				RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEditable(true);
				RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEnabled(true);

			}

			//"""""""""""""""""""""""""""""""""""""""
			var host = RSO_MSO_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//attachPatternMatched

			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet('" + req + "')";
			zrequest = req;
			var zmodel = RSO_MSO_controller.getView().getModel("mainservices");
			var sObjectPath = "/Retail_Sold_OrderSet('" + req + "')";
			var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
			var sMsg = oBundle.getText("mangSoldOrder", [req]);
			RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg);
			zmodel.refresh();
			this.getView().bindElement({

				path: sObjectPath,
				model: "mainservices",
				events: {
					change: function (oEvent) {
						RSO_MSO_controller.getView().getElementBinding('mainservices').refresh();
						// Filter for Display Data Sold Order
						sap.ui.getCore().setModel(new JSONModel({
							model: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel'),
							modelyear: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr'),
							suffix: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix'),
							color: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol'),
							series: RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries')
						}), 'Vehicle_Selection');
						//Filter Data Sold Order
						RSO_MSO_controller.series_selected();
						RSO_MSO_controller.model_selected();
						RSO_MSO_controller.suffix_selected();
						// // Model
						// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel')) {
						// 	var model = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel');
						// 	var model_CSOR_items = RSO_MSO_controller.getView().byId("model_CSOR").getBinding("items");
						// 	model_CSOR_items.filter([new Filter("model", FilterOperator.EQ, model)]);
						// }
						// // Suffix
						// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix')) {
						// 	var suffix = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix');
						// 	var suffix_CSOR_items = RSO_MSO_controller.getView().byId("suffix_CSOR").getBinding("items");
						// 	suffix_CSOR_items.filter([new Filter("Suffix", FilterOperator.EQ, suffix)]);
						// }
						// // APX
						// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzapx')) {
						// 	var apx = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzapx');
						// 	var apx_CSOR_items = RSO_MSO_controller.getView().byId("apx_CSOR").getBinding("items");
						// 	apx_CSOR_items.filter([new Filter("zzapx", FilterOperator.EQ, apx)]);
						// }
						// // Color
						// if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol')) {
						// 	var color = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol');
						// 	var color_CSOR_items = RSO_MSO_controller.getView().byId("colour_CSOR").getBinding("items");
						// 	color_CSOR_items.filter([new Filter("ExteriorColorCode", FilterOperator.EQ, color)]);
						// }
						//----------------------------------------------------------
						// Get Customer Details by Customer No From API
						//	var x = 'W27687139';
						//----------------------------------------------------------
						var status = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzsoStatus');

						if (status === "Cancelled") {
							RSO_MSO_controller.getView().byId("btn_update").setEnabled(false);
							RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setEnabled(false);
							RSO_MSO_controller.getView().byId("btn_orderChange_RSO_MSO").setEnabled(false);
							RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(false);
							RSO_MSO_controller.getView().byId("btn_addAttach_RSO_MSO").setEnabled(false);
							RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").setEnabled(false);
							RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEnabled(false);
						}
						// var vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();
						// var dealer_no = this .getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;

						if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzvtn')) {
							var zvtn = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzvtn');
							var url = host + "/ZVMS_SOLD_ORDER_SRV/InventoryDetailsSet?$filter=(ZZVTN eq " + zvtn + ")";
							$.ajax({
								url: url,
								headers: {
									accept: 'application/json'
										// 'x-ibm-client-secret': 'Q7gP8pI0gU5eF8wM2jQ3gB8pQ5mA8rP8nO5dR1iY8qW2kS0wA0',
										// 'x-ibm-client-id': 'd4d033d5-c49e-4394-b3e3-42564296ec65'
								},
								type: "GET",
								dataType: "json",
								// data: soapMessage,
								contentType: "text/xml; charset=\"utf-8\"",
								success: function (data, textStatus, jqXHR) {

									zinventoryModel.setData(data.results);

								},
								error: function (request, errorText, errorCode) {}
							});
							// this.getView().byId('idETAFrm').bindItems({
							// 				path: 'mainservices>/InventoryDetailsSet',
							// 			// 	filters: new sap.ui.model.Filter([
							// 			// new Filter("MATRIX", FilterOperator.EQ, "A205"),
							// 			// 	new Filter("Dealer", FilterOperator.EQ, dealer_no),
							// 			// 	new Filter("Model", FilterOperator.EQ, vehicle.model),
							// 			// 	new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
							// 			// 	new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
							// 			// 	new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color),
							// 			// 	// new Filter("INTCOL", FilterOperator.EQ, "42")
							// 			// 	new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
							// 			// 	new Filter("RSO_NUM", FilterOperator.EQ, zrequest),

							// 			// 	// new Filter("ETA", FilterOperator.EQ, ""),
							// 			// 	// new Filter("APX", FilterOperator.EQ, ""),
							// 			// ], true),
							// 				template: new sap.ui.core.ListItem({
							// 					key: "{mainservices>ETAFrom}",
							// 					text: "{mainservices>ETAFrom}"
							// 				})
							// 			});

							// var vechile_items = RSO_MSO_controller.getView().byId("table_RSOVehicleDealer").getBinding('rows');
							// var dealer_no = this .getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
							//Dealer Inventory
							// var	vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();

							// vechile_items.filter([new Filter([
							// new Filter("MATRIX", FilterOperator.EQ, "A205"),
							// 	new Filter("Dealer", FilterOperator.EQ, dealer_no),
							// 	new Filter("Model", FilterOperator.EQ, vehicle.model),
							// 	new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
							// 	new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
							// 	new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color),
							// 	// new Filter("INTCOL", FilterOperator.EQ, "42")
							// 	new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
							// 	new Filter("RSO_NUM", FilterOperator.EQ, zrequest),

							// 	// new Filter("ETA", FilterOperator.EQ, ""),
							// 	// new Filter("APX", FilterOperator.EQ, ""),
							// ], true)]);

						}
						if (RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu')) {
							var zcustomerNumber = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu');
							var regFlag = RSO_MSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('CustAtReg');

							var url = "/node/tci/internal/api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber;
							//?customerNumber=" +
							// if(regFlag === "X")
							// {
							$.ajax({
								url: url,
								headers: {
									accept: 'application/json'
										// 'x-ibm-client-secret': 'Q7gP8pI0gU5eF8wM2jQ3gB8pQ5mA8rP8nO5dR1iY8qW2kS0wA0',
										// 'x-ibm-client-id': 'd4d033d5-c49e-4394-b3e3-42564296ec65'
								},
								type: "GET",
								dataType: "json",
								// data: soapMessage,
								contentType: "text/xml; charset=\"utf-8\"",
								success: function (data, textStatus, jqXHR) {
									if (data.customer) {
										zcustomerModel.setData(data.customer);
									}
								},
								error: function (request, errorText, errorCode) {}
							});

						}
					},
					dataReceived: function (oData) {
						//filteration
						// if (oData.getParameters().data.Zzmodel) {
						// 	var model_CSOR_items = RSO_MSO_controller.getView().byId("model_CSOR").getBinding("items");
						// 	model_CSOR_items.filter([new Filter("model", FilterOperator.EQ, oData.getParameters().data.Zzmodel)]);
						// }
					}
				}
			});
			// zmodel.read("/Retail_Sold_OrderSet('" + req + "')", {
			// 	success: function (data) {
			// 		//	console.log(data.d.results[0]);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data);
			// 		RSO_MSO_controller.getView().setModel(oModel, "RSO_MSO_Model");

			// 		var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
			// 		var sRecipient = data.ZzsoReqNo;
			// 		var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
			// 		RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg);
			// 	},
			// 	error: function (data) {
			// 		sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
			//-------------old scenario-----------------
			// $.ajax({
			// 	type: 'GET',
			// 	url: oURL,
			// 	dataType: "json",
			// 	cache: false,
			// 	success: function (data) {
			// 	//	console.log(data.d.results[0]);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data.d);
			// 		RSO_MSO_controller.getView().setModel(oModel, "RSO_MSO_Model");

			// 		var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
			// 		var sRecipient = data.d.ZzsoReqNo;
			// 		var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
			// 		RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg);
			// 	},
			// 	error: function (data) {
			// 		sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}

			// });
		},
		onAfterRendering: function () {
			/*	var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
				//var sRecipient = "S09732984"; // RSO_MSO_controller.getView().getModel().getProperty("/recipient/name");
					var sRecipient =RSO_MSO_controller.getView().getModel("RSO_MSO_Model").getData()[0].ZzsoReqNo;
					console.log(sRecipient);
				var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
				RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg);*/

			// if (AppController.flagOrderingDealer == true) {
			// 	RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEnabled(true);
			// 	//RSO_MSO_controller.getView().byId("idRSOV_MSO_delButton").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("idRSOV_MSO_fileUpl").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("btn_addAttach_RSO_MSO").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("btn_orderChange_RSO_MSO").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(true);
			// 	var oTbl = RSO_MSO_controller.getView().byId("table_RSOViewManageSO");
			// 	var data = oTbl.getModel().getData().ProductCollection;
			// 	var len = data.length;
			// 	// for (var i = 0; i < len; i++) {
			// 	// 	var Id = "idRSOV_MSO_delButton-__clone" + (i * 3);

			// 	// 	RSO_MSO_controller.getView().byId(Id).setEnabled(true);
			// 	// }
			// }
			// if (AppController.flagNationalUser == true) {
			// 	RSO_MSO_controller.getView().byId("RSOV_MSO_comment2").setEnabled(true);
			// }
			// if (AppController.flagPPDUser == true) {
			// 	RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").setEnabled(true);
			// }
			// if (AppController.flagNationalPPDUser == true) {
			// 	RSO_MSO_controller.getView().byId("btn_ApprPriceProt_RSO_MSO").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("btn_ApprPriceProt_RSO_MSO").setVisible(true);
			// 	RSO_MSO_controller.getView().byId("btn_RejPriceProt_RSO_MSO").setEnabled(true);
			// 	RSO_MSO_controller.getView().byId("btn_RejPriceProt_RSO_MSO").setVisible(true);
			// }
			// if (AppController.flagSIPUser == true) {
			// 	RSO_MSO_controller.getView().byId("btn_AuditComp_RSO_MSO").setVisible(true);
			// }
			// if (AppController.flgSoldOrderReqStatus = "In Progress") {
			// 	RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setVisible(true);
			// }
			// if (AppController.flgSoldOrderReqStatus = "Audit - In Progress") {
			// 	RSO_MSO_controller.getView().byId("btn_AuditComp_RSO_MSO").setEnabled(true);
			// }
			// if (AppController.flgPriceProtectionStatus = "In Progress") {
			// 	RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setVisible(true);
			// }

		},

		_updateSoldOrderRequest: function () {
			var comment = RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").getValue();
			// var suffix = this.getView().byId('suffix_CSOR').getSelectedKey();

			// var model = this.getView().byId('model_CSOR').getSelectedKey();
			// var moyr = this.getView().byId('moyr_CSOR').getValue();
			// var color = this.getView().byId('colour_CSOR').getSelectedKey();
			// var apx = this.getView().byId('apx_CSOR').getSelectedKey();
			// var eligible = this.getView().byId('RSO_PRC_Eligilibity').getValue();
			// var series = this.getView().byId('series_CSOR').getSelectedKey();
			var _data = {

				// "Eligilibity" : eligible,

				// "Zzmodel" : model,

				// "Zzmoyr" : moyr,

				// "Zzsuffix" : suffix,
				//"Zzseries" : series,
				// "Zzextcol" : color,
				// "Zzapx" : apx,

				"Comment": comment,
				"ZzsoReqNo": zrequest
					// "Zzmodel" : model,
					// "Zzmoyr" : moyr,
					// 			"Zzsuffix" : suffix,
					// "Zzextcol" : color,
					// "Zzapx" : apx,

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
					console.log(oData);
				},
				error: function (oError) {
					console.log(oError);

				}
			});
			// window.location.reload();
		},

		_updateAuditSoldOrderRequest: function () {
			RSO_MSO_controller.getView().getModel('mainservices').callFunction("/Update_Audit_Status", {
				method: "POST",
				urlParameters: {
					ZZ_AUDIT_STATUS: 'COMPLETE',
					ZzsoReqNo: zrequest
				}, // function import parameters
				success: function (oData, response) {

				},
				error: function (oError) {

				}
			});
			// AppController.flgSoldOrderReqStatus = "Audit - Complete";
		},

		_approvePriceProtectionDetails: function () {
			if (RSO_MSO_controller.getView().byId("RSO_PRC_Eligilibity").getText() === "YES") {
				//alert("MEDHAT Yes");
				// RSO_MSO_controller.getView().getModel("mainservices").callFunction("/Price_Protection_Ownership_Doc", {
				// 					method: "POST",
				// 					urlParameters: {
				// 						ZzsoReqNo: zrequest,
				// 						OwnerShip: "X"
				// 					}, // function import parameters
				// 					success: function (oData, response) {
				// 						if (oData.Type == 'E') {
				// 							// var oBundle = VehSel_DealerInv_controller.getView().getModel("i18n").getResourceBundle();
				// 							var sMsg = oData.Message;
				// 							//	sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "ERROR", sap.m.MessageBox.Action.OK, null, null);

				// 							// sap.m.MessageBox.show(sMsg, {
				// 							// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 							// 	title: "ERROR",
				// 							// 	actions: [sap.m.MessageBox.Action.OK],
				// 							// 	onClose: function (oAction) {
				// 							// 		// RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");

				// 							// 	}
				// 							// });

				// 						} else {
				// 							var sMsg = oData.Message;
				// 							// sap.m.MessageBox.show(sMsg, {
				// 							// 	icon: sap.m.MessageBox.Icon.SUCCESS,
				// 							// 	title: "SUCCESS",
				// 							// 	actions: [sap.m.MessageBox.Action.OK],
				// 							// 	onClose: function (oAction) {
				// 							// 		RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");
				// 							// 	}
				// 							// });

				// 							// sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "SUCCESS", sap
				// 							// 	.m.MessageBox.Action.OK, null, null);

				// 							// RSO_MSO_controller.getOwnerComponent().getRouter().navTo("ToPriceProtectionSummary", {}, true);
				// 						}

				// 					},
				// 					error: function (oError) {

				// 					}
				// },
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
							var sMsg = oData.Message;
							sap.m.MessageBox.show(sMsg, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "SUCCESS",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oAction) {
									RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");
								}
							});

							// sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "SUCCESS", sap
							// 	.m.MessageBox.Action.OK, null, null);

							// RSO_MSO_controller.getOwnerComponent().getRouter().navTo("ToPriceProtectionSummary", {}, true);
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
						var sMsg = oData.Message;

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
			RSO_MSO_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_DealerInventory", {
				Soreq: zrequest
			}, true);
			// Hashed for test first scenario Select from Inventory	
			// if (RSO_MSO_controller.flagOrderingDealer === true) {

			// 	RSO_MSO_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_DealerInventory", {}, true); //page5 
			// }
			// if (RSO_MSO_controller.flagNationalSIPUser === true) {
			// 	RSO_MSO_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_NationalStock", {}, true); //page6  
			// }
			// var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorVeh");
			// var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title2");
			// var icon = new sap.ui.core.Icon({
			// 	src: "sap-icon://alert",
			// 	size: "2rem"
			// });
			// var msg = new sap.m.HBox({
			// 	items: [icon, new sap.m.Text({
			// 		text: errMsg
			// 	})]
			// });
			// sap.m.MessageBox.show(msg, {
			// 	title: title,
			// 	actions: sap.m.MessageBox.Action.OK,
			// 	onClose: null,
			// 	styleClass: "",
			// 	initialFocus: null,
			// 	textDirection: sap.ui.core.TextDirection.Inherit,
			// 	contentWidth: "10rem"
			// });
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
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// var model = oTable.getModel();
			// var data = model.getProperty("/AttachmentSet");
			RSO_MSO_controller.getView().getModel('mainservices').remove(sPath, {
				success: function (data, oResponse) {
					// data.splice(index, 1);
					// model.setProperty("/AttachmentSet", data);
					oTable.getModel('mainservices').refresh();
					//RSO_MSO_controller.getView().getModel('mainservices').refresh(true);
				},
				error: function (oData, oResponse) {
					sap.m.MessageBox.show("Error Remove File. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap.m
						.MessageBox.Action.OK, null, null);
				}
			});

		},

		_openFile: function (oEvent) {
			// var fileUrl = "https://google.com";
			// parent.window.open(fileUrl, '_blank');
		},

		_addAttachment: function () {
			var com = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").getValue();
			var textArea = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO");
			// if (com == "") {
			// 	textArea.setValueState("Error");
			// 	textArea.setValueStateText("Fill the comments");
			// 	var errForm = formatter.formatErrorType("SO000012");
			// 	var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
			// 	sap.m.MessageBox.show(errMsg, sap
			// 		.m.MessageBox.Icon.ERROR, "Error", sap
			// 		.m.MessageBox.Action.OK, null, null);
			// } else {
			// AppController.flgOwnershipUploaded = true;
			var oFileUploader = RSO_MSO_controller.getView().byId("idRSOV_MSO_fileUpl");
			var zcomment = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO");
			oFileUploader.removeAllHeaderParameters();
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: oFileUploader.getValue() + "," + zcomment.getValue()
			}));

			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: RSO_MSO_controller.getView().getModel('mainservices').getSecurityToken()
			}));

			oFileUploader.setSendXHR(true);
			oFileUploader.upload();

			// }
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
		/*	uploadFile2: function () {
				var file = jQuery.sap.domById("__xmlview2– fileupload - fu").files[0];
				try {
					if (file) {
						RSO_MSO_controller._bUploading = true;
						var that = RSO_MSO_controller;
					
						var a = “/Yourservice URL or Metadata URL “;
						var f = {
							headers: {“
								X - Requested - With”: “XMLHttpRequest”,
								“Content - Type”: “application / atom + xml”,
								DataServiceVersion: “2.0”,
								“X - CSRF - Token”: “Fetch”
							},
							requestUri: a,
							method: “GET”
						};
						var oHeaders;
						var sUrl = oDataModel.sServiceUrl + “/Your Entity Set “;
						var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
						sap.ui.getCore().setModel(oModel);
						OData.request(f, function (data, oSuccess) {
							oToken = oSuccess.headers[‘x - csrf - token’];
							oHeaders = {“
								x - csrf - token”: oToken,
								“slug”: “QF”,
							};
							//To Fetch CSRF Token To Upload File
							

							var oURL = oDataModel.sServiceUrl + “/Entity Set”;
							jQuery.ajax({
								type: ‘POST’,
								url: oURL,
								headers: oHeaders,
								cache: false,
								contentType: file.type,
								processData: false,
								data: file,
								success: function (data) {
									var rec = data.getElementsByTagName(“entry”)[0].children[5].getAttribute(“src”);
									sap.m.MessageToast.show(“File Uploaded Successfully” + rec);
								},
								error: function (data) {
									sap.m.MessageToast.show(“File Uploaded Successfully”);
								}
							});
						});
					}
				} catch (oException) {
					jQuery.sap.log.error(“File upload failed: \n” + oException.message);
				}
			},*/

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
							//	sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "ERROR", sap.m.MessageBox.Action.OK, null, null);

							// sap.m.MessageBox.show(sMsg, {
							// 	icon: sap.m.MessageBox.Icon.ERROR,
							// 	title: "ERROR",
							// 	actions: [sap.m.MessageBox.Action.OK],
							// 	onClose: function (oAction) {
							// 		// RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");

							// 	}
							// });

						} else {
							var sMsg = oData.Message;
							// sap.m.MessageBox.show(sMsg, {
							// 	icon: sap.m.MessageBox.Icon.SUCCESS,
							// 	title: "SUCCESS",
							// 	actions: [sap.m.MessageBox.Action.OK],
							// 	onClose: function (oAction) {
							// 		RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer");
							// 	}
							// });

							// sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "SUCCESS", sap
							// 	.m.MessageBox.Action.OK, null, null);

							// RSO_MSO_controller.getOwnerComponent().getRouter().navTo("ToPriceProtectionSummary", {}, true);
						}

					},
					error: function (oError) {

					}
				});
			}
			sap.m.MessageBox.show(RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("FileUploaded") + zrequest, sap.m.MessageBox
				.Icon.SUCCESS, RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("TitleSuccess"), sap
				.m.MessageBox.Action.OK, null, null);
			RSO_MSO_controller.getView().getModel('mainservices').refresh(true);
			// RSO_MSO_controller.getView().byId('idRSOV_MSO_fileUpl').setValue('');
			RSO_MSO_controller.getView().byId('idComments_TA_RSO_ManageSO').setValue('');
			// var _ = RSO_MSO_controller.getControllerInstance();
			// var p = c.getParameters();
			// if (parseInt(p.status, 10) >= 400) {
			// 	var X = jQuery.parseXML(p.responseRaw);
			// 	var e = RSO_MSO_controller.Xml2Json(X.documentElement);
			// 	// var s = {
			// 	// 	message: e.message,
			// 	// 	type: sap.m.MessageBox.Icon.ERROR
			// 	// };
			// 	// sap.ca.ui.message.showMessageBox(s);
			// 		sap.m.MessageBox.show(e.message, sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// }
			//	RSO_MSO_controller.onSubmitLRCsuccess(_.objectResponse, _.ResponseMessage);
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
					RSO_MSO_controller.getOwnerComponent().getRouter().navTo("PriceProtectionDetails_Dealer", {}, true);
				} else {
					RSO_MSO_controller.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary", {}, true);
				}
			} else {
				RSO_MSO_controller.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary", {}, true);
			}
		},
		//---------------------------------------
		//--------Handling Filter---------------
		//----------------------------------
		series_selected: function (oEvent) {

			// var year = this.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"

			if (this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries') && this.getView().getElementBinding(
					'mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var series = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				var language = RSO_MSO_controller.returnBrowserLanguage();
				var model;
				if (language === "FR") {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				} else {
					model =
						"{parts: [{path:'mainservices>model'},{path:'mainservices>model_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}";

				}
				// this.getView().byId('model_CSOR').bindItems("oModel3>/", new sap.ui.core.ListItem({
				// 	key: "{oModel3>Model}",
				// 	text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
				// }));
				// var dealer = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				var dealerno = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzdealerCode');
				var dealer = dealerno.slice(-5);
				this.getView().byId('model_CSOR').bindItems({
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = this.getView().byId('model_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = this.getView().byId('model_CSOR').getSelectedKey();
			var language = RSO_MSO_controller.returnBrowserLanguage();
			var suf;
			if (language === "FR") {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			} else {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			// var dealer = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;

			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				var dealerno = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('ZzdealerCode');
				var dealer = dealerno.slice(-5);
				// this.getView().byId('suffix_CSOR').bindItems('oModel1>/', new sap.ui.core.ListItem({
				// 	key: "{oModel1>Suffix}",
				// 	text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel2>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
				// }));
				this.getView().byId('suffix_CSOR').bindItems({
					path: "mainservices>/ZVMS_CDS_SUFFIX(DLR='" + dealer + "')/Set",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						text: suf
					})
				});
				// var items_binding = this.getView().byId('suffix_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
			}
		},
		suffix_selected: function (oEvent) {
			//-----------------
			//----APX---------
			//----------------
			//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
			var suffix = this.getView().byId('suffix_CSOR').getSelectedKey();

			var model = this.getView().byId('model_CSOR').getSelectedKey();
			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr') && suffix) {
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('apx_CSOR').bindItems('mode_Model>/', new sap.ui.core.ListItem({
				// 	key: "{mode_Model>zzapx}",
				// 	text: "{mode_Model>zzapx}"
				// }));
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
				// var items_binding = this.getView().byId('apx_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
				//-----------------
				//----Color---------
				//----------------
				// this.getView().byId('colour_CSOR').bindItems('oModel2>/', new sap.ui.core.ListItem({
				// 	key: "{oModel2>ExteriorColorCode}",
				// 	text: "{parts: [{path:'oModel2>ExteriorColorCode'},{path:'oModel2>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
				// }));
				var color;
				var language = RSO_MSO_controller.returnBrowserLanguage();
				if (language === "FR") {
					color = "{mainservices>ext}/{mainservices>mktg_desc_fr}";
				} else {
					color = "{mainservices>ext}/{mainservices>mktg_desc_en}";
				}
				this.getView().byId('colour_CSOR').bindItems({
					path: 'mainservices>/ZVMS_CDS_Colour',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>ext}",
						text: color
					})
				});
				// var items_binding = this.getView().byId('colour_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

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
	});
});