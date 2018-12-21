var AppController;
sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController"
], function (BaseController) {
	"use strict";


	return BaseController.extend("toyota.ca.SoldOrder.controller.App", {
		onInit: function () {
			AppController = this;
			AppController.ResetFlag();
			AppController.getView().addEventDelegate({
				onAfterRendering: function () {
					var m = AppController.getOwnerComponent().getModel();
					m.attachRequestCompleted(function () {
						var data = m.getProperty("/Users");
						AppController.listOfUsers = data;
						AppController._user();
					});

				}
			});
		},
		
		
		_user: function () {
			var user = AppController.listOfUsers;
			var selUser = AppController.getView().byId("AppInputId").getValue();
		
			if (selUser === user[0].key) {
				AppController.flagPPDUser = true;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[1].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = true;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[2].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = true;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[3].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = true;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[4].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = true;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[5].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = true;
				AppController.flagSIPUser = false;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[6].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = true ;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[7].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false ;
				AppController.flagNationalUser = true;
				AppController.flagOrderingDealer = false;
			}
			if (selUser === user[8].key) {
				AppController.flagPPDUser = false;
				AppController.flagNationalSIPUser = false;
				AppController.flagNationalPPDUser = false;
				AppController.flagDealerUser = false;
				AppController.flagZoneUser = false;
				AppController.flagTCINationalUser = false;
				AppController.flagSIPUser = false ;
				AppController.flagNationalUser = false;
				AppController.flagOrderingDealer = true;
			}
		},

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
		}

	});

});
//console.log(data);
//console.log(data[0]);
//console.log(data[0].LoggedUserName);