var AppController;
sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"toyota/ca/SoldOrder/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.App", {
		formatter: formatter,
		onInit: function () {
			AppController = this;
			AppController.ResetFlag();
			AppController.getBrowserLanguage();
			var that = this;
		
			AppController.getView().addEventDelegate({
				onAfterRendering: function () {
					var m = AppController.getOwnerComponent().getModel();
					m.attachRequestCompleted(function () {
						var data = m.getProperty("/Users");
						AppController.listOfUsers = data;
						that.getDealer();
						that._setTheLogo();
						AppController._user();

					});

				}
			});
		},

		_user: function () {},

		ResetFlag: function () {
			AppController.flagOrderingDealer = false;
			AppController.flagNationalUser = false;
			AppController.flagNationalPPDUser = false;
			AppController.flagPPDUser = false;
			AppController.flagNationalSIPUser = false;
			AppController.flagTCINationalUser = false;
			AppController.flagSIPUser = false;
			AppController.flagDealerUser = false;
			AppController.flagZoneUser = false;
			AppController.flgSoldOrderReqStatus = "";
			AppController.flgPriceProtectionStatus = "";
			AppController.flgOwnershipUploaded = "false";
			AppController.RSOA=false;
			AppController.RSOB=false;
		},
		_setTheLogo: function (oEvent) {

			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					var currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");

				} else { // set the lexus logo
					var currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/i_lexus_black_full.png");

					// }
				}
			}

		},

	});

});