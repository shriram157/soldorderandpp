sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.notFound", {
		formatter: formatter,
		onInit: function () {
			// this.getBrowserLanguage();
		}
	});

});