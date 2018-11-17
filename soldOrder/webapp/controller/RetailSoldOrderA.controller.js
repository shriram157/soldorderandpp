sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ResourceModel, formatter, JSONModel) {
	"use strict";
	var validateFlag = false;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RetailSoldOrderA", {
		formatter: formatter,
		onInit: function () {
			this.getBrowserLanguage();

			var today = new Date();
			var day1 = new Date();
			day1.setDate(today.getDate() + 1);
			this.getView().byId("etaFrom_RSOA").setMinDate(day1);
			
			
			
			// =============================================Begin of changes service call from price protection details dealer.controller.sj================================
			
						    		     var sLocation = window.location.host;
									      var sLocation_conf = sLocation.search("webide");
									    
									      if (sLocation_conf == 0) { 
									        this.sPrefix = "/soldorder_node";
									      } else { 
									        this.sPrefix = ""; 
									     }
									      
									      this.nodeJsUrl = this.sPrefix + "/node";
			
			//ZPRICE_PROTECTION_SRV
			          var url = this.nodeJsUrl + "/ZPRICE_PROTECTION_SRV/zc_campaign_pricing";

			
						// this.nodeJsUrl = "/node";
				//		var url ="http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv/zc_campaign_pricing";
						//"https://fioridev1.dev.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_MASTER_SRV/zc_vehicle_items";
						//"http://tcid1gwapp1.tci.internal.toyota.ca:8000/sap/opu/odata/sap/zprice_protection_srv/zc_campaign_pricing";
						jQuery.ajax({
							url: url,
							method: 'GET',
							async: false,
							dataType: 'json',
							success: function(data, textStatus, jqXHR) {
								console.log("table_PPD_Dealer service getting called");
								console.log(data);
								console.log(data.results);
								
								var oTable = sap.ui.getCore().byId("table_PPD_Dealer");
								var oModel = new sap.ui.model.json.JSONModel(data);
								oTable.setModel(oModel);
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(jqXHR );
								console.log(textStatus );
								console.log(errorThrown);
									console.log("table_PPD_Dealer ERROR in service");
								sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
									.m.MessageBox.Action.OK, null, null);
							}
						});	
			
			
			
			
			
			
			
			
			
			
			
			// =========================================== End of changes service call from Price protectin details dealer.controller.js=======================================

			/*	var oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				this.getView().setModel(oI18nModel, "i18n");
				var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
				if (isLocaleSent) {
					var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
				} else {
					var sSelectedLocale = "EN"; // default is english 
				}
				if (sSelectedLocale == "fr") {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("fr")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'FR';
				} else {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';
				}*/

			/*	var sLocation = window.location.host;
				console.log(sLocation);
				var sLocation_conf = sLocation.search("webide");
				console.log(sLocation_conf);
				if (sLocation_conf == 0) {
					this.sPrefix = "/soldOrder_node";
				} else {
					this.sPrefix = "";
				}
				this.nodeJsUrl = this.sPrefix + "/node";
				console.log(this.nodeJsUrl);
				$.ajax({
					url: this.sPrefix + "/userDetails/attributes",
					//url: getUrlTable_Driver,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
					//	console.log("safety manager service getting called");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						//console.log("safety manager ERROR service getting called");
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});*/
		},
		_handleChange: function () {
			var etaFrom = this.getView().byId("etaFrom_RSOA").getValue();
			if (etaFrom !== "") {
				var CDate = new Date(etaFrom);
				var day5 = CDate;
				day5.setDate(CDate.getDate() + 5);
				this.getView().byId("etaTo_RSOA").setMinDate(day5);
			} else {
				var errForm = formatter.formatErrorType("SO00002");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
			}
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
			validateFlag = true;
		},
		listOfModelYear: function () {
			//	var omodelYearModel;
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var previousModelYear = currentModelYear - 1;
			var nextModelYear = currentModelYear + 1;

			var data = {
				"modelYear": [{
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
			var modelYearModel = new JSONModel(); 
			modelYearModel.setData(data);
			this.getView().byId("modelYr_RSOA").setModel(modelYearModel);
		},
		_onSubmit: function () {

			var valModelYr = this.getView().byId("modelYr_RSOA").getValue();
			var valSuffix = this.getView().byId("Suffix_RSOA").getValue();
			var valSeries = this.getView().byId("series_RSOA").getValue();
			//	var valModelCode = this.getView().byId("modelCode_RSOA").getValue();
			var valCustName = this.getView().byId("CustName_RSOA").getValue();
			var valETATo = this.getView().byId("etaTo_RSOA").getValue();
			var valETAFrom = this.getView().byId("etaFrom_RSOA").getValue();
			var valColour = this.getView().byId("Colour_RSOA").getValue();
			var valModel = this.getView().byId("model_RSOA").getValue();
			var valApx = this.getView().byId("Apx_RSOA").getValue();
			var valSalesType = this.getView().byId("SalesType_RSOA").getValue();
			var valContractDate = this.getView().byId("ContractDate_RSOA").getValue();
			var valAddress = this.getView().byId("Address_RSOA").getValue();
			var valCity = this.getView().byId("City_RSOA").getValue();
			var valProvince = this.getView().byId("Province_RSOA").getValue();
			var valPostalCode = this.getView().byId("PostalCode_RSOA").getValue();
			var valLicense = this.getView().byId("License_RSOA").getValue();

			if (valModelYr == "" || valSuffix == "" || valSeries == "" || valCustName == "" || valETATo == "" || valETAFrom == "" || valColour ==
				"" || valModel == "" || valApx == "" || valSalesType == "" || valContractDate == "" || valAddress == "" || valCity == "" ||
				valProvince == "" || valPostalCode == "" || valLicense == "") {
				var errForm = formatter.formatErrorType("SO00003");
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} 
			if (validateFlag == false) {
				var errForm2 = formatter.formatErrorType("SO00004");
				var errMsg2 = this.getView().getModel("i18n").getResourceBundle().getText(errForm2);
				sap.m.MessageBox.show(errMsg2, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			}
		},
		//	onBeforeRendering: function() {
		//
		//	},

		onAfterRendering: function () {
			this.listOfModelYear();
		}

		//	onExit: function() {
		//
		//	}

	});

});