sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, JSONModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderA", {

		onInit: function () {
			this.getBrowserLanguage();
		//	var salesModel = this.getOwnerComponent().getModel('salesModel');
		//	console.log(salesModel);
		//	this.getView().setModel(salesModel);
		//	this.getView().updateBindings(true);
		
		},
		onValidateCustomer: function () {
			var errMsg = this.getView().getModel("i18n").getResourceBundle().getText("error1");
			sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Customer Conformation", sap.m.MessageBox.Action.OK, null, null);
		},
		listOfModelYear: function () {
		//	var omodelYearModel;
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var previousModelYear= currentModelYear-1;
			var nextModelYear= currentModelYear+1;

			var data={	"modelYear": [{
					"key": "1",
					"text": previousModelYear
				}, {
					"key": "2",
					"text": currentModelYear
				}, {
					"key": "3",
					"text": nextModelYear
				}]
				};
			var modelYearModel= new JSONModel(); //this.getOwnerComponent().getModel('modelYearModel');
			modelYearModel.setData(data);
		//	sap.ui.getCore().setModel(modelYearModel,"omodelYearModel");
			this.getView().byId("modelYrId").setModel(modelYearModel);
	//	console.log(modelYearModel);
		//	this.getView().setModel(modelYearModel);
		//	this.getView().getModel().updateBindings(true);
			},
		
		//	onBeforeRendering: function() {
		//
		//	},

			onAfterRendering: function() {
			this.listOfModelYear();
			}

		//	onExit: function() {
		//
		//	}

	});

});