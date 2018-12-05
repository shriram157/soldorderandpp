sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
var NFSO_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.NationalFleetSoldOrderView", {
		formatter: formatter,
		onInit: function () {
			NFSO_controller=this;
			NFSO_controller.getBrowserLanguage();
			NFSO_controller.flagSipUser = false;
			NFSO_controller.flagTciNationalUser = false;
			NFSO_controller.flagOwnershipUploaded = false;
			NFSO_controller.flagPriceProtectionRequestStatus = "";
			NFSO_controller.requestStatus = "";
			NFSO_controller._sipUserToTrue();
			NFSO_controller._flagTciNationalUserToTrue();
		},
		onAfterRendering:function(){
			NFSO_controller.getView().byId("comments_NFSO").setRequired(true);	
		},
		_sipUserToTrue: function () {

		},
		_flagTciNationalUserToTrue: function () {
			NFSO_controller.flagTciNationalUser = true;
			NFSO_controller.getView().byId("linkId_NFSOV").setVisible(true);
		},
		_approvePriceProtectionDetails: function () {
			NFSO_controller.flagPriceProtectionRequestStatus = "Approved";
		},
		_rejectPriceProtectionDetails: function () {
			NFSO_controller.flagPriceProtectionRequestStatus = "Rejected";
		},
		_onDelete: function (evt) {
			var evtContext = evt.getSource().getBindingContext(); // "/ProductCollection/0"
			var errMsg = NFSO_controller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title=NFSO_controller.getView().getModel("i18n").getResourceBundle().getText("title1");
			var icon =new sap.ui.core.Icon({src:"sap-icon://alert", size:"2rem"});
			var msg=new sap.m.HBox({items:[icon,new sap.m.Text({text:errMsg})]});
			sap.m.MessageBox.show(msg, {
				//icon: sap.m.MessageBox.Icon.WARNING,
				title:title,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (sAction) {
					if (sAction == "YES") {
						NFSO_controller.deleteAtt(evtContext);
					} else {
						//
					}
				},
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
		},
			deleteAtt: function (evtContext) {
			var oTable = NFSO_controller.getView().byId("tbl_NFSOV");
			var sPath = evtContext.sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			var model = oTable.getModel();
			var data = model.getProperty("/ProductCollection");
			data.splice(oIndex, 1);
			model.setProperty("/ProductCollection", data);
			oTable.getModel().refresh();
			NFSO_controller.getView().getModel().refresh(true);
		},
		
		_addAttachment: function () {
			NFSO_controller.flagOwnershipUploaded = true;
			var com=NFSO_controller.getView().byId("comments_NFSO").getValue();
				if (com == "") {
				var errForm = formatter.formatErrorType("SO000012");
				var errMsg = NFSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} 
			},
			
		_openFile:function(){
			var fileUrl="https://google.com";
			parent.window.open(fileUrl, '_blank');
		}
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf toyota.ca.SoldOrder.view.NationalFleetSoldOrderView
			 */
			//	onInit: function() {
			//
			//	},

		/**
		 * Similar to onAfterRendering, but NFSO_controller hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.SoldOrder.view.NationalFleetSoldOrderView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * NFSO_controller hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.SoldOrder.view.NationalFleetSoldOrderView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use NFSO_controller one to free resources and finalize activities.
		 * @memberOf toyota.ca.SoldOrder.view.NationalFleetSoldOrderView
		 */
		//	onExit: function() {
		//
		//	}

	});

});