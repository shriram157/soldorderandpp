sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel"
], function (BaseController, ResourceModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RSOView_ManageSoldOrder", {
		/*onInit: function () {
			var i18nModel = new ResourceModel({
				bundleName: "toyota.ca.SoldOrder.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");
		},*/
		onInit: function () {
			this.getBrowserLanguage();
		},
		_onDeleteAttachment: function (evt) {
			var oTable = this.getView().byId("table_RSOViewManageSO");
			console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			var model = oTable.getModel();
			var data = model.getProperty("/ProductCollection");
			var removed = data.splice(oIndex, 1);
			model.setProperty("/ProductCollection", data);
			console.log(data);
			oTable.getModel().refresh();
			this.getView().getModel().refresh(true);
	
			//	 this.getView().getModel().remove(sPath);
	//	 var oObj = oTable.getModel().getObject(sPath);

			//	 console.log(this.getView().getModel().getData().ProductCollection);
			/*var oModel = sap.ui.getCore().getModel();
			var oRowData = oModel.getProperty(sPath);*/
			//row .splice(i,1)
		},
		browse:function(){
		console.log("in upload complete")	;
		},
		_oBrowse: function () {
			console.log("in upload progress")	;
		var textArea=this.getView().byId("idComments_TA_RSO_ManageSO");
		var text=textArea.getValue();
		console.log(text);
		if(text==""){
			textArea.setValueState("Error");
			textArea.setValueStateText("Fill the comments");
		}
		},
	
		_ohandleUploadComplete: function () {

		},

		onAfterRendering: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "S09732984"; // this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
			this.getView().byId("label_MangSoldOrderid").setText(sMsg);
		}

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onExit: function() {
		//
		//	}

	});

});