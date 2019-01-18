sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var RSOB_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderB", {
		formatter: formatter,
		
		onInit: function () {
			RSOB_controller = this;
			RSOB_controller.getBrowserLanguage();
			RSOB_controller.validateFlagB = false;
			RSOB_controller.getSO();
		},
		onBeforeRendering: function () {
			console.log(RSOB_controller.getView().byId("form1_RSOB").getTitle());
			RSOB_controller.getView().byId("form1_RSOB").destroyTitle();
			RSOB_controller.getView().byId("form2_RSOB").destroyTitle();
		},
		getSO: function () {
			var host = RSOB_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?sap-client=200&$format=json";
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000009'&$format=json";
			$.ajax({
				type: 'GET',
				url: oURL,
				cache: false,
				success: function (data) {
					console.log(data.d.results[0]);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results[0]);
					RSOB_controller.getView().setModel(oModel, "RSOB_Model");
				},
				error: function (data) {
					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}

			});
		},
		onValidateCustomer: function () {
			var errMsg = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText("error1");
			var title = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText("title5");
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
				//	icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: sap.m.MessageBox.Action.OK,
				onClose: null,
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
			RSOB_controller.validateFlagB = true;
		},

		_onSubmit: function () {
			var flag1 = false;
			var flag2 = false;
			var errMsg2;
			var errMsg;
			var valSalesType = RSOB_controller.getView().byId("SalesType_RSOB").getValue();
			var valContractDate = RSOB_controller.getView().byId("ContractDate_RSOB").getValue();
			var valAddress = RSOB_controller.getView().byId("Address_RSOB").getValue();
			var valCity = RSOB_controller.getView().byId("City_RSOB").getValue();
			var valProvince = RSOB_controller.getView().byId("Province_RSOB").getValue();
			var valPostalCode = RSOB_controller.getView().byId("PostalCode_RSOB").getValue();
			var valLicense = RSOB_controller.getView().byId("License_RSOB").getValue();
			var valCustName = RSOB_controller.getView().byId("CustName_RSOB").getValue();
			if (valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valLicense == "" || valCustName == "") {
				flag1 = true;

			} else if (RSOB_controller.validateFlagB == false) {
				flag2 = true;

			} else if (flag1 == true && flag2 == false) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = RSOB_controller.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
						RSOB_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder"); //page 3
			}
		}

	});

});