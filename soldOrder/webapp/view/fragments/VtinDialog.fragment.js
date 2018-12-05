sap.ui.jsfragment("toyota.ca.SoldOrder.view.fragments.VtinDialog", {
	createContent: function (oController) {
		var d = new sap.m.Dialog({
			title: 'Search Vehicle By VTN/VIN',
			type: 'Message',
			content: [
				new sap.m.VBox({
					items: [
						new sap.m.HBox({
							items: [new sap.m.Label({
								text: "{i18n>vtn}"
							}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginEnd"), new sap.m.Input(this.createId("VtinIdFrag"), {
								
							})]
						}).addStyleClass("justifyContentCenter"),
							new sap.m.HBox({
							items: [new sap.m.Label({
								text: "{i18n>or}"
							}).addStyleClass("")]
						}).addStyleClass("justifyContentCenter"),
						new sap.m.HBox({
							items: [new sap.m.Label({
								text: "{i18n>vin}"
							}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginEnd"), new sap.m.Input(this.createId("VinIdFrag"), {
							
							})]
						}).addStyleClass("justifyContentCenter"),
						new sap.m.HBox({
							items: [new sap.m.Button({
								text: "{i18n>searchLink}",
								press: oController._searchNLink
							})]
						}).addStyleClass("justifyContentCenter")
					]
				})
			],
			endButton: new sap.m.Button({
				text: 'Cancel',
				press: function () {
					d.close();
				}
			}),
			afterClose: function () {
				d.destroy();
			}
		});
		return d;
	}
});