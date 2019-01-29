sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var RSOS_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderSummary", {
		formatter: formatter,
		
		onInit: function () {
			RSOS_controller = this;
			RSOS_controller.getBrowserLanguage();
		
		},
		onAfterRendering: function () {
			var oTbl = RSOS_controller.getView().byId("table_RSOS");
			var data = oTbl.getModel().getData().ProductCollection;
			var mcb_series_RSOS = RSOS_controller.getView().byId("mcb_series_RSOS");
			var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
			var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
			var mcb_dealer_RSOS = RSOS_controller.getView().byId("mcb_dealer_RSOS");

			mcb_series_RSOS.setSelectedItems(mcb_series_RSOS.getItems());
			mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
			mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			mcb_dealer_RSOS.setSelectedItems(mcb_dealer_RSOS.getItems());

			if (AppController.flagDealerUser == true) {
				RSOS_controller.getView().byId("idBtn_RSOS_new").setVisible(true);
				var len = data.length;
				for (var i = 1; i <= len; i++) {
					var Id = "tbl_lbl_dealer_RSOS-__clone" + (i + 8 * (i - 1));  // 2+ 8*(2-1) =10
					RSOS_controller.getView().byId(Id).setVisible(false);
				}
				//	RSOS_controller.getView().byId("lblTbl_btn_RSOS").setVisible(true);
				
			}
		if (AppController.flagSIPUser == true ){//|| AppController.flgSoldOrderReqStatus == "Pending Fulfillment") {
		
					
				var len4 = data.length;
				for (var u = 1; u <= len4; u++) {
					var ID = "btn_linkVeh_RSOS-__clone"+((7+u) + 8 * ((7+u) - 8)); 
					console.log(ID);
					RSOS_controller.getView().byId(ID).setVisible(true);
				}
			}
			if (AppController.flagZoneUser == true) {
				var len2 = data.length;
				for (var j = 1; j <= len2; j++) {
					var Id2 = "tbl_lbl_dealer_RSOS-__clone" + (j + 8 * (j - 1));
					RSOS_controller.getView().byId(Id2).setVisible(true);
				}
			}
			if (AppController.flagNationalUser == true) {
				var len3 = data.length;
				for (var k = 1; k <= len3; k++) {
					var Id3 = "tbl_lbl_dealer_RSOS-__clone" + (k + 8 * (k - 1));
					RSOS_controller.getView().byId(Id3).setVisible(true);
				}
			}
		},

		_refresh: function () {

		},
		
		_dispalySoldOrderDetails: function (evt) {
			// var oTable = RSOS_controller.getView().byId("table_RSOS");
			// var sPath = evt.getSource().getBindingContext().sPath;
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// var model = oTable.getModel();
            
			RSOS_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {Soreq:evt.getSource().getText()}, true);
		},

	
		_createNewOrder: function () {
			RSOS_controller.getOwnerComponent().getRouter().navto("RetailSoldOrderA", {}, true);
		},
		onLinkVehicle: function (evt) {
			var d = new sap.ui.jsfragment(RSOS_controller.createId("idFrag_RSOS"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				RSOS_controller);
			RSOS_controller.getView().addDependent(d);
			
			d.open();
		},
		_searchNLink: function (evt) {
			var vinVal = RSOS_controller.byId("idFrag_RSOS--VinIdFrag").getValue();
			var vtinVal = RSOS_controller.byId("idFrag_RSOS--VtinIdFrag").getValue();
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		closeDialog: function () {
			//var oDialogBox = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.VinDialog", RSOS_controller);
			//	RSOS_controller.oDialogBox.close();
		}
	});

});