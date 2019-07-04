sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var InvVehSel_controller, clicks = 0,
		num;
	return BaseController.extend("toyota.ca.SoldOrder.controller.InventoryVehicleSelection", {
		formatter: formatter,

		onInit: function () {
			InvVehSel_controller = this;
			InvVehSel_controller.getBrowserLanguage();

			this.getOwnerComponent().getRouter().getRoute("InventoryVehicleSelection").attachPatternMatched(this._getattachRouteMatched,
				this);
			// InvVehSel_controller.series_selected();
			// InvVehSel_controller.model_selected();
			// InvVehSel_controller.suffix_selected();
		},
		_getattachRouteMatched: function (parameters) {
			this.zrequest = parameters.getParameters().arguments.Soreq;
			// var vechile_items = InvVehSel_controller.getView().byId("idFSO_IVS_Table").getBinding('rows');

			// vechile_items.filter([new Filter([
			// 	new Filter("MATRIX", FilterOperator.EQ, "A205"),
			// 	new Filter("Dealer", FilterOperator.EQ, dealer_no),
			// 	new Filter("source", FilterOperator.EQ, "FLT")
			// ], true)]);
			// vechile_items.refresh();
		},
		onAfterRendering: function () {
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory	var host = RSOS_controller.host();
			var host = InvVehSel_controller.host();

			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/InventoryDetailsSet?$top=10&$skip=0&$filter=(MATRIX eq 'A205') and (Dealer eq '" +
				dealer_no + "') and (source eq 'FLT')";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel();

					oModel.setData(data.d.results);
					if (data.d.results.length == undefined) {

						var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
						BtnNext.setEnabled(false);
					} else if (data.d.results.length < 10) {
						var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
						BtnNext.setEnabled(false);
						InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
					} else {
						// if (oModel.length > 0) {
						//oModel.getData().ZC_SERIES.unshift({
						//  "{seriesModel>ModelSeriesNo}": "All",
						//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
						//})
						// }
						InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {

					var errMsg = InvVehSel_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}
			});
			clicks = 0;
			num = 0;
			var page = clicks + 1;
			InvVehSel_controller.getView().byId("txtPageNum").setText("Page " + page);
			var BtnPrev = this.getView().byId("buttonPrev");
			BtnPrev.setEnabled(false);
			// var vechile_items = InvVehSel_controller.getView().byId("idFSO_IVS_Table").getBinding('rows');
			// var dealer_no = "0";
			// //Dealer Inventory
			// vechile_items.filter([new Filter([
			// 	new Filter("MATRIX", FilterOperator.EQ, "A205"),
			// 	new Filter("Dealer", FilterOperator.EQ, dealer_no)
			// ], true)]);
			// vechile_items.refresh();
		},
		_onSelect: function () {
			var oTable = InvVehSel_controller.getView().byId("idFSO_IVS_Table");
			var indiceArray = oTable.getSelectedIndices();
			var Model = sap.ui.getCore().getModel('FirstTable');
			// Model.setData();
			var zitems = [];
			// if (Model.getData().items) {
			// 	 zitems = Model.getData().items;
			// }
			for (var i = 0; i < indiceArray.length; i++) {
				var binded = InvVehSel_controller.getView().byId("idFSO_IVS_Table").getBinding('rows').getContexts()[indiceArray[i]];
				var data = oTable.getModel('inventoryModel').getProperty(binded.sPath);

				zitems.push({
					APX: data.APX,
					AssignVehicle: data.AssignVehicle,
					Dealer: data.Dealer,
					DropShip: data.DropShip,
					ETA: data.ETA,
					ETAFrom: data.ETAFrom,
					ETATo: data.ETATo,
					EXTCOL_DESC_EN: data.EXTCOL_DESC_EN,
					EXTCOL_DESC_FR: data.EXTCOL_DESC_FR,
					ExteriorColorCode: data.ExteriorColorCode,
					INTCOL: data.INTCOL,
					INTCOL_DESC_EN: data.INTCOL_DESC_EN,
					INTCOL_DESC_FR: data.INTCOL_DESC_FR,
					MATRIX: data.MATRIX,
					MODEL_DESC_EN: data.MODEL_DESC_EN,
					MODEL_DESC_FR: data.MODEL_DESC_FR,
					Model: data.Model,
					Modelyear: data.Modelyear,
					ORDERTYPE_DESC_EN: data.ORDERTYPE_DESC_EN,
					SERIES_DESC_EN: data.SERIES_DESC_EN,
					SERIES_DESC_FR: data.SERIES_DESC_FR,
					SPART: data.SPART,
					SUFFIX_DESC_EN: data.SUFFIX_DESC_EN,
					SUFFIX_DESC_FR: data.SUFFIX_DESC_FR,
					Suffix: data.Suffix,
					TCISeries: data.TCISeries,
					UserType: data.UserType,
					VGUID: data.VGUID,
					VHCLE: data.VHCLE,
					VHVIN: data.VHVIN,
					VKBUR: data.VKBUR,
					VKORG: data.VKORG,
					VTWEG: data.VTWEG,
					ZMMSTA: data.ZMMSTA,
					ZZDLR_REF_NO: data.ZZDLR_REF_NO,
					ZZORDERTYPE: data.ZZORDERTYPE,
					ZZVTN: data.ZZVTN
				});
			}
			Model.setData({
				items: zitems
			});
			Model.refresh();
			InvVehSel_controller.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder", {}, true); //page 11
			/*	if (oTable.setSelectedIndex(-1) == true) {
					var errForm = formatter.formatErrorType("SO00007");
					var errMsg = InvVehSel_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);
				} else {
					var aContexts = oTable.getSelectedIndices();
					for (var i = aContexts.length - 1; i >= 0; i--) {
						var index = aContexts[i];
					}
				}
*/
		},
		filter_change: function (Oevent) {
			var host = InvVehSel_controller.host();

			// var dealer_no = "42120"; //comment before deploying, local testing
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			if (Oevent.getSource().getSelectedKey() == '1') {
				var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/InventoryDetailsSet?$top=10&$skip=0&$filter=(MATRIX eq 'A205') and (Dealer eq '" +
					dealer_no + "') and (source eq 'FLT')";
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();

						oModel.setData(data.d.results);
						if (data.d.results.length == undefined) {

							var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
							BtnNext.setEnabled(false);
						} else if (data.d.results.length < 10) {
							var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
							BtnNext.setEnabled(false);
							InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
						} else {
							// if (oModel.length > 0) {
							//oModel.getData().ZC_SERIES.unshift({
							//  "{seriesModel>ModelSeriesNo}": "All",
							//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
							//})
							// }
							InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {

						var errMsg = InvVehSel_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});

				// vechile_items.filter([new Filter([
				// 	new Filter("MATRIX", FilterOperator.EQ, "A205"),
				// 	new Filter("Dealer", FilterOperator.EQ, dealer_no)
				// 	// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
				// 	// new Filter("Modelyear", FilterOperator.EQ, "2018"),
				// 	// new Filter("Suffix", FilterOperator.EQ, "AL"),
				// 	// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
				// 	// new Filter("INTCOL", FilterOperator.EQ, "42")
				// 	// new Filter("TCISeries", FilterOperator.EQ, ""),
				// 	// new Filter("ETA", FilterOperator.EQ, ""),
				// 	// new Filter("APX", FilterOperator.EQ, ""),
				// ], true)]);
			} else if (Oevent.getSource().getSelectedKey() == '2') //National Stock
			{
				var oUrl = host +
					"/ZVMS_SOLD_ORDER_SRV/InventoryDetailsSet?$top=10&$skip=0&$filter=(MATRIX eq 'A205') and (Dealer eq '2400500000') and (source eq 'FLT')";
				$.ajax({
					url: oUrl,
					method: "GET",
					async: false,
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();

						oModel.setData(data.d.results);
						if (data.d.results.length == undefined) {

							var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
							BtnNext.setEnabled(false);
						} else if (data.d.results.length < 10) {
							var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
							BtnNext.setEnabled(false);
							InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
						} else {
							// if (oModel.length > 0) {
							//oModel.getData().ZC_SERIES.unshift({
							//  "{seriesModel>ModelSeriesNo}": "All",
							//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
							//})
							// }
							InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {

						var errMsg = InvVehSel_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

					}
				});

				// vechile_items.filter([new Filter([
				// 	new Filter("MATRIX", FilterOperator.EQ, "A205"),
				// 	new Filter("Dealer", FilterOperator.EQ, "2400500000")
				// 	// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
				// 	// new Filter("Modelyear", FilterOperator.EQ, "2018"),
				// 	// new Filter("Suffix", FilterOperator.EQ, "AL"),
				// 	// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
				// 	// new Filter("INTCOL", FilterOperator.EQ, "42")
				// 	// new Filter("TCISeries", FilterOperator.EQ, ""),
				// 	// new Filter("ETA", FilterOperator.EQ, ""),
				// 	// new Filter("APX", FilterOperator.EQ, ""),
				// ], true)]);
			}
		},
		onNavBack: function (oEvent) {
			InvVehSel_controller.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder", {}, true); //page 3		
		},
		series_selected: function (oEvent) {

			// var year = this.getView().byId('modelYr_RSOA').getValue();
			// items="{ path: 'oModel3>/'}"

			if (this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries') && this.getView().getElementBinding(
					'mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var series = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzseries');
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('model_CSOR').bindItems("oModel3>/", new sap.ui.core.ListItem({
				// 	key: "{oModel3>Model}",
				// 	text: "{parts: [{path:'oModel3>Model'},{path:'oModel3>ModelDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatModel'}"
				// }));
				var dealer = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartner;
				var language = InvVehSel_controller.returnBrowserLanguage();
				var model;
				if (language === "FR") {
					model = "{mainservices>model}-{mainservices>model_desc_fr}";
				} else {
					model = "{mainservices>model}-{mainservices>model_desc_en}";
				}
				this.getView().byId('model_CSOR').bindItems({
					path: "mainservices>/ZVMS_Model_EXCLSet",
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("tci_series", sap.ui.model.FilterOperator.EQ, series),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear),
						new sap.ui.model.Filter("dlr", sap.ui.model.FilterOperator.EQ, dealer),
						new sap.ui.model.Filter("source", sap.ui.model.FilterOperator.EQ, 'RSO')
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>model}",
						text: model
					})
				});
				// var items_binding = this.getView().byId('model_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter("TCIModelSeriesNo", sap.ui.model.FilterOperator.EQ, series));
			}
		},
		model_selected: function (oEvent) {
			// zc_configuration(Model='ZZZZZZ',ModelYear='2030',Suffix='AM')
			var model = this.getView().byId('model_CSOR').getSelectedKey();
			var language = InvVehSel_controller.returnBrowserLanguage();
			var suf;
			if (language === "FR") {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_fr'},{path:'mainservices>int_trim_desc_fr'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			} else {
				suf =
					"{parts: [{path:'mainservices>suffix'},{path:'mainservices>suffix_desc_en'},{path:'mainservices>int_trim_desc_en'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix1'}";

			}
			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr')) {
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('suffix_CSOR').bindItems('oModel1>/', new sap.ui.core.ListItem({
				// 	key: "{oModel1>Suffix}",
				// 	text: "{parts: [{path:'oModel1>Suffix'},{path:'oModel2>SuffixDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatSuffix'}"
				// }));
				this.getView().byId('suffix_CSOR').bindItems({
					path: 'mainservices>/ZVMS_CDS_SUFFIX',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>suffix}",
						text: suf
					})
				});
				// var items_binding = this.getView().byId('suffix_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
			}
		},
		suffix_selected: function (oEvent) {
			//-----------------
			//----APX---------
			//----------------
			//items="{ path: 'mode_Model>/', sorter: { path: 'key' } }"
			var suffix = this.getView().byId('suffix_CSOR').getSelectedKey();

			var model = this.getView().byId('model_CSOR').getSelectedKey();
			if (model && this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr') && suffix) {
				var modelyear = this.getView().getElementBinding('mainservices').getBoundContext().getProperty('Zzmoyr');
				// this.getView().byId('apx_CSOR').bindItems('mode_Model>/', new sap.ui.core.ListItem({
				// 	key: "{mode_Model>zzapx}",
				// 	text: "{mode_Model>zzapx}"
				// }));
				this.getView().byId('apx_CSOR').bindItems({
					path: 'mainservices>/ZVMS_CDS_APX',
					filters: new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>zzapx}",
						text: "{mainservices>zzapx}"
					})
				});
				// var items_binding = this.getView().byId('apx_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("zzmodel", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));
				//-----------------
				//----Color---------
				//----------------
				// this.getView().byId('colour_CSOR').bindItems('oModel2>/', new sap.ui.core.ListItem({
				// 	key: "{oModel2>ExteriorColorCode}",
				// 	text: "{parts: [{path:'oModel2>ExteriorColorCode'},{path:'oModel2>ExteriorDescriptionEN'}] , formatter: 'toyota.ca.SoldOrder.util.formatter.formatColour'}"
				// }));
				var color;
				var language = InvVehSel_controller.returnBrowserLanguage();
				if (language === "FR") {
					color = "{mainservices>ext}/{mainservices>mktg_desc_fr}";
				} else {
					color = "{mainservices>ext}/{mainservices>mktg_desc_en}";
				}
				this.getView().byId('colour_CSOR').bindItems({
					path: 'mainservices>/ZVMS_CDS_Colour',
					filters: new sap.ui.model.Filter([new sap.ui.Smodel.Filter("model", sap.ui.model.FilterOperator.EQ, model),
						new sap.ui.model.Filter("suffix", sap.ui.model.FilterOperator.EQ, suffix),
						new sap.ui.model.Filter("model_year", sap.ui.model.FilterOperator.EQ, modelyear)
					], true),
					template: new sap.ui.core.ListItem({
						key: "{mainservices>ext}",
						text: color
					})
				});
				// var items_binding = this.getView().byId('colour_CSOR').getBinding('items');
				// items_binding.filter(new sap.ui.model.Filter([new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model),
				// 	new sap.ui.model.Filter("Suffix", sap.ui.model.FilterOperator.EQ, suffix),
				// 	new sap.ui.model.Filter("ModelYear", sap.ui.model.FilterOperator.EQ, modelyear)
				// ], true));

			}
		},
		onActionNext: function (oEvent) {
			//This code was generated by the layout editor.
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 10;

			// if(num === count1)
			// {
			//  var BtnNext = this.getView().byId("buttonNext");
			//  BtnNext.setEnabled(false);
			// }				
			if (num >= 10) {
				var BtnPrev = this.getView().byId("buttonPrev");
				BtnPrev.setEnabled(true);
			}
			InvVehSel_controller.data();
		},
		/**
		 *@memberOf toyota.ca.SoldOrder.controller.RetailSoldOrderSummary
		 */
		onActionPrevious: function (oEvent) {
			//This code was generated by the layout editor.
			clicks -= 1;
			if (clicks <= 0) {
				num = 0;
			} else {
				num = clicks * 10;
			}
			//			if(num < count1)
			// {		  
			//  var BtnNext = this.getView().byId("buttonNext");
			//  BtnNext.setEnabled(true);
			// }
			if (num === 0) {
				var Btn = this.getView().byId("buttonPrev");
				Btn.setEnabled(false);
			}
			InvVehSel_controller.data();
		},
		data: function () {
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory	var host = RSOS_controller.host();
			var host = InvVehSel_controller.host();

			var oUrl = host + "/ZVMS_SOLD_ORDER_SRV/InventoryDetailsSet?$top=10&$skip=" + num + "&$filter=(MATRIX eq 'A205') and (Dealer eq '" +
				dealer_no + "') and (source eq 'FLT')";
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var page = clicks + 1;
					InvVehSel_controller.getView().byId("txtPageNum").setText("Page " + page);
					var oModel = new sap.ui.model.json.JSONModel();

					oModel.setData(data.d.results);
					if (data.d.results.length == undefined) {

						var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
						BtnNext.setEnabled(false);
					} else if (data.d.results.length < 10) {
						var BtnNext = InvVehSel_controller.getView().byId("buttonNext");
						BtnNext.setEnabled(false);
						InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
					} else {
						// if (oModel.length > 0) {
						//oModel.getData().ZC_SERIES.unshift({
						//  "{seriesModel>ModelSeriesNo}": "All",
						//  "{seriesModel>TCISeriesDescriptionEN}": "Select All",
						//})
						// }
						InvVehSel_controller.getView().setModel(oModel, "inventoryModel");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var page = clicks + 1;
					InvVehSel_controller.getView().byId("txtPageNum").setText("Page " + page);

					var errMsg = InvVehSel_controller.getView().getModel("i18n").getResourceBundle().getText("errorServer");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action.OK, null, null);

				}
			});
		}
	});
});