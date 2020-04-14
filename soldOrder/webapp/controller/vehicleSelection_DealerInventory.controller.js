sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var vehSelDealerInvController;
	var zrequest, vehicle, model, modelyear, suffix, color, series;
	var language = sap.ui.getCore().getModel("i18n").getResourceBundle().sLocale.toLocaleUpperCase();
	return BaseController.extend("toyota.ca.SoldOrder.controller.vehicleSelection_DealerInventory", {
		formatter: formatter,

		onInit: function () {
			vehSelDealerInvController = this;
			// vehSelDealerInvController.getBrowserLanguage();
			this.getOwnerComponent().getRouter().getRoute("vehicleSelection_DealerInventory").attachPatternMatched(this._getattachRouteMatched,
				this);

		},
		_getattachRouteMatched: function (parameters) {
			vehSelDealerInvController.getOwnerComponent().getModel("LocalDataModel").setProperty("/Lang", language);
			var oDivision = window.location.search.match(/Division=([^&]*)/i)[1];
			if (oDivision == "10") {
				vehSelDealerInvController.sDivision = "TOY";
			} else {
				vehSelDealerInvController.sDivision = "LEX";
			}
			var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var Msg = oBundle.getText("novehicletable");
			vehSelDealerInvController.getView().byId("table_RSOVehicleDealer").setNoData(Msg);
			zrequest = parameters.getParameters().arguments.Soreq;
			var vechile_items = vehSelDealerInvController.getView().byId("table_RSOVehicleDealer").getBinding('rows');
			var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();

			vechile_items.filter([new Filter([
				//	(MATRIX eq 'A205') and (Dealer eq '2400001116') and (RSO_NUM eq 'SO0000000119') and (source eq 'RSO') and (ZDIVISION eq 'TOY') and (Model eq 'B11HLT') and (Modelyear eq '2019') and (TCISeries eq 'CAM') and (Suffix eq 'AM')

				new Filter("MATRIX", FilterOperator.EQ, "A205"),
				new Filter("Dealer", FilterOperator.EQ, dealer_no),
				new Filter("RSO_NUM", FilterOperator.EQ, zrequest),
				new Filter("source", FilterOperator.EQ, "RSO"),
				new Filter("ZDIVISION", FilterOperator.EQ, vehSelDealerInvController.sDivision),
				new Filter("Model", FilterOperator.EQ, vehicle.model),
				new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
				new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
				new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
				new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color)
			], true)]);
		},
		onAfterRendering: function () {},
		filter_change: function (Oevent) {
			var vechile_items = vehSelDealerInvController.getView().byId("table_RSOVehicleDealer").getBinding('rows');
			var dealer_no = sap.ui.getCore().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			vehicle = sap.ui.getCore().getModel('Vehicle_Selection').getData();
			if (Oevent.getSource().getSelectedKey() == '1') {

				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, dealer_no),
					new Filter("Model", FilterOperator.EQ, vehicle.model),
					new Filter("Modelyear", FilterOperator.EQ, vehicle.modelyear),
					new Filter("Suffix", FilterOperator.EQ, vehicle.suffix),
					new Filter("ExteriorColorCode", FilterOperator.EQ, vehicle.color),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					new Filter("TCISeries", FilterOperator.EQ, vehicle.series),
					// new Filter("ETA", FilterOperator.EQ, ""),
					// new Filter("APX", FilterOperator.EQ, ""),
				], true)]);
			} else if (Oevent.getSource().getSelectedKey() == '2') //National Stock
			{
				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, "2400500000")
					// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
					// new Filter("Modelyear", FilterOperator.EQ, "2018"),
					// new Filter("Suffix", FilterOperator.EQ, "AL"),
					// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					// new Filter("TCISeries", FilterOperator.EQ, ""),
					// new Filter("ETA", FilterOperator.EQ, ""),
					// new Filter("APX", FilterOperator.EQ, ""),
				], true)]);
			}
		},
		_onSelect: function (evt) {
			var host = vehSelDealerInvController.host();
			var OBJ = {};
			vehSelDealerInvController.dealer = evt.getSource().getBindingContext('mainservices').getProperty('Dealer');
			vehSelDealerInvController.model = evt.getSource().getBindingContext("mainservices").getProperty("Model");
			vehSelDealerInvController.series = evt.getSource().getBindingContext("mainservices").getProperty("TCISeries");
			vehSelDealerInvController.modYear = evt.getSource().getBindingContext("mainservices").getProperty("Modelyear");
			OBJ.ZZVTN = evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN');
			OBJ.ETAFrom = evt.getSource().getBindingContext('mainservices').getProperty('ETAFrom');
			OBJ.ETATo = evt.getSource().getBindingContext('mainservices').getProperty('ETATo');
			var oModelCore = new sap.ui.model.json.JSONModel(OBJ);
			sap.ui.getCore().setModel(oModelCore, "ModelCore");
			var zurl = host + "/ZVMS_SOLD_ORDER_SRV/SoCapSet(Zzmoyr='" + vehSelDealerInvController.modYear + "',ZzappType='" + AppController.apptypeAllocation +
				"',Zzseries='" + vehSelDealerInvController.series + "',Zzmodel='" + vehSelDealerInvController.model + "',ZzDealer='" +
				AppController.dealerAllocation + "')";
			var dealerlogged = AppController.dealerAllocation;
			if (dealerlogged != vehSelDealerInvController.dealer) {
				$.ajax({
					url: zurl,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						vehSelDealerInvController.allocatedNo = data.d.Allowed;
						if (vehSelDealerInvController.allocatedNo > 0) {
							var sMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("informAllocation", [vehSelDealerInvController.allocatedNo]);
							sap.m.MessageBox.show(sMsg, {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: sap.ui.getCore().getModel("i18n").getResourceBundle().getText("information"),
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction == "YES") {
										if (evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN')) {
											var V_No = evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN');
											vehSelDealerInvController.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
												method: "POST",
												urlParameters: {
													Vhvin: "",
													Zzvtn: V_No,
													ZzsoReqNo: zrequest
												},
												success: function (oData, response) {
													if (oData.Type == 'E') {
														var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
														var sMsg1 = oBundle.getText("SO000013", [zrequest]);
														sap.m.MessageBox.show(sMsg1, sap.m.MessageBox.Icon.ERROR, "Error", sap
															.m.MessageBox.Action.OK, null, null);
													} else {
														vehSelDealerInvController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
															Soreq: zrequest
														}, true); //page 3	
													}
												},
												error: function (oError) {}
											});
										}
									} else {

									}

								}
							});

						} else {
							var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("errorAllocation");
							var errTitle = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("error");
							sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, errTitle, sap
								.m.MessageBox.Action.OK, null, null);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
							sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			} else {
				if (evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN')) {
					var V_No = evt.getSource().getBindingContext('mainservices').getProperty('ZZVTN');
					vehSelDealerInvController.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
						method: "POST",
						urlParameters: {
							Vhvin: "",
							Zzvtn: V_No,
							ZzsoReqNo: zrequest
						},
						success: function (oData, response) {
							if (oData.Type == 'E') {
								var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000013", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
									.m.MessageBox.Action.OK, null, null);
							} else {
								vehSelDealerInvController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
									Soreq: zrequest
								}, true); //page 3	
							}
						},
						error: function (oError) {}
					});
				}
			}

		},

		_GetCustomer: function () {

		},
		onNavBack: function (oEvent) {
			vehSelDealerInvController.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: zrequest
			}, true); //page 3		
		}

	});

});