sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var RSOS_controller,zrequest;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderSummary", {
		formatter: formatter,

		onInit: function () {
			RSOS_controller = this;
			RSOS_controller.getBrowserLanguage();
			
		AppController.getDealer();
			RSOS_controller._handleServiceSuffix_Series();
					var language = RSOS_controller.returnBrowserLanguage();
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if(language== "EN"){
			Obj = {
				"FSOSummary_Status": [
					
					{
					"key": "IN-PROGRESS",
					"text": "In-Progress"
				}, {
					"key": "PENDING FULFILMENT",
					"text": "Pending Fulfillment"
				}, {
					"key": "FILLED",
					"text": "Filled"
				}, {
					"key": "REGISTERED",
					"text": "Registered"
				}, {
					"key": "CANCELLED",
					"text": "Cancelled"
				}, {
					"key": "REQUESTED",
					"text": "Requested"
				}, {
					"key": "APPROVED",
					"text": "Approved"
				}, {
					"key": "REJECTED",
					"text": "Rejected"
				}, {
					"key": "COMPLETED",
					"text": "Completed"
				}]
			};}
			else{
				Obj = {
				"FSOSummary_Status": [
					{
					"key": "ALL",
					"text": "SELECT ALL"
					},
					{
					"key": "IN-PROGRESS",
					"text": "In-Progress"
				}, {
					"key": "PENDING FULFILMENT",
					"text": "Pending Fulfillment"
				}, {
					"key": "FILLED",
					"text": "Filled"
				}, {
					"key": "REGISTERED",
					"text": "Registered"
				}, {
					"key": "CANCELLED",
					"text": "Cancelled"
				}, {
					"key": "REQUESTED",
					"text": "Requested"
				}, {
					"key": "APPROVED",
					"text": "Approved"
				}, {
					"key": "REJECTED",
					"text": "Rejected"
				}, {
					"key": "COMPLETED",
					"text": "Completed"
				}]
			};
			

			}
			
			globalComboModel.setData(Obj);
			globalComboModel.updateBindings(true);
			sap.ui.getCore().setModel(globalComboModel, "globalComboModel");
			this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"),"globalComboModel");
			console.log(sap.ui.getCore().getModel("globalComboModel"));
			
			
			var AuditModel = new sap.ui.model.json.JSONModel();
			var Object;
			if(language== "EN"){
		Object = {	
				"AuditStatus": [{
		"key": "IN-PROGRESS",
		"text": "In-Progress"
	}, {
		"key": "COMPLETE",
		"text": "Complete"
	}, {
		"key": "",
		"text": "Blank"
	}]

			};
				
			}
			else{
				Object = {
				"AuditStatus": [{
		"key": "IN-PROGRESS",
		"text": "In-Progress"
	}, {
		"key": "COMPLETE",
		"text": "Complete"
	}, {
		"key": "",
		"text": "Blank"
	}]

			};
			

			}
			
			AuditModel.setData(Object);
			AuditModel.updateBindings(true);
			sap.ui.getCore().setModel(AuditModel, "AuditModel");
			this.getView().setModel(sap.ui.getCore().getModel("AuditModel"),"AuditModel");
			console.log(sap.ui.getCore().getModel("AuditModel"));
			// 	var oTbl = RSOS_controller.getView().byId("table_RSOS");
			// //-----------------------------------------------------------
			// //-----Binding without Fleet Reference----------------------
			// //----------------------------------------------------------
			// var items = oTbl.getBinding('rows');
			// items.filter([new Filter("FleetReference", FilterOperator.EQ, '')]);
			//-------------------------------------------------------------------------------
			// var data = oTbl.getModel().getData().ProductCollection;
		
			this.getOwnerComponent().getRouter().getRoute("RetailSoldOrderSummary").attachPatternMatched(this._onObjectMatched, this);
		
			// 	var host = RSOS_controller.host();
		
			// var url = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
			// 	"' and zzzadddata2 eq 'X'and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			// //	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			// $.ajax({
			// 	url: url,
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		if (seriesCB.getValue() !== "") {
			// 			//seriesCB.setValue(" ");
			// 			seriesCB.setSelectedKey(null);
			// 		}
			// 		//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data.d.results);
			// 		RSOA_controller.getView().setModel(oModel, "seriesModel");

			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		var errMsg = RSOA_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
			// 		sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
		},
		_onObjectMatched: function (oEvent) {

			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Emphasized');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Transparent');
			this.getView().byId("idmenu9").setType('Transparent');
		},
		onAfterRendering: function () {
			// this.getView().setModel(sap.ui.getCore().getModel("globalComboModel"),"globalComboModel");
			var mcb_series_RSOS = RSOS_controller.getView().byId("mcb_series_RSOS");
			var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
			var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
			var mcb_dealer_RSOS = RSOS_controller.getView().byId("mcb_dealer_RSOS");

			mcb_series_RSOS.setSelectedItems(mcb_series_RSOS.getItems());
			mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
			mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			mcb_dealer_RSOS.setSelectedItems(mcb_dealer_RSOS.getItems());
				var host = RSOS_controller.host();
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

	
			}
			// var salesOffice = this.getView().getModel("LoginUserModel").getProperty("/Zone");
		
			// 	var url = host + "/ZVMS_SOLD_ORDER_SRV/ZCDS_CONSOLEDATED_DLR?$filter=SalesOffice eq '"+salesOffice+"' and Division eq '"+this.sDivision+"'";
			// //	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			// $.ajax({
			// 	url: url,
			// 	method: 'GET',
			// 	async: false,
			// 	dataType: 'json',
			// 	success: function (data, textStatus, jqXHR) {
			// 		if (mcb_dealer_RSOS.getValue() !== "") {
			// 			//seriesCB.setValue(" ");
			// 			mcb_dealer_RSOS.setSelectedKey(null);
			// 		}
			// 		//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
			// 		var oModel = new sap.ui.model.json.JSONModel();
			// 		oModel.setData(data.d.results);
			// 		RSOS_controller.getView().setModel(oModel, "dealerModel");

			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
			// 		sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
			// 			.m.MessageBox.Action.OK, null, null);
			// 	}
			// });
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
		
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				// var dfilter = [];
				// for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
				// 	dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey()));
				// }
				// // if (dfilter.length > 0) {
				// 	var filter_dealers = new Filter(dfilter, false);
				// 	//---------------------------------------------------------------
				// 	var items1 = this.getView().byId("table_RSOS").getBinding('rows');
				// 	items1.filter(filter_dealers);
				
				RSOS_controller._refresh();
				// }
			}
			//================================================================================================== 
			// if (AppController.flagDealerUser == true) {
			// 	RSOS_controller.getView().byId("idBtn_RSOS_new").setVisible(true);
			// 	var len = data.length;
			// 	for (var i = 1; i <= len; i++) {
			// 		var Id = "tbl_lbl_dealer_RSOS-__clone" + (i + 8 * (i - 1)); // 2+ 8*(2-1) =10
			// 		RSOS_controller.getView().byId(Id).setVisible(false);
			// 	}
			// 	//	RSOS_controller.getView().byId("lblTbl_btn_RSOS").setVisible(true);

			// }
			// if (AppController.flagSIPUser == true) { //|| AppController.flgSoldOrderReqStatus == "Pending Fulfillment") {

			// 	var len4 = data.length;
			// 	for (var u = 1; u <= len4; u++) {
			// 		var ID = "btn_linkVeh_RSOS-__clone" + ((7 + u) + 8 * ((7 + u) - 8));
			// 		console.log(ID);
			// 		RSOS_controller.getView().byId(ID).setVisible(true);
			// 	}
			// }
			// if (AppController.flagZoneUser == true) {
			// 	var len2 = data.length;
			// 	for (var j = 1; j <= len2; j++) {
			// 		var Id2 = "tbl_lbl_dealer_RSOS-__clone" + (j + 8 * (j - 1));
			// 		RSOS_controller.getView().byId(Id2).setVisible(true);
			// 	}
			// }
			// if (AppController.flagNationalUser == true) {
			// 	var len3 = data.length;
			// 	for (var k = 1; k <= len3; k++) {
			// 		var Id3 = "tbl_lbl_dealer_RSOS-__clone" + (k + 8 * (k - 1));
			// 		RSOS_controller.getView().byId(Id3).setVisible(true);
			// 	}
			// }
		},
		_handleServiceSuffix_Series: function () {
			var host = RSOS_controller.host();
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			var brand;
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					brand = "TOY";

				} else { // set the lexus logo
					brand = "LEX";

					// }
				}
			}
			var oUrl = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_SERIES?$filter=Division eq '" + brand +
				"' and zzzadddata2 eq 'X' and ModelSeriesNo ne 'L/C'and zzzadddata4 ne 0 &$orderby=zzzadddata4 asc";
			$.ajax({
				url: oUrl,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results);
					// if (oModel.length > 0) {
						
          //oModel.getData().ZC_SERIES.unshift({
          //  "{seriesModel>ModelSeriesNo}": "All",
          //  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
          //})
        // }
					RSOS_controller.getView().setModel(oModel, "seriesModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");

					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		_refresh: function (oEvent) {
			var allfilter = [];
			//-----------------Sold Order Status-----------------
			var afilter = [];
			// var status_all = false;
			// 	var mcb_rsStatus_RSOS = RSOS_controller.getView().byId("mcb_rsStatus_RSOS");
			// var mcb_auditStatus_RSOS = RSOS_controller.getView().byId("mcb_auditStatus_RSOS");
			// for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
			// 	if(this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey()==="ALL")
			// 	{
			// 			mcb_rsStatus_RSOS.setSelectedItems(mcb_rsStatus_RSOS.getItems());
			// 			status_all = true;

			// 			break;
			// 	}
			// }
			// if(status_all ==false)
			// {
			// 			mcb_rsStatus_RSOS.setSelectedItems(null);

			// }
			for (var i = 0; i < this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems().length; i++) {
			
				afilter.push(new Filter("ZzsoStatus", FilterOperator.EQ, this.getView().byId("mcb_rsStatus_RSOS").getSelectedItems()[i].getKey()));
			}
			

			if (afilter.length > 0) {
				var filter_sstatus = new Filter(afilter, false);
				allfilter.push(filter_sstatus);
			}
			//-----------------Audit Status-----------------
				var asfilter = [];
				// var audit_all =false;
			// 	for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
				
			// 		if(this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey()==="ALL")
			// 	{
			// 			mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
			// 			audit_all = true;

			// 			break;		
			// 	}
			// }
			// if(audit_all == false)
			// {
			// 	mcb_auditStatus_RSOS.setSelectedItems(null);
			// }
			for (var i = 0; i < this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems().length; i++) {
				// 	if(this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey()==="ALL")
				// {
				// 		mcb_auditStatus_RSOS.setSelectedItems(mcb_auditStatus_RSOS.getItems());
	

				// 		break;		
				// }
				asfilter.push(new Filter("ZzAuditStatus", FilterOperator.EQ, this.getView().byId("mcb_auditStatus_RSOS").getSelectedItems()[i].getKey()));
			}
				

			if (asfilter.length > 0) {
				var filter_asstatus = new Filter(asfilter, false);
				allfilter.push(filter_asstatus);
			}
			//---------------------------------------------------------------
			//-----------------Series-----------------
			var Sfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_series_RSOS").getSelectedItems().length; i++) {
				Sfilter.push(new Filter("Zzseries", FilterOperator.EQ, this.getView().byId("mcb_series_RSOS").getSelectedItems()[i].getKey()));
			}
			

			if (Sfilter.length > 0) {
				var filter_series = new Filter(Sfilter, false);
				allfilter.push(filter_series);
			}
			//---------------------------------------------------------------
			//-----------------Dealers-----------------
			var dfilter = [];
			for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
				dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey()));
			}
			if (dfilter.length > 0) {
				var filter_dealers = new Filter(dfilter, false);
				allfilter.push(filter_dealers);
			}
			//---------------------------------------------------------------
			var filter_all = new Filter([filter_sstatus, filter_asstatus, filter_series, filter_dealers, new Filter("FleetReference", FilterOperator.EQ, '')],
				true);
			var items = this.getView().byId("table_RSOS").getBinding('rows');
			items.filter(filter_all);

		},

		_dispalySoldOrderDetails: function (evt) {
			// var oTable = RSOS_controller.getView().byId("table_RSOS");
			// var sPath = evt.getSource().getBindingContext().sPath;
			// var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			// var model = oTable.getModel();

			RSOS_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
		},

		_createNewOrder: function () {
			RSOS_controller.getOwnerComponent().getRouter().navto("RetailSoldOrderA", {}, true);
		},
		onLinkVehicle: function (evt) {
			zrequest = evt.getSource().getBindingContext('mainservices').getProperty('ZzsoReqNo');
			var d = new sap.ui.jsfragment(RSOS_controller.createId("idFrag_RSOS"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				RSOS_controller);
			RSOS_controller.getView().addDependent(d);

			d.open();
		},
		_searchNLink: function (evt) {
			var vinVal = RSOS_controller.byId("idFrag_RSOS--VinIdFrag").getValue();
			var vtinVal = RSOS_controller.byId("idFrag_RSOS--VtinIdFrag").getValue();
			var V_No;
			if (vinVal == "" && vtinVal == "") {
				var errForm = formatter.formatErrorType("SO000010");
				var errMsg = RSOS_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
			else {
					if (vinVal !== "") {
						V_No = vinVal;
					} else {
						V_No = vtinVal;
					}
					RSOS_controller.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
						method: "POST",
						urlParameters: {
							Zzvtn: V_No,
							ZzsoReqNo: zrequest
								//	Endcustomer:
						}, // function import parameters
						success: function (oData, response) {
							if (oData.Type == 'E') {
								var oBundle = RSOS_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000013", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
									.m.MessageBox.Action.OK, null, null);
							} else {
								var oBundle = RSOS_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000014", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap
									.m.MessageBox.Action.OK, null, null);
								var oTbl = RSOS_controller.getView().byId("tbl_FSOD");
								var items = oTbl.getBinding('rows');
								items.refresh();
							}

						},
						error: function (oError) {

						}
					});

				}
		},

		closeDialog: function () {
			//var oDialogBox = sap.ui.xmlfragment("toyota.ca.SoldOrder.view.fragments.VinDialog", RSOS_controller);
			//	RSOS_controller.oDialogBox.close();
		}
	});

});