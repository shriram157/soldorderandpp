sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var PPD_DealerCont, clicks = 0,
		num = 0,
		pricepro = false;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.PriceProtectionDetails_Dealer", {
		formatter: formatter,

		onInit: function () {
			PPD_DealerCont = this;
			// AppController.getDealer();
			PPD_DealerCont.getView().setModel(sap.ui.getCore().getModel("LoginUserModel"), "LoginUserModel");
			//PPD_DealerCont.returnBrowserLanguage();
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if (language == "EN") {
				Obj = {
					"PriceProtectionStatus": [{
						"key": "OPEN",
						"text": "OPEN"
					}, {
						"key": "IN PROGRESS",
						"text": "IN PROGRESS"
					}, {
						"key": "PRE-APPROVED",
						"text": "PRE-APPROVED"
					}, {
						"key": "UNDER REVIEW",
						"text": "UNDER REVIEW"
					}, {
						"key": "APPROVED",
						"text": "APPROVED"
					}, {
						"key": "REJECTED",
						"text": "REJECTED"
					}, {
						"key": "CLOSED",
						"text": "CLOSED"
					}]
				};
			} else {
				Obj = {
					"PriceProtectionStatus": [{
						"key": "OPEN",
						"text": "OPEN"
					}, {
						"key": "IN PROGRESS",
						"text": "IN PROGRESS"
					}, {
						"key": "PRE-APPROVED",
						"text": "PRE-APPROVED"
					}, {
						"key": "UNDER REVIEW",
						"text": "UNDER REVIEW"
					}, {
						"key": "APPROVED",
						"text": "APPROVED"
					}, {
						"key": "REJECTED",
						"text": "REJECTED"
					}, {
						"key": "CLOSED",
						"text": "CLOSED"
					}],
				};

			}

			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"), "globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));

			var OrderTypeModel = new sap.ui.model.json.JSONModel();
			var Object;
			if (language == "EN") {
				Object = {
					"PriceProtection_OrderType": [{
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
					}, {
						"key": "RETAIL SOLD",
						"text": "RETAIL SOLD"
					}],
				};

			} else {
				Object = {
					"PriceProtection_OrderType": [{
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
					}, {
						"key": "RETAIL SOLD",
						"text": "RETAIL SOLD"
					}],
				};
			}

			OrderTypeModel.setData(Object);
			OrderTypeModel.updateBindings(true);
			sap.ui.getCore().setModel(OrderTypeModel, "OrderTypeModel");
			this.getView().setModel(sap.ui.getCore().getModel("OrderTypeModel"), "OrderTypeModel");
			console.log(sap.ui.getCore().getModel("OrderTypeModel"));
			// PPD_DealerCont.getBrowserLanguage();
			PPD_DealerCont._handleServiceSuffix_Series();
			this.getOwnerComponent().getRouter().getRoute("PriceProtectionDetails_Dealer").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			PPD_DealerCont.getView().setModel(oModel, "ppdModel");
			var PPDLocalModel = new sap.ui.model.json.JSONModel();
			PPDLocalModel.setData({
				PPDBusyIndicator: false
			});
			PPD_DealerCont.getView().setModel(PPDLocalModel, "PPDLocalModel");
			
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Emphasized');

			var mcb_status_PPD_D = PPD_DealerCont.getView().byId("mcb_status_PPD_D");
			var mcb_ordTyp_PPD_D = PPD_DealerCont.getView().byId("mcb_ordTyp_PPD_D");
			var mcb_dealer_PPD_D = PPD_DealerCont.getView().byId("mcb_dealer_PPD_D");
			mcb_status_PPD_D.setSelectedItems(mcb_status_PPD_D.getItems());
			mcb_dealer_PPD_D.setSelectedItems(mcb_dealer_PPD_D.getItems());
			mcb_ordTyp_PPD_D.setSelectedItems(mcb_ordTyp_PPD_D.getItems());
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			var host = PPD_DealerCont.host();

			if (x != "TCI_User") {
				PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", true);
				console.log("loading data");
				PPD_DealerCont._refresh();
			} else {
				PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", true);
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
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
						oUrl = oUrl + ") &$orderby=dealer_ord desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
						PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
						var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
					}
				});
			}
		},

		onAfterRendering: function () {

			// var mcb_status_PPD_D = PPD_DealerCont.getView().byId("mcb_status_PPD_D");
			// var mcb_ordTyp_PPD_D = PPD_DealerCont.getView().byId("mcb_ordTyp_PPD_D");
			// var mcb_dealer_PPD_D = PPD_DealerCont.getView().byId("mcb_dealer_PPD_D");
			// mcb_status_PPD_D.setSelectedItems(mcb_status_PPD_D.getItems());
			// mcb_dealer_PPD_D.setSelectedItems(mcb_dealer_PPD_D.getItems());
			// mcb_ordTyp_PPD_D.setSelectedItems(mcb_ordTyp_PPD_D.getItems());
			// var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			// var host = PPD_DealerCont.host();

			// if (x != "TCI_User") {
			// 	PPD_DealerCont._refresh();
			// } else {

			// 	var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
			// 	for (var i = 0; i < this.getView().byId("mcb_status_PPD_D").getSelectedItems().length; i++) {
			// 		var status = this.getView().byId("mcb_status_PPD_D").getSelectedItems()[i].getKey();
			// 		oUrl = oUrl + "(status eq '" + status + "')";
			// 		if (i == ((this.getView().byId("mcb_status_PPD_D").getSelectedItems().length) - 1)) {
			// 			oUrl = oUrl + ") and (";
			// 		} else {
			// 			oUrl = oUrl + " or ";
			// 		}

			// 	}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length; i++) {
			// 		var audit = this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems()[i].getText();
			// 		oUrl = oUrl + "(zzordtypedesc eq '" + audit + "')";
			// 		if (i == ((this.getView().byId("mcb_ordTyp_PPD_D").getSelectedItems().length) - 1)) {
			// 			oUrl = oUrl + ") &$orderby=dealer_ord desc";
			// 		} else {
			// 			oUrl = oUrl + " or ";
			// 		}
			// 	}
			// 	$.ajax({
			// 		url: oUrl,
			// 		method: "GET",
			// 		async: false,
			// 		dataType: "json",
			// 		success: function (data, textStatus, jqXHR) {
			// 			var BtnNext = PPD_DealerCont.getView().byId("buttonNext");
			// 			if (data.d.results.length <= 0) {
			// 				BtnNext.setEnabled(false);
			// 			} else {
			// 				BtnNext.setEnabled(true);
			// 			}

			// 			var DataModel = PPD_DealerCont.getView().getModel("ppdModel");
			// 			if (DataModel.getData().length != undefined) {

			// 				for (var m = 0; m < data.d.results.length; m++) {
			// 					DataModel.getData().push(data.d.results[m]);
			// 					DataModel.updateBindings(true);
			// 					console.log("DataModel.getData()", DataModel.getData());
			// 				}
			// 			} else {
			// 				DataModel.setData(data.d.results);
			// 				DataModel.updateBindings(true);
			// 			}
			// 		},
			// 		error: function (jqXHR, textStatus, errorThrown) {
			// 			var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
			// 			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			// 		}
			// 	});
			// }
		},

		_refresh: function () {
			var host = PPD_DealerCont.host();
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
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
					oUrl = oUrl + "(dealer_code eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") &$orderby=dealer_ord desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
						PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
						var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (pricepro == true) {
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
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
					oUrl = oUrl + "(dealer_code eq'" + dealer + "')";
					
					oUrl = oUrl + "and &$orderby=dealer_ord desc) ";
					
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
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
							oUrl = oUrl + ") &$orderby=dealer_ord desc";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});

				}
			}
		},
		_refreshCombo: function (evt) {
			pricepro = true;
			var host = PPD_DealerCont.host();
			PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", true);
			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=0&$filter=(";
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
			oUrl = oUrl + "(dealer_code eq'" + dealer + "'))";
		
			oUrl = oUrl + "&$orderby=dealer_ord desc ";
		
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
					PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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

			} else {
			}

		},
		_handleServiceSuffix_Series: function () {
			var host = PPD_DealerCont.host();
			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/SoldOrderSeriesSet?$format=json";
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
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 50;
			PPD_DealerCont.data();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionPrevious: function (oEvent) {
			//This code was generated by the layout editor.
			clicks -= 1;
			if (clicks <= 0) {
				num = 0;
			} else {
				num = clicks * 50;
			}
			PPD_DealerCont.data();
		},
		data: function (oEvent) {
			PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", true);
			var host = PPD_DealerCont.host();
			var x = sap.ui.getCore().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=" + num + "&$filter=(";
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
					oUrl = oUrl + "(dealer_code eq'" + dealer + "')";
					if (i == ((this.getView().byId("mcb_dealer_PPD_D").getSelectedItems().length) - 1)) {
						oUrl = oUrl + ") &$orderby=dealer_ord desc";
					} else {
						oUrl = oUrl + " or ";
					}
				}
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
						PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
						var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});
			} else {
				if (pricepro == false) {
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=" + num + "&$filter=(";
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
							oUrl = oUrl + ") &$orderby=dealer_ord desc";
						} else {
							oUrl = oUrl + " or ";
						}
					}
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

						}
					});
				} else {

					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_CDS_PRC_PRTC_Eligible?$top=10&$skip=" + num + "&$filter=(";
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
					oUrl = oUrl + "(dealer_code eq'" + dealer + "')";
					oUrl = oUrl + "and &$orderby=dealer_ord desc) ";
					
					$.ajax({
						url: oUrl,
						method: "GET",
						async: false,
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
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
							PPD_DealerCont.getView().getModel("PPDLocalModel").setProperty("/PPDBusyIndicator", false);
							var errMsg = PPD_DealerCont.getView().getModel("i18n").getResourceBundle().getText("errorServer");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
		},
	});
});