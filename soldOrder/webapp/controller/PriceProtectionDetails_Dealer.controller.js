sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, formatter, Sorter, Filter, FilterOperator) {
	"use strict";
	var PPD_DealerCont, clicks = 0,
		num = 0,
		pricepro = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.PriceProtectionDetails_Dealer", {
		formatter: formatter,

		onInit: function () {
			PPD_DealerCont = this;
			PPD_DealerCont.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if (language == "EN") {
				// changes done for demand DMND0003456 by Minakshi
				Obj = {
					"PriceProtectionStatus": [{
						"key": "APPROVED",
						"text": "APPROVED"
					},{
						"key": "CANCELLED",
						"text": "CANCELLED"
					},{
						"key": "CHANGED",
						"text": "CHANGED"
					},{
						"key": "CLOSED",
						"text": "CLOSED"
					},{
						"key": "IN PROGRESS",
						"text": "IN PROGRESS"
					},{
						"key": "OPEN",
						"text": "OPEN"
					},{
						"key": "PRE-APPROVED",
						"text": "PRE-APPROVED"
					},{
						"key": "REJECTED",
						"text": "REJECTED"
					},{
						"key": "UNDER-REVIEW",
						"text": "UNDER-REVIEW"
					}]
				};
			} else {
				Obj = {
					"PriceProtectionStatus": [{
						"key": "APPROVED",
						"text": "APPROVED"
					},{
						"key": "CANCELLED",
						"text": "CANCELLED"
					},{
						"key": "CHANGED",
						"text": "CHANGED"
					},{
						"key": "CLOSED",
						"text": "CLOSED"
					},{
						"key": "IN PROGRESS",
						"text": "IN PROGRESS"
					},{
						"key": "OPEN",
						"text": "OPEN"
					},{
						"key": "PRE-APPROVED",
						"text": "PRE-APPROVED"
					},{
						"key": "REJECTED",
						"text": "REJECTED"
					},{
						"key": "UNDER-REVIEW",
						"text": "UNDER-REVIEW"
					}]
				};
			}

			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(globalComboModel, "globalComboModel");
			console.log("globalComboModel", globalComboModel);

			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			// changes done for demand DMND0003456 by Minakshi
			if (window.location.search.match(/Division=([^&]*)/i)[1] == "10") {
				Object = {
					"PriceProtection_OrderType": [{
						"key": "F1",
						"text": "DLR RAC"
					}, {
						"key": "F2",
						"text": "DLR ELITE"
					}, {
						"key": "F5",
						"text": "MOBILITY"
					}, {
						"key": "RETAIL SOLD",
						"text": "RETAIL SOLD"
					}]
				};

			} else {
				Object = {
					"PriceProtection_OrderType": [
						// {
						// 	"key": "F1",
						// 	"text": "DLR RAC"
						// }, 
						{
							"key": "F2",
							"text": "DLR ELITE"
						},
						// {
						// 	"key": "F3",
						// 	"text": "NAT RAC"
						// },
						// {
						// 	"key": "F4",
						// 	"text": "NAT ELITE"
						// },
						// {
						// 	"key": "F5",
						// 	"text": "MOBILITY"
						// },
						{
							"key": "RETAIL SOLD",
							"text": "RETAIL SOLD"
						}
					]
				};
			}

			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(OrderTypeModel, "OrderTypeModel");
			console.log("OrderTypeModel", OrderTypeModel);
			// PPD_DealerCont.getBrowserLanguage();
			this.getOwnerComponent().getRouter().getRoute("PriceProtectionDetails_Dealer").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			PPD_DealerCont.getView().setModel(oModel, "ppdModel");
			var PPDLocalModel = new sap.ui.model.json.JSONModel();
			PPDLocalModel.setData({
				PPDBusyIndicator: false
					//	enableOwnershipFlag:false
			});

			// PPD_DealerCont.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			// PPD_DealerCont.getView().getModel("LoginUserModel").setSizeLimit(750);
			// PPD_DealerCont.getView().getModel("LoginUserModel").updateBindings(true);
			PPD_DealerCont.dialog = new sap.m.BusyDialog({
				text: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("loadingData")
			});

			PPD_DealerCont.getView().setModel(PPDLocalModel, "PPDLocalModel");
			num = 0;
			clicks = 0;
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Emphasized');
			PPD_DealerCont.getView().byId("idmenu11").setType('Transparent');

			var mcb_status_PPD_D = PPD_DealerCont.getView().byId("mcb_status_PPD_D");
			var mcb_ordTyp_PPD_D = PPD_DealerCont.getView().byId("mcb_ordTyp_PPD_D");
			var mcb_dealer_PPD_D = PPD_DealerCont.getView().byId("mcb_dealer_PPD_D");
			// changes done for demand DMND0003456 by Minakshi
			var aSelectedStatusArr = mcb_status_PPD_D.getItems().filter(item => 
				item.getKey() == "OPEN" || item.getKey() == "PRE-APPROVED" ||
				item.getKey() == "CHANGED" || item.getKey() == "UNDER-REVIEW" || item.getKey() == "IN PROGRESS" 
			);
			mcb_status_PPD_D.setSelectedItems(aSelectedStatusArr);
			mcb_dealer_PPD_D.setSelectedItems(mcb_dealer_PPD_D.getItems());
			mcb_ordTyp_PPD_D.setSelectedItems(mcb_ordTyp_PPD_D.getItems());
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/soldorder_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";

			PPD_DealerCont._handleServiceSuffix_Series(this.nodeJsUrl);

			//Changes done for INC0189944 by Minakshi odata call on load happen only for dealer not for other users.
			if (x == "Dealer_User") {
				PPD_DealerCont.dialog.open();
				PPD_DealerCont._refresh();
			} else {
				PPD_DealerCont.getView().byId("cb_dealer_PPD_D").setSelectedKey("");
			}
			//Changes done for INC0189944 by Minakshi end.
			
		},

	

		_refresh: function () {

			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User" && x !== "TCI_Zone_User" && x !== "National_Fleet_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(status eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
					oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(dealer_code eq '" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ")"; //Changed by singhmi 05/02/2021
					} else {
						oUrl = oUrl + " or ";
					}
				}
					//	DMND0003455 changes done by Minakshi 13/12/2021
				oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc";
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						PPD_DealerCont.dialog.close();
						var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
						// if (DataModel.getData().length != undefined) {

						// 	for (var m = 0; m < data.d.results.length; m++) {
						// 		DataModel.getData().push(data.d.results[m]);
						// 		DataModel.updateBindings(true);
						// 		console.log("DataModel.getData()", DataModel.getData());
						// 	}
						// } else {
						DataModel.setData(data.d.results);
						DataModel.updateBindings(true);
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {
						PPD_DealerCont.dialog.close();
						var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (pricepro == true) {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(status eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
						oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
					oUrl = oUrl + "(dealer_code eq '" + dealer + "'))";
	//	DMND0003455 changes done by Minakshi 13/12/2021
					oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc";

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.dialog.close();
							var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
							// if (DataModel.getData().length != undefined) {

							// 	for (var m = 0; m < data.d.results.length; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 		DataModel.updateBindings(true);
							// 		console.log("DataModel.getData()", DataModel.getData());
							// 	}
							// } else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
							// }

						},
						error: function (jqXHR, textStatus, errorThrown) {
							PPD_DealerCont.dialog.close();
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=0&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(status eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
						oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ")";
						} else {
							oUrl = oUrl + " or ";
						}
					}
						//	DMND0003455 changes done by Minakshi 13/12/2021
					oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc";
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.dialog.close();
							var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
							// if (DataModel.getData().length != undefined) {

							// 	for (var m = 0; m < data.d.results.length; m++) {
							// 		DataModel.getData().push(data.d.results[m]);
							// 		DataModel.updateBindings(true);
							// 		console.log("DataModel.getData()", DataModel.getData());
							// 	}
							// } else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
							// }
						},
						error: function (jqXHR, textStatus, errorThrown) {
							PPD_DealerCont.dialog.close();
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});

				}
			}
		},
		_refreshCombo: function (evt) {
			pricepro = true;
			PPD_DealerCont.dialog.open();
			var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=0&$filter=(";
			for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
				var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
				oUrl = oUrl + "(status eq '" + status + "')";
				if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}

			}
			for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
				var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
				oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
				if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
					oUrl = oUrl + ") and (";
				} else {
					oUrl = oUrl + " or ";
				}
			}
			var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
			oUrl = oUrl + "(dealer_code eq '" + dealer + "'))";
	//	DMND0003455 changes done by Minakshi 13/12/2021
			oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc";

			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					PPD_DealerCont.dialog.close();
					var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
					if (data.d.results.length <= 0) {
						BtnNext.setEnabled(false);
					} else {
						BtnNext.setEnabled(true);
					}

					var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
					// if (DataModel.getData().length != undefined) {

					// 	for (var m = 0; m < data.d.results.length; m++) {
					// 		DataModel.getData().push(data.d.results[m]);
					// 		DataModel.updateBindings(true);
					// 		console.log("DataModel.getData()", DataModel.getData());
					// 	}
					// } else {
					DataModel.setData(data.d.results);
					DataModel.updateBindings(true);
					// }
				},
				error: function (jqXHR, textStatus, errorThrown) {
					PPD_DealerCont.dialog.close();
					var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}
			});
		},
		_navToRSO: function (evt) {

			var Flags = {
				openCommentBox: "X"
			};
			var oFlagsModel = new sap.ui.model.json.JSONModel(Flags); // created a JSON model       
			sap.ui.getCore().setModel(oFlagsModel, "ppdFlages");

			var selectedRow = evt.getSource().getBindingContext("ppdModel").getObject();

			PPD_DealerCont.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);

			if (selectedRow.zzso_type == "SO") {

			} else {}

		},
		_handleServiceSuffix_Series: function (nodeJsUrl) {
			var oUrl = nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?$format=json";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					PPD_DealerCont.getView().setModel(oModel, "seriesModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		onActionNext: function (oEvent) {
			this.dialog.open();
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 100;
			PPD_DealerCont.data();
		},

		data: function (oEvent) {
			PPD_DealerCont.dialog.open();

			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=" + num + "&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(status eq '" + status + "')";
					if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}

				}
				for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
					var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
					oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
					if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") and (";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				for (var i = 0; i < this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length; i++) {
					var dealer = this.getView().byId("mcb_dealer_PPD_D").getSelectedItems()[i].getKey();
					oUrl = oUrl + "(dealer_code eq '" + dealer + "'))";
					if (i == ((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl;
					} else {
						oUrl = oUrl + " or ";
					}
				}
			//	DMND0003455 changes done by Minakshi 13/12/2021
				oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc";
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						PPD_DealerCont.dialog.close();
						var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
						if (data.d.results.length <= 0) {
							BtnNext.setEnabled(false);
						} else {
							BtnNext.setEnabled(true);
						}

						var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
						if (DataModel.getData().length != undefined) {

							for (var m = 0; m < data.d.results.length; m++) {
								DataModel.getData().push(data.d.results[m]);
								DataModel.updateBindings(true);
								console.log("DataModel.getData()", DataModel.getData());
							}
						} else {
							DataModel.setData(data.d.results);
							DataModel.updateBindings(true);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						PPD_DealerCont.dialog.close();
						var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (pricepro == false) {
					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=" + num + "&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(status eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
						oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ")";
						} else {
							oUrl = oUrl + " or ";
						}
					}
						//	DMND0003455 changes done by Minakshi 13/12/2021
					oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc";
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.dialog.close();
							var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
							if (DataModel.getData().length != undefined) {

								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							PPD_DealerCont.dialog.close();
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = this.nodeJsUrl + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=100&$skip=" + num + "&$filter=(";
					for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
						var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
						oUrl = oUrl + "(status eq '" + status + "')";
						if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}

					}
					for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
						var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
						oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
						if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
							oUrl = oUrl + ") and (";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					var dealer = this.getView().byId("cb_dealer_PPD_D").getSelectedKey();
					oUrl = oUrl + "(dealer_code eq '" + dealer + "'))";
					oUrl = oUrl+"and expiry ne 'X'" + "&$orderby=dealer_ord desc"; //Changed by singhmi 05/02/2021

					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.dialog.close();
							var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
							if (data.d.results.length <= 0) {
								BtnNext.setEnabled(false);
							} else {
								BtnNext.setEnabled(true);
							}

							var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
							if (DataModel.getData().length != undefined) {

								for (var m = 0; m < data.d.results.length; m++) {
									DataModel.getData().push(data.d.results[m]);
									DataModel.updateBindings(true);
									console.log("DataModel.getData()", DataModel.getData());
								}
							} else {
								DataModel.setData(data.d.results);
								DataModel.updateBindings(true);
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							PPD_DealerCont.dialog.close();
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
		},
		onLiveSOChange: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnSuperSearch();
		},
		fnSuperSearch: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new Sorter("dealer_ord", this.bDescending));

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("dealer_ord", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzendcu_name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzordtypedesc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Zzseries", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzmoyr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzmodel", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("status", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ownership_doc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("credit_memo_doc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("vhvin", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzrdrcust_name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
				], false);

				aFilters = new sap.ui.model.Filter([oFilter], true);
			}
			this.byId("table_PPD_Dealer").getBinding().filter(aFilters).sort(aSorters);
		}
	});
});