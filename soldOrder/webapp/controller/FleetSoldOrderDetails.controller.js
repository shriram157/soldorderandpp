sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var FSOD_controller, zrequest;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderDetails", {
		formatter: formatter,
		onInit: function () {
			FSOD_controller = this;
			FSOD_controller.getBrowserLanguage();
		},

		onBeforeRendering: function () {
			if (AppController.flagZoneUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagNationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagTCINationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
		},

		onAfterRendering: function () {
			//-----------------------------------------------------------
			//-----Binding without Fleet Reference----------------------
			//----------------------------------------------------------
			var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
			var items = oTbl.getBinding('rows');
			items.filter([new Filter("FleetReference", FilterOperator.EQ, 'X')], true);
			//-------------------------------------------------------------------------------
			var mcb_status_FSOD = FSOD_controller.getView().byId("mcb_status_FSOD");
			var mcb_series_FSOD = FSOD_controller.getView().byId("mcb_series_FSOD");
			var mcb_ordTyp_FSOD = FSOD_controller.getView().byId("mcb_ordTyp_FSOD");
			var mcb_auditStatus_FSOD = FSOD_controller.getView().byId("mcb_auditStatus_FSOD");
			var mcb_dealer_FSOD = FSOD_controller.getView().byId("mcb_dealer_FSOD");

			mcb_series_FSOD.setSelectedItems(mcb_series_FSOD.getItems());
			mcb_status_FSOD.setSelectedItems(mcb_status_FSOD.getItems());
			mcb_auditStatus_FSOD.setSelectedItems(mcb_auditStatus_FSOD.getItems());
			mcb_dealer_FSOD.setSelectedItems(mcb_dealer_FSOD.getItems());
			mcb_ordTyp_FSOD.setSelectedItems(mcb_ordTyp_FSOD.getItems());
			//	mcb_ordTyp_FSOD.setSelectedKey("4");
			// console.log(mcb_series_FSOD.getItems());
			// console.log(mcb_series_FSOD.getSelectedItems());

			if (AppController.flagZoneUser == true) {
				FSOD_controller.getView().byId("lbl_dealer_FSOD").setVisible(true);
				//FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
				var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
				var data = oTbl.getModel().getData().ProductCollection;
				var len = data.length;
				for (var i = 1; i <= len; i++) {
					var Id = "tbl_val_dealer_FSOD-__clone" + (i + 11 * (i - 1));
					FSOD_controller.getView().byId(Id).setVisible(true);
				}
				FSOD_controller.getView().byId(Id).setVisible(true);
			}
			if (AppController.flagNationalUser == true) {
				FSOD_controller.getView().byId("lbl_dealer_FSOD").setVisible(true);
				//	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
				var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
				var data = oTbl.getModel().getData().ProductCollection;
				var len = data.length;
				for (var i = 1; i <= len; i++) {
					var Id = "tbl_val_dealer_FSOD-__clone" + (i + 11 * (i - 1));
					FSOD_controller.getView().byId(Id).setVisible(true);
				}
				FSOD_controller.getView().byId(Id).setVisible(true);
			}
			if (AppController.flagTCINationalUser == true) {
				FSOD_controller.getView().byId("lbl_dealer_FSOD").setVisible(true);
				//	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
				var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
				var data = oTbl.getModel().getData().ProductCollection;
				var len = data.length;
				for (var i = 1; i <= len; i++) {
					var Id = "tbl_val_dealer_FSOD-__clone" + (i + 11 * (i - 1));
					FSOD_controller.getView().byId(Id).setVisible(true);
				}
				FSOD_controller.getView().byId(Id).setVisible(true);
			}
		},
		/*	_sipUserToTrue: function () {
			FSOD_controller.requestStatus = "Pending Fulfilment";
			FSOD_controller.flagSipUser = true;
			FSOD_controller.getView().byId("btn_linkVeh_FSOD").setVisible(true);

		},*/
		/*	onLinkVehicle: function (evt) {
				var dialog = FSOD_controller.getView().byId("VTNDialog_FSOD");
				dialog.open();

			},
			closeDialog: function () {
				var dialog = FSOD_controller.getView().byId("VTNDialog_FSOD");
				dialog.close();
			},*/
		_navToRSO: function (evt) {
			FSOD_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
		},
		_refresh: function (oEvent) {
			//-----------------Sold Order Status-----------------
			var afilter = [];
			for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
				afilter.push(new Filter("ZzsoStatus", FilterOperator.EQ, this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getText()));
			}
			var filter_sstatus = new Filter(afilter, false);
			//---------------------------------------------------------------
			//-----------------Series-----------------
			// var Sfilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
			// 	Sfilter.push(new Filter("Zzseries", FilterOperator.EQ, this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey()));
			// }
			// var filter_series = new Filter(Sfilter, false);
			//---------------------------------------------------------------
			var filter_all = new Filter([filter_sstatus, new Filter("FleetReference", FilterOperator.EQ, 'X')], true);
			var items = this.getView().byId("tbl_FSOD").getBinding('rows');
			items.filter(filter_all);

		},
		onLinkVehicle: function (evt) {
			 zrequest = evt.getSource().getBindingContext('mainservices').getProperty('ZzsoReqNo');
			var d = new sap.ui.jsfragment(FSOD_controller.createId("idFrag_FSOD"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				FSOD_controller);
				
			FSOD_controller.getView().addDependent(d);
			// console.log(d);
			d.open();
		},
		_searchNLink: function (evt) {
				var vinVal = FSOD_controller.byId("idFrag_FSOD--VinIdFrag").getValue();
				var vtinVal = FSOD_controller.byId("idFrag_FSOD--VtinIdFrag").getValue();
				var V_No;
				if (vinVal == "" && vtinVal == "") {
					var errForm = formatter.formatErrorType("SO000010");
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					if (vinVal !== "") {
						V_No = vinVal;
					}else{
						V_No = vtinVal;
					}
					FSOD_controller.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
						method: "POST",
						urlParameters: {
							Zzvtn: V_No,
							ZzsoReqNo: zrequest
								//	Endcustomer:
						}, // function import parameters
						success: function (oData, response) {
							if (oData.Type == 'E') {
								var oBundle = FSOD_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000013", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
									.m.MessageBox.Action.OK, null, null);
							} else {
								var oBundle = FSOD_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000014", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap
									.m.MessageBox.Action.OK, null, null);
								var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
								var items = oTbl.getBinding('rows');
								items.refresh();
							}

						},
						error: function (oError) {

						}
					});

				}
			}
			/*_searchNLink: function () {
					var vinVal = FSOD_controller.getView().byId("vin_FSOD").getValue();
					var vtinVal = FSOD_controller.getView().byId("vtin_FSOD").getValue();

					var errForm = formatter.formatErrorType("SO000010");
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}*/

	});

});