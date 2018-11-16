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
		onValidateCustomer: function () {
			var errMsg = this.getView().getModel("i18n").getResourceBundle().getText("error1");
			//sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Customer Conformation", sap.m.MessageBox.Action.OK, null, null,{contentWidth:"5rem"});
			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Customer Conformation",
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

			var valSalesType = this.getView().byId("SalesType_RSOB").getValue();
			var valContractDate = this.getView().byId("ContractDate_RSOB").getValue();
			var valAddress = this.getView().byId("Address_RSOB").getValue();
			var valCity = this.getView().byId("City_RSOB").getValue();
			var valProvince = this.getView().byId("Province_RSOB").getValue();
			var valPostalCode = this.getView().byId("PostalCode_RSOB").getValue();
			var valLicense = this.getView().byId("License_RSOB").getValue();
var valCustName = this.getView().byId("CustName_RSOB").getValue();
			if (valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valLicense == ""||valCustName=="") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} 
			if (this.validateFlagB == false) {
				var errForm2 = formatter.formatErrorType("SO00004");
				var errMsg2 = this.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.capractise.view.RetailSoldOrderB
		 */
		//	onAfterRendering: function() {
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