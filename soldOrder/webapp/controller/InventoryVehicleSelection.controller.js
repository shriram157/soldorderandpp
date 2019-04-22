sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	var InvVehSel_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.InventoryVehicleSelection", {
		formatter: formatter,

		onInit: function () {
			InvVehSel_controller = this;
			InvVehSel_controller.getBrowserLanguage();

			this.getOwnerComponent().getRouter().getRoute("InventoryVehicleSelection").attachPatternMatched(this._getattachRouteMatched,
				this);

		},
		_getattachRouteMatched: function (parameters) {
			var vechile_items = InvVehSel_controller.getView().byId("idFSO_IVS_Table").getBinding('rows');
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			vechile_items.filter([new Filter([
				new Filter("MATRIX", FilterOperator.EQ, "A205"),
				new Filter("Dealer", FilterOperator.EQ, dealer_no)
			], true)]);
		},
		onAfterRendering: function () {
			var vechile_items = InvVehSel_controller.getView().byId("idFSO_IVS_Table").getBinding('rows');
			var dealer_no = "0";
			//Dealer Inventory
			vechile_items.filter([new Filter([
				new Filter("MATRIX", FilterOperator.EQ, "A205"),
				new Filter("Dealer", FilterOperator.EQ, dealer_no)
			], true)]);
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
				var data = oTable.getModel('mainservices').getProperty(binded.sPath);

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
			var vechile_items = InvVehSel_controller.getView().byId("idFSO_IVS_Table").getBinding('rows');
			var dealer_no = this.getView().getModel("LoginUserModel").getProperty("/BPDealerDetails").BusinessPartnerKey;
			//Dealer Inventory
			if (Oevent.getSource().getSelectedKey() == '1') {

				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, dealer_no)
					// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
					// new Filter("Modelyear", FilterOperator.EQ, "2018"),
					// new Filter("Suffix", FilterOperator.EQ, "AL"),
					// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					// new Filter("TCISeries", FilterOperator.EQ, ""),
					// new Filter("ETA", FilterOperator.EQ, ""),
					// new Filter("APX", FilterOperator.EQ, ""),
				], true)]);
			} else if (Oevent.getSource().getSelectedKey() == '2') //National Stock
			{
				vechile_items.filter([new Filter([
					new Filter("MATRIX", FilterOperator.EQ, "A205"),
					new Filter("Dealer", FilterOperator.EQ, "2400500000")
					// new Filter("Model", FilterOperator.EQ, "YZ3DCT"),
					// new Filter("Modelyear", FilterOperator.EQ, "2018"),
					// new Filter("Suffix", FilterOperator.EQ, "AL"),
					// new Filter("ExteriorColorCode", FilterOperator.EQ, "01D6"),
					// new Filter("INTCOL", FilterOperator.EQ, "42")
					// new Filter("TCISeries", FilterOperator.EQ, ""),
					// new Filter("ETA", FilterOperator.EQ, ""),
					// new Filter("APX", FilterOperator.EQ, ""),
				], true)]);
			}
		}

	});

});