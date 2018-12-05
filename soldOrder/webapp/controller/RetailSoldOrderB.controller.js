sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	//	var validateFlag = false;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderB", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		onInit: function () {
			this.getBrowserLanguage();
			this.validateFlagB = false;
		},
		onBeforeRendering: function () {
			console.log(this.getView().byId("form1_RSOB").getTitle());
			this.getView().byId("form1_RSOB").destroyTitle();
			this.getView().byId("form2_RSOB").destroyTitle();
		},

		onValidateCustomer: function () {
			var errMsg = this.getView().getModel("i18n").getResourceBundle().getText("error1");
			var title = this.getView().getModel("i18n").getResourceBundle().getText("title5");
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
			this.validateFlagB = true;
		},

		_onSubmit: function () {
			var flag1 = false;
			var flag2 = false;
			var errMsg2;
			var errMsg;
			var valSalesType = this.getView().byId("SalesType_RSOB").getValue();
			var valContractDate = this.getView().byId("ContractDate_RSOB").getValue();
			var valAddress = this.getView().byId("Address_RSOB").getValue();
			var valCity = this.getView().byId("City_RSOB").getValue();
			var valProvince = this.getView().byId("Province_RSOB").getValue();
			var valPostalCode = this.getView().byId("PostalCode_RSOB").getValue();
			var valLicense = this.getView().byId("License_RSOB").getValue();
			var valCustName = this.getView().byId("CustName_RSOB").getValue();
			if (valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valLicense == "" || valCustName == "") {
				flag1 = true;

			}
			if (this.validateFlagB == false) {
				flag2 = true;

			}
			if (flag1 == true && flag2 == false) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			if (flag1 == false && flag2 == true) {
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = this.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
			if (flag1 == true && flag2 == true) {
				var errForm = formatter.formatErrorType("SO00003");
				errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				var errForm2 = formatter.formatErrorType("SO00004");
				errMsg2 = this.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				var errMsg3 = errMsg + "\n" + errMsg2;
				sap.m.MessageBox.show(errMsg3, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		}

		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		//	onExit: function() {
		//
		//	}

	});

});