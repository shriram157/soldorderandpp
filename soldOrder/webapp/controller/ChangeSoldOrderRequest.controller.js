sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, ResourceModel, formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.ChangeSoldOrderRequest", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.SoldOrder.view.ChangeSoldOrderRequest
		 */
		onInit: function () {
			this.getBrowserLanguage();

			var today = new Date();
			var day1 = new Date();
			day1.setDate(today.getDate() + 1);
			this.getView().byId("etaFrom_CSOR").setMinDate(day1);
			
		},
	
			_handleChange: function () {
			var etaFrom = this.getView().byId("etaFrom_CSOR").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				this.getView().byId("etaTo_CSOR").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
		},
		_onSubmit: function () {
			var valModel = this.getView().byId("model_CSOR").getValue();
			var valSuffix = this.getView().byId("suffix_CSOR").getValue();
			var valApx = this.getView().byId("apx_CSOR").getValue();
			var valColour = this.getView().byId("colour_CSOR").getValue();
			var valFrom = this.getView().byId("etaFrom_CSOR").getValue();
			var valTo = this.getView().byId("etaTo_CSOR").getValue();
			if (valModel == "" || valSuffix == "" || valApx == "" || valColour == "" || valFrom == "" || valTo == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		}

	
	});

});