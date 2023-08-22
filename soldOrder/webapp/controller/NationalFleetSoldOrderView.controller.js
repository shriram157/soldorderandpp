sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, formatter) {
	"use strict";
	var NFSO_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.NationalFleetSoldOrderView", {
		formatter: formatter,
		onInit: function () {
			NFSO_controller = this;
			// NFSO_controller.getBrowserLanguage();

			// var oRouter = this.getRouter(); 
			// oRouter.attachMatched(this._onRouteMatched, this);
			debugger;
			this.getOwnerComponent().getRouter().getRoute("NationalFleetSoldOrderView").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			var requestid = oArgs.Soreq;

			NFSO_controller._getSoDetails(requestid);
			debugger;
			oView = this.getView();

			// oView.bindElement({
			// 	path : "/Employees(" + oArgs.employeeId + ")",
			// 	events : {
			// 		change: this._onBindingChange.bind(this),
			// 		dataRequested: function (oEvent) {
			// 			oView.setBusy(true);
			// 		},
			// 		dataReceived: function (oEvent) {
			// 			oView.setBusy(false);
			// 		}
			// 	}
			// });
		},

		_getSoDetails: function (req) {
			//"""""""""""""""""""""""""""""""""""""""
			var host = NFSO_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$format=json";
			//attachPatternMatched

			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet('" + req + "')";

			var zmodel = NFSO_controller.getView().getModel("mainservices");

			var sObjectPath = "/Retail_Sold_OrderSet('" + req + "')";
			var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();

			var sMsg = oBundle.getText("NationalFleetSoldOrderViewtitle", [req]);
			NFSO_controller.getView().byId("NationalFleetSoldOrderViewid").setText(sMsg);

			this.getView().bindElement({

				path: sObjectPath,
				model: "mainservices",
				events: {
					// change: function (oEvent) {
					// 	NFSO_controller.getView().getElementBinding('mainservices').refresh();
					// 	// Filter for Display Data Sold Order
					// 	sap.ui.getCore().setModel(new JSONModel({
					// 		model: NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel'),
					// 		modelyear: NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr'),
					// 		suffix: NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix'),
					// 		color: NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol'),
					// 		series: NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries')
					// 	}), 'Vehicle_Selection');
					// 	// Model
					// 	if (NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel')) {
					// 		var model = NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmodel');
					// 		var model_CSOR_items = NFSO_controller.getView().byId("model_CSOR").getBinding("items");
					// 		model_CSOR_items.filter([new Filter("Model", FilterOperator.EQ, model)]);
					// 	}
					// 	// Suffix
					// 	if (NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix')) {
					// 		var suffix = NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzsuffix');
					// 		var suffix_CSOR_items = NFSO_controller.getView().byId("suffix_CSOR").getBinding("items");
					// 		suffix_CSOR_items.filter([new Filter("Suffix", FilterOperator.EQ, suffix)]);
					// 	}
					// 	// APX
					// 	if (NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzapx')) {
					// 		var apx = NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzapx');
					// 		var apx_CSOR_items = NFSO_controller.getView().byId("apx_CSOR").getBinding("items");
					// 		apx_CSOR_items.filter([new Filter("zzapx", FilterOperator.EQ, apx)]);
					// 	}
					// 	// Color
					// 	if (NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol')) {
					// 		var color = NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzextcol');
					// 		var color_CSOR_items = NFSO_controller.getView().byId("colour_CSOR").getBinding("items");
					// 		color_CSOR_items.filter([new Filter("ExteriorColorCode", FilterOperator.EQ, color)]);
					// 	}
					// 	//----------------------------------------------------------
					// 	// Get Customer Details by Customer No From API
					// 	//	var x = 'W27687139';
					// 	//----------------------------------------------------------
					// 	if (NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu')) {
					// 		var zcustomerNumber = NFSO_controller.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzendcu');
					// 		var url = "/node/tci2/internal api/v1.0/customer/cdms/customers/profile/" + zcustomerNumber;
					// 		//?customerNumber=" +

					// 		$.ajax({
					// 			url: url,
					// 			headers: {
					// 				accept: 'application/json'
					// 					// 'x-ibm-client-secret': 'Q7gP8pI0gU5eF8wM2jQ3gB8pQ5mA8rP8nO5dR1iY8qW2kS0wA0',
					// 					// 'x-ibm-client-id': 'd4d033d5-c49e-4394-b3e3-42564296ec65'
					// 			},
					// 			type: "GET",
					// 			dataType: "json",
					// 			// data: soapMessage,
					// 			contentType: "text/xml; charset=\"utf-8\"",
					// 			success: function (data, textStatus, jqXHR) {
					// 				if (data.customers[0]) {
					// 					zcustomerModel.setData(data.customers[0]);
					// 				}
					// 			},
					// 			error: function (request, errorText, errorCode) {}
					// 		});
					// 	}
					// },
					// dataReceived: function (oData) {
					// 	//filteration
					// 	if (oData.getParameters().data.Zzmodel) {
					// 		var model_CSOR_items = NFSO_controller.getView().byId("model_CSOR").getBinding("items");
					// 		model_CSOR_items.filter([new Filter("Model", FilterOperator.EQ, oData.getParameters().data.Zzmodel)]);
					// 	}
					// }
				}
			});

		},

		onAfterRendering: function () {
			// if (AppController.flagTCINationalUser == true) {

			// var oTbl=NFSO_controller.getView().byId("tbl_NFSOV");
			// var data=oTbl.getModel().getData().ProductCollection;

			// var len=data.length;

			// for(var i=0;i<len;i++){
			// 	var Id="linkId_NFSOV-__clone"+i*3;
			// 	NFSO_controller.getView().byId(Id).setVisible(true);
			// }
			// }
		},

		_approvePriceProtectionDetails: function () {
			AppController.flgPriceProtectionStatus = "Approved";
		},
		_rejectPriceProtectionDetails: function () {
			AppController.flgPriceProtectionStatus = "Rejected";
		},
		_onDelete: function (evt) {
			var evtContext = evt.getSource().getBindingContext(); // "/ProductCollection/0"
			var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("title1");
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
				//icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
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
			var com = NFSO_controller.getView().byId("comments_NFSO").getValue();
			if (com == "") {
				var errForm = formatter.formatErrorType("SO000012");
				var errMsg = sap.ui.getCore().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				AppController.flgOwnershipUploaded = true;
			}
		},

		_openFile: function () {
			var fileUrl = "https://google.com";
			parent.window.open(fileUrl, '_blank');
		}

	});

});