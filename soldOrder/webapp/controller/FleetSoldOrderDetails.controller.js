sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var FSOD_controller, zrequest,clicks=0,num=0,filter=false;
	return BaseController.extend("toyota.ca.SoldOrder.controller.FleetSoldOrderDetails", {
		formatter: formatter,
		onInit: function () {
			FSOD_controller = this;
			FSOD_controller.getBrowserLanguage();
			AppController.getDealer();
			this.getOwnerComponent().getRouter().getRoute("FleetSoldOrderDetails").attachPatternMatched(this._onObjectMatched, this);
			var language = FSOD_controller.returnBrowserLanguage();
			var globalComboModel = new sap.ui.model.json.JSONModel();
			var Obj;
			if(language== "EN"){
			Obj = {
				"FSODetails_Status": [{
		"key": "AUDIT-COMPLETED",
		"text": "AUDIT-COMPLETED"
	}, {
		"key": "PENDING FULFILLMENT",
		"text": "PENDING FULFILLMENT"
	}, {
		"key": "FAILED",
		"text": "FAILED"
	}, {
		"key": "FILLED",
		"text": "FILLED"
	}, {
		"key": "AUDIT-IN PROGRESS",
		"text": "AUDIT-IN PROGRESS"
	}, {
		"key": "REGISTERED",
		"text": "REGISTERED"
	}, {
		"key": "CANCELLED",
		"text": "CANCELLED"
	}]
			};}
			else{
				Obj = {
				"FSODetails_Status": [{
		"key": "AUDIT-COMPLETED",
		"text": "AUDIT-COMPLETED"
	}, {
		"key": "PENDING FULFILLMENT",
		"text": "PENDING FULFILLMENT"
	}, {
		"key": "FAILED",
		"text": "FAILED"
	}, {
		"key": "FILLED",
		"text": "FILLED"
	}, {
		"key": "AUDIT-IN PROGRESS",
		"text": "AUDIT-IN PROGRESS"
	}, {
		"key": "REGISTERED",
		"text": "REGISTERED"
	}, {
		"key": "CANCELLED",
		"text": "CANCELLED"
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
		Object = {"FSODetail_AuditStatus": [{
		"key": "",
		"text": "ALL"
	},{
		"key": "IN-PROGRESS",
		"text": "IN-PROGRESS"
	}, {
		"key": "COMPLETE",
		"text": "COMPLETE"
	}],
			
		};
				
			}
			else{
				Object = {"FSODetail_AuditStatus": [{
		"key": "",
		"text": "ALL"
	},{
		"key": "IN-PROGRESS",
		"text": "IN-PROGRESS"
	}, {
		"key": "COMPLETE",
		"text": "COMPLETE"
	}],};
			

			}
			
			AuditModel.setData(Object);
			AuditModel.updateBindings(true);
			sap.ui.getCore().setModel(AuditModel, "AuditModel");
			this.getView().setModel(sap.ui.getCore().getModel("AuditModel"),"AuditModel");
			console.log(sap.ui.getCore().getModel("AuditModel"));
		},
		_onObjectMatched: function (oEvent) {
			this.getView().byId("idmenu1").setType('Transparent');
			this.getView().byId("idmenu2").setType('Transparent');
			this.getView().byId("idmenu3").setType('Transparent');
			this.getView().byId("idmenu4").setType('Transparent');
			this.getView().byId("idmenu5").setType('Emphasized');
			this.getView().byId("idmenu9").setType('Transparent');
		},

		onBeforeRendering: function () {
			if (AppController.flagZoneUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagNationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
			if (AppController.flagTCINationalUser == true) {
				FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			}
		},

		onAfterRendering: function () {
			//-----------------------------------------------------------
			//-----Binding without Fleet Reference----------------------
			//----------------------------------------------------------
			// var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
			// var items = oTbl.getBinding('rows');
			// items.filter([new Filter("FleetReference", FilterOperator.EQ, 'X')], true);
			//-------------------------------------------------------------------------------
			var mcb_status_FSOD = FSOD_controller.getView().byId("mcb_status_FSOD");
			var mcb_series_FSOD = FSOD_controller.getView().byId("mcb_series_FSOD");
			var mcb_ordTyp_FSOD = FSOD_controller.getView().byId("mcb_ordTyp_FSOD");
			var mcb_auditStatus_FSOD = FSOD_controller.getView().byId("mcb_auditStatus_FSOD");
			var mcb_dealer_FSOD = FSOD_controller.getView().byId("mcb_dealer_FSOD");

			// mcb_series_FSOD.setSelectedItems(mcb_series_FSOD.getItems());
			mcb_status_FSOD.setSelectedItems(mcb_status_FSOD.getItems());
			mcb_auditStatus_FSOD.setSelectedItems(mcb_auditStatus_FSOD.getItems());
			mcb_dealer_FSOD.setSelectedItems(mcb_dealer_FSOD.getItems());
				var page=0;
			page=clicks+1;
			FSOD_controller.getView().byId("txtPageNum").setText("Page"+page);
			// mcb_ordTyp_FSOD.setSelectedItems(mcb_ordTyp_FSOD.getItems());
			//	mcb_ordTyp_FSOD.setSelectedKey("4");
			// console.log(mcb_series_FSOD.getItems());
			// console.log(mcb_series_FSOD.getSelectedItems());
			//=======================================================================================================
			//==================Start Binidng By Dealer=========================================================
			//=====================================================================================================
			var dfilter = [];
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
			FSOD_controller._refresh();
				// for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
				// 	dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey()));
				// }
				
				// if (dfilter.length > 0) {
				// 	var filter_dealers = new Filter(dfilter, false);
				// 	//---------------------------------------------------------------
				// 	var items = this.getView().byId("tbl_FSOD").getBinding('rows');
				// 	items.filter(filter_dealers);
				}
				else
				{
					
					
					
					var host = FSOD_controller.host();
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			// 	for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
			// var dealer = this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
			// if(i==((this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
				}
			// }
			//=====================================================================
			// if (AppController.flagZoneUser == true) {
			// 	FSOD_controller.getView().byId("lbl_dealer_FSOD").setVisible(true);
			// 	//FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			// 	var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
			// 	var data = oTbl.getModel().getData().ProductCollection;
			// 	var len = data.length;
			// 	for (var i = 1; i <= len; i++) {
			// 		var Id = "tbl_val_dealer_FSOD-__clone" + (i + 11 * (i - 1));
			// 		FSOD_controller.getView().byId(Id).setVisible(true);
			// 	}
			// 	FSOD_controller.getView().byId(Id).setVisible(true);
			// }
			// if (AppController.flagNationalUser == true) {
			// 	FSOD_controller.getView().byId("lbl_dealer_FSOD").setVisible(true);
			// 	//	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			// 	var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
			// 	var data = oTbl.getModel().getData().ProductCollection;
			// 	var len = data.length;
			// 	for (var i = 1; i <= len; i++) {
			// 		var Id = "tbl_val_dealer_FSOD-__clone" + (i + 11 * (i - 1));
			// 		FSOD_controller.getView().byId(Id).setVisible(true);
			// 	}
			// 	FSOD_controller.getView().byId(Id).setVisible(true);
			// }
			// if (AppController.flagTCINationalUser == true) {
			// 	FSOD_controller.getView().byId("lbl_dealer_FSOD").setVisible(true);
			// 	//	FSOD_controller.getView().byId("mcb_dealer_FSOD").setVisible(true);
			// 	var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
			// 	var data = oTbl.getModel().getData().ProductCollection;
			// 	var len = data.length;
			// 	for (var i = 1; i <= len; i++) {
			// 		var Id = "tbl_val_dealer_FSOD-__clone" + (i + 11 * (i - 1));
			// 		FSOD_controller.getView().byId(Id).setVisible(true);
			// 	}
			// 	FSOD_controller.getView().byId(Id).setVisible(true);
			// }
		},
		/*	_sipUserToTrue: function () {
			FSOD_controller.requestStatus = "Pending Fulfilment";
			FSOD_controller.flagSipUser = true;
			FSOD_controller.getView().byId("btn_linkVeh_FSOD").setVisible(true);

		},*/
		/*	onLinkVehicle: function (evt) {
				var dialog = FSOD_controller.getView().byId("VTNDialog_FSOD");
				dialog.open();

			},
			closeDialog: function () {
				var dialog = FSOD_controller.getView().byId("VTNDialog_FSOD");
				dialog.close();
			},*/
		_navToRSO: function (evt) {
			FSOD_controller.getOwnerComponent().getRouter().navTo("RSOView_ManageSoldOrder", {
				Soreq: evt.getSource().getText()
			}, true);
		},
		_refresh: function (oEvent) {
				var host = FSOD_controller.host();
				
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
			if(i==((this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
					}
					else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
			   			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					var BtnNext = FSOD_controller.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			}
			
			else
			{
				if(filter==false)
				{
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (FleetReference eq '')&$orderby=ZzsoReqNo desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
	// for (var i = 0; i < this.getView().byId("cb_dealer_FSOD").getSelectedItems().length; i++) {
			// var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
			// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"'))";
			// // if(i==((this.getView().byId("cb_dealer_FSOD").getSelectedItems().length)-1))
			// // 	{
			// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";
				// }
				// else
				// {
				// 	oUrl= oUrl+" or ";
				// }			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
				}
				else
				{
					
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
	// for (var i = 0; i < this.getView().byId("cb_dealer_FSOD").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
			oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"'))";
			// if(i==((this.getView().byId("cb_dealer_FSOD").getSelectedItems().length)-1))
			// 	{
					oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";
				// }
				// else
				// {
				// 	oUrl= oUrl+" or ";
				// }			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
				
				}
			}
			clicks=0;
			num=0;
			var page=clicks+1;
			FSOD_controller.getView().byId("txtPageNum").setText("Page "+page);
			 var BtnPrev = this.getView().byId("buttonPrev");
			   			 BtnPrev.setEnabled(false);	
			// var allfilter = [];
			// //-----------------Sold Order Status-----------------
			// var afilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
			// 	afilter.push(new Filter("ZzsoStatus", FilterOperator.EQ, this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey()));
			// }
			// 	afilter.push(new Filter("ZzsoStatus", FilterOperator.EQ, ""));

			// if (afilter.length > 0) {
			// 	var filter_sstatus = new Filter(afilter, false);
			// 	allfilter.push(filter_sstatus);
			// }
			// //---------------------------------------------------------------
			// //-----------------Audit-----------------
			// var Sfilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			// 	Sfilter.push(new Filter("ZzAuditStatus", FilterOperator.EQ, this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey()));
			// }
			// 	Sfilter.push(new Filter("ZzAuditStatus", FilterOperator.EQ, ""));

			// if (Sfilter.length > 0) {
			// 	var filter_audit = new Filter(Sfilter, false);
			// 	allfilter.push(filter_audit);
			// }
			// 	//-----------------Order Type-----------------
			// // var Ofilter = [];
			// // for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// // 	Ofilter.push(new Filter("Zadd1", FilterOperator.EQ, this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey()));
			// // }
			// // if (Ofilter.length > 0) {
			// // 	var filter_ordertype = new Filter(Ofilter, false);
			// // 	allfilter.push(filter_ordertype);
			// // }
			// //---------------------------------------------------------------
			// //-----------------Dealers-----------------
			// var dfilter = [];
			// for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
			// 	dfilter.push(new Filter("ZzdealerCode", FilterOperator.EQ, this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey()));
			// }
			// if (dfilter.length > 0) {
			// 	var filter_dealers = new Filter(dfilter, false);
			// 	allfilter.push(filter_dealers);
			// }
			// //---------------------------------------------------------------
			// var oSorter = new sap.ui.model.Sorter({path:"ZzsoReqNo", descending:true});

			// var filter_all = new Filter([filter_sstatus, filter_audit, filter_dealers, new Filter("FleetReference", FilterOperator.EQ, 'X')],
			// 	true);
			// var items = this.getView().byId("tbl_FSOD").getBinding('rows');
			// items.filter(filter_all);
			// items.sort(oSorter);
		},
		_refreshCombo: function (evt) {
			var host = FSOD_controller.host();
					filter =true;
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
	// for (var i = 0; i < this.getView().byId("cb_dealer_FSOD").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
			oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"'))";
			// if(i==((this.getView().byId("cb_dealer_FSOD").getSelectedItems().length)-1))
			// 	{
					oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";
				// }
				// else
				// {
				// 	oUrl= oUrl+" or ";
				// }			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
				
				
			
			
		},
		onLinkVehicle: function (evt) {
			zrequest = evt.getSource().getBindingContext('mainservices').getProperty('ZzsoReqNo');
			var d = new sap.ui.jsfragment(FSOD_controller.createId("idFrag_FSOD"), "toyota.ca.SoldOrder.view.fragments.VtinDialog",
				FSOD_controller);

			FSOD_controller.getView().addDependent(d);
			// console.log(d);
			d.open();
		},
		_searchNLink: function (evt) {
				var vinVal = FSOD_controller.byId("idFrag_FSOD--VinIdFrag").getValue();
				var vtinVal = FSOD_controller.byId("idFrag_FSOD--VtinIdFrag").getValue();
				var V_No;
				if (vinVal == "" && vtinVal == "") {
					var errForm = formatter.formatErrorType("SO000010");
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					if (vinVal !== "") {
						V_No = vinVal;
					} else {
						V_No = vtinVal;
					}
					FSOD_controller.getView().getModel('mainservices').callFunction("/RSO_VTN_ASSIGN", {
						method: "POST",
						urlParameters: {
							Zzvtn: V_No,
							ZzsoReqNo: zrequest
								//	Endcustomer:
						}, // function import parameters
						success: function (oData, response) {
							if (oData.Type == 'E') {
								var oBundle = FSOD_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000013", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
									.m.MessageBox.Action.OK, null, null);
							} else {
								var oBundle = FSOD_controller.getView().getModel("i18n").getResourceBundle();
								var sMsg = oBundle.getText("SO000014", [zrequest]);
								sap.m.MessageBox.show(sMsg, sap.m.MessageBox.Icon.SUCCESS, "Success", sap
									.m.MessageBox.Action.OK, null, null);
								var oTbl = FSOD_controller.getView().byId("tbl_FSOD");
								var items = oTbl.getBinding('rows');
								items.refresh();
							}

						},
						error: function (oError) {

						}
					});

				}
			},	
			onActionNext: function (oEvent) {
			//This code was generated by the layout editor.
			if(clicks < 0)
			{
			 clicks = 0;
			 clicks += 1;	     
			}
			else{		   
		     clicks += 1;
			}		 
			num = clicks * 10;
			
				// if(num === count1)
				// {
				//  var BtnNext = this.getView().byId("buttonNext");
				//  BtnNext.setEnabled(false);
				// }				
				if(num >= 10)
				{	
			   		    var BtnPrev = this.getView().byId("buttonPrev");
			   			 BtnPrev.setEnabled(true);			   			
				}	
				FSOD_controller.data();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionPrevious: function (oEvent) {
			//This code was generated by the layout editor.
			clicks -= 1;
			if(clicks <= 0)
			{		
			  num = 0;
			}
			else{	       		
			 num = clicks * 10;   
			}   
   //			if(num < count1)
			// {		  
			//  var BtnNext = this.getView().byId("buttonNext");
			//  BtnNext.setEnabled(true);
			// }
   			if(num === 0)
   			{
   		     var Btn = this.getView().byId("buttonPrev");
   			 Btn.setEnabled(false);
   			}   
   			FSOD_controller.data();
		},
			data:function(oEvent)
			{
				var host = FSOD_controller.host();
			var x = this.getView().getModel("LoginUserModel").getProperty("/UserType");
			if (x != "TCI_User") {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip="+num+"&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
				for (var i = 0; i < this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("mcb_dealer_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
			if(i==((this.getView().byId("mcb_dealer_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
					}
					else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(false);
			   			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					var BtnNext = FSOD_controller.getView().byId("buttonNext");
			   			 BtnNext.setEnabled(true);
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			}
			
			else
			{
					if(filter==false)
					{
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip="+num+"&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			// 	for (var i = 0; i < this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length; i++) {
			// var dealer = this.getView().byId("mcb_dealer_RSOS").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"')";
			// if(i==((this.getView().byId("mcb_dealer_RSOS").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc) ";
			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
					}
					else
					{
				
					var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/Retail_Sold_OrderSet?$top=10&$skip=0&$filter=(";
				for (var i = 0; i < this.getView().byId("mcb_status_FSOD").getSelectedItems().length; i++) {
					var status = this.getView().byId("mcb_status_FSOD").getSelectedItems()[i].getKey();
				oUrl=oUrl+"(ZzsoStatus eq '"+status+"')";
				if(i==((this.getView().byId("mcb_status_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
				
			}
					for (var i = 0; i < this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length; i++) {
			var audit = this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems()[i].getKey();
			oUrl=oUrl+"(ZzAuditStatus eq '" +audit+"')";
			if(i==((this.getView().byId("mcb_auditStatus_FSOD").getSelectedItems().length)-1))
				{
					oUrl= oUrl+") and (";
				}
				else
				{
					oUrl= oUrl+" or ";
				}
			}
			// 	for (var i = 0; i < this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length; i++) {
			// var series = this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems()[i].getKey();
			// oUrl=oUrl+"(Zadd1 eq '" +series+"')";
			// if(i==((this.getView().byId("mcb_ordTyp_FSOD").getSelectedItems().length)-1))
			// 	{
			// 		oUrl= oUrl+") and (FleetReference eq 'X')&$orderby=ZzsoReqNo desc";
	// for (var i = 0; i < this.getView().byId("cb_dealer_FSOD").getSelectedItems().length; i++) {
			var dealer = this.getView().byId("cb_dealer_FSOD").getSelectedKey();
			oUrl=oUrl+"(ZzdealerCode eq'" +dealer+"'))";
			// if(i==((this.getView().byId("cb_dealer_FSOD").getSelectedItems().length)-1))
			// 	{
					oUrl= oUrl+"and (FleetReference eq '')&$orderby=ZzsoReqNo desc ";
				// }
				// else
				// {
				// 	oUrl= oUrl+" or ";
				// }			// 	}
			// 	else
			// 	{
			// 		oUrl= oUrl+" or ";
			// 	}
			// }
			
			// }
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();
			
					oModel.setData(data.d.results);
						if(data.d.results.length==undefined ||data.d.results.length==0)
					{
						
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
					}else if(data.d.results.length<10)
					{
					 var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(false);
			  			 FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}else{
						var BtnNext = FSOD_controller.getView().byId("buttonNext");
			  			 BtnNext.setEnabled(true);
					// if (oModel.length > 0) {
					//oModel.getData().ZC_SERIES.unshift({
					//  "{seriesModel>ModelSeriesNo}": "All",
					//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
					//})
					// }
					FSOD_controller.getView().setModel(oModel, "fleetdetailsModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					
					
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			
				}
			});
			
						
					}
				}
					var page=0;
			page=clicks+1;
			FSOD_controller.getView().byId("txtPageNum").setText("Page"+page);
			}
			/*_searchNLink: function () {
					var vinVal = FSOD_controller.getView().byId("vin_FSOD").getValue();
					var vtinVal = FSOD_controller.getView().byId("vtin_FSOD").getValue();

					var errForm = formatter.formatErrorType("SO000010");
					var errMsg = FSOD_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}*/

	});

});