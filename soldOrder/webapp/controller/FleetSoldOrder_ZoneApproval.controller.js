sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
var FSO_Z_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrder_ZoneApproval", {
		formatter: formatter,
		
		onInit: function () {
			FSO_Z_controller=this;
			FSO_Z_controller.getBrowserLanguage();
			// FSO_Z_controller.flagZoneUser=false;
			// FSO_Z_controller.zoneUserToTrue();
		},
		/*zoneUserToTrue:function(){
			FSO_Z_controller.flagZoneUser=true;
			FSO_Z_controller.getView().byId("btn_approve_FSOZA").setVisible(true);
			FSO_Z_controller.getView().byId("btn_reject_FSOZA").setVisible(true);
			FSO_Z_controller.getView().byId("btn_back_FSOZA").setVisible(true); 
			FSO_Z_controller.getView().byId("orderType_FSOZA").setEnabled(true);
		},*/
		_approveFleetSoldRequest: function () {

		},
		_rejectFleetSoldRequest: function () {

		},
		onAfterRendering: function () {
			var oBundle = FSO_Z_controller.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "09787878784"; // FSO_Z_controller.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("zoneApprovalTitle", [sRecipient]);
			FSO_Z_controller.getView().byId("label_FSO_ZoneApprovaid").setText(sMsg);

			if (AppController.flagZoneUser == true) {
				FSO_Z_controller.getView().byId("btn_approve_FSOZA").setVisible(true);
				FSO_Z_controller.getView().byId("btn_reject_FSOZA").setVisible(true);
				FSO_Z_controller.getView().byId("btn_back_FSOZA").setVisible(true);
				FSO_Z_controller.getView().byId("orderType_FSOZA").setEnabled(true);
			}

		}


	});

});