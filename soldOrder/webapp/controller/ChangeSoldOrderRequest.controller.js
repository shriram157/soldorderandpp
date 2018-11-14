sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
		"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, ResourceModel,formatter) {
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
			day1.setDate(today.getDate()+1);
			var day5 = new Date();
			day5.setDate(today.getDate()+6);
			

			this.getView().byId("etaFrom_CSOR").setMinDate(day1);
			this.getView().byId("etaTo_CSOR").setMinDate(day1);
			this.getView().byId("etaTo_CSOR").setMaxDate(day5);
		},
		_onSubmit: function () {
			var valModel = this.getView().byId("model_CSOR").getValue();
			var valSuffix = this.getView().byId("suffix_CSOR").getValue();
			var valApx = this.getView().byId("apx_CSOR").getValue();
			var valColour = this.getView().byId("colour_CSOR").getValue();
			var valFrom = this.getView().byId("etaFrom_CSOR").getValue();
			var valTo = this.getView().byId("etaTo_CSOR").getValue();
			if (valModel == "" || valSuffix == "" || valApx == "" || valColour == "" || valFrom == "" || valTo == "") {
			var errMsg=	formatter.formatErrorType("SO00003"); 
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		}
	
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf toyota.ca.SoldOrder.view.ChangeSoldOrderRequest
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.ChangeSoldOrderRequest
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.ChangeSoldOrderRequest
		 */
		//	onExit: function() {
		//
		//	}

	});

});