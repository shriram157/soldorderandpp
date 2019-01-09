sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"toyota/ca/SoldOrder/util/formatter"
], function (BaseController, ResourceModel, formatter) {
	"use strict";
	var RSO_MSO_controller;
	return BaseController.extend("toyota.ca.SoldOrder.controller.RSOView_ManageSoldOrder", {
		formatter: formatter,

		onInit: function () {
			RSO_MSO_controller = this;
			RSO_MSO_controller.getBrowserLanguage();
			RSO_MSO_controller._oBusyDialog = new sap.m.BusyDialog();
			RSO_MSO_controller.getSO();
		},
		getSO: function () {
			var host = RSO_MSO_controller.host();
			//	var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?sap-client=200&$format=json";
			var oURL = host + "/ZVMS_SOLD_ORDER_SRV/ZVMS_SOLD_ORDERSet?$filter=ZzsoReqNo eq 'SO0000000009'&$format=json";
			$.ajax({
				type: 'GET',
				url: oURL,
				cache: false,
				success: function (data) {
					console.log(data.d.results[0]);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data.d.results[0]);
					RSO_MSO_controller.getView().setModel(oModel, "RSO_MSO_Model");
					
					var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
					var sRecipient = data.d.results[0].ZzsoReqNo;
					var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
					RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg);
				},
				error: function (data) {
					sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}

			});
		},
		onAfterRendering: function () {
			/*	var oBundle = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle();
				//var sRecipient = "S09732984"; // RSO_MSO_controller.getView().getModel().getProperty("/recipient/name");
					var sRecipient =RSO_MSO_controller.getView().getModel("RSO_MSO_Model").getData()[0].ZzsoReqNo;
					console.log(sRecipient);
				var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
				RSO_MSO_controller.getView().byId("label_MangSoldOrderid").setText(sMsg);*/

			if (AppController.flagOrderingDealer == true) {
				RSO_MSO_controller.getView().byId("RSOV_MSO_comment1").setEnabled(true);
				//RSO_MSO_controller.getView().byId("idRSOV_MSO_delButton").setEnabled(true);
				RSO_MSO_controller.getView().byId("idRSOV_MSO_fileUpl").setEnabled(true);
				RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").setEnabled(true);
				RSO_MSO_controller.getView().byId("btn_addAttach_RSO_MSO").setEnabled(true);
				RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setEnabled(true);
				RSO_MSO_controller.getView().byId("btn_orderChange_RSO_MSO").setEnabled(true);
				RSO_MSO_controller.getView().byId("btn_cancelOrder_RSO_MSO").setEnabled(true);
				var oTbl = RSO_MSO_controller.getView().byId("table_RSOViewManageSO");
				var data = oTbl.getModel().getData().ProductCollection;
				var len = data.length;
				for (var i = 0; i < len; i++) {
					var Id = "idRSOV_MSO_delButton-__clone" + (i * 3);

					RSO_MSO_controller.getView().byId(Id).setEnabled(true);
				}
			}
			if (AppController.flagNationalUser == true) {
				RSO_MSO_controller.getView().byId("RSOV_MSO_comment2").setEnabled(true);
			}
			if (AppController.flagPPDUser == true) {
				RSO_MSO_controller.getView().byId("RSOV_MSO_comment3").setEnabled(true);
			}
			if (AppController.flagNationalPPDUser == true) {
				RSO_MSO_controller.getView().byId("btn_ApprPriceProt_RSO_MSO").setEnabled(true);
				RSO_MSO_controller.getView().byId("btn_ApprPriceProt_RSO_MSO").setVisible(true);
				RSO_MSO_controller.getView().byId("btn_RejPriceProt_RSO_MSO").setEnabled(true);
				RSO_MSO_controller.getView().byId("btn_RejPriceProt_RSO_MSO").setVisible(true);
			}
			if (AppController.flagSIPUser == true) {
				RSO_MSO_controller.getView().byId("btn_AuditComp_RSO_MSO").setVisible(true);
			}
			if (AppController.flgSoldOrderReqStatus = "In Progress") {
				RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setVisible(true);
			}
			if (AppController.flgSoldOrderReqStatus = "Audit - In Progress") {
				RSO_MSO_controller.getView().byId("btn_AuditComp_RSO_MSO").setEnabled(true);
			}
			if (AppController.flgPriceProtectionStatus = "In Progress") {
				RSO_MSO_controller.getView().byId("btn_selectVehicle_RSO_MSO").setVisible(true);
			}
		},

		_updateSoldOrderRequest: function () {

		},

		_updateAuditSoldOrderRequest: function () {
			AppController.flgSoldOrderReqStatus = "Audit - Complete";
		},

		_approvePriceProtectionDetails: function () {

		},

		_rejectPriceProtectionDetails: function () {
			AppController.flgPriceProtectionStatus = "Rejected";
		},

		_getVehiclesToFillSoldOrderRequest: function () {
			if (RSO_MSO_controller.flagOrderingDealer === true) {

				RSO_MSO_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_DealerInventory", {}, true); //page5 
			}
			if (RSO_MSO_controller.flagNationalSIPUser === true) {
				RSO_MSO_controller.getOwnerComponent().getRouter().navTo("vehicleSelection_NationalStock", {}, true); //page6  
			}
			var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorVeh");
			var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title2");
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
				title: title,
				actions: sap.m.MessageBox.Action.OK,
				onClose: null,
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
		},

		_navCancleOrder: function () {
			var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorCancel");
			var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title4");
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
				title: title,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (sAction) {
					if (sAction == "YES") {

						RSO_MSO_controller.getOwnerComponent().getRouter().navTo("RetailSoldOrderCancelRequest", {}, true); //page6
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

		_onDeleteAttachment: function (evt) {
			var evtContext = evt.getSource().getBindingContext(); // "/ProductCollection/0"
			var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title1");
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
						RSO_MSO_controller.deleteAtt(evtContext);
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
			var oTable = RSO_MSO_controller.getView().byId("table_RSOViewManageSO");
			var sPath = evtContext.sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			var model = oTable.getModel();
			var data = model.getProperty("/ProductCollection");
			data.splice(oIndex, 1);
			model.setProperty("/ProductCollection", data);
			oTable.getModel().refresh();
			RSO_MSO_controller.getView().getModel().refresh(true);
		},

		_openFile: function () {
			var fileUrl = "https://google.com";
			parent.window.open(fileUrl, '_blank');
		},

		_addAttachment: function () {
			var com = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO").getValue();
			var textArea = RSO_MSO_controller.getView().byId("idComments_TA_RSO_ManageSO");
			if (com == "") {
				textArea.setValueState("Error");
				textArea.setValueStateText("Fill the comments");
				var errForm = formatter.formatErrorType("SO000012");
				var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText(errForm);
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
			} else {
				AppController.flgOwnershipUploaded = true;
			}
		},

		_navToRSOrderChange: function () {
			var errMsg = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("errorChange");
			var title = RSO_MSO_controller.getView().getModel("i18n").getResourceBundle().getText("title3");
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
				title: title,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (sAction) {
					if (sAction == "YES") {
						RSO_MSO_controller.getOwnerComponent().getRouter().navTo("SoldOrderChangeReason", {}, true); //page7
					} else {}
				},
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
		},
		////////////////////////////////////////////////////////////////////////////
		onUpload: function (e) {
			var t = RSO_MSO_controller;
			var fU = RSO_MSO_controller.getView().byId("idfileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			var dublicateValue = [];
			try {
				if (file) {
					var that = RSO_MSO_controller;
					that._oBusyDialog.open();

					// To Fetch CSRF Token

					var sUrl = "/sap/opu/odata/SAP/Z***SRV/";
					$.ajax({
						url: sUrl,
						type: "GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", "Fetch");
						},
						success: function (data, textStatus, XMLHttpRequest) {
							oToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
							oHeaders = {
								"x-csrf-token": oToken,
							};

							// ****To Fetch CSRF Token To Upload File

							var oURL = "/sap/opu/odata/SAP/Z***SRV/UploadSet";
							$.ajax({
								type: 'POST',
								url: oURL,
								headers: oHeaders,
								cache: false,
								contentType: ["csv"],
								processData: false,
								data: file,
								success: function (data) {

									var isIE = false || !!document.documentMode;
									if (isIE == true) {
										var ev_result = data.childNodes[0].lastChild.childNodes[1].textContent;
										var ev_error = data.childNodes[0].lastChild.childNodes[0].textContent;
									} else {
										var ev_result = data.getElementsByTagName("entry")[0].children[6].children[1].innerHTML;
										var ev_error = data.getElementsByTagName("entry")[0].children[6].children[0].innerHTML;
									}

									// Success  
									var valSuccessArray = ev_result.split("//");
									var itemsArray = [];
									for (var i = 0; i < valSuccessArray.length; i++) {
										var splitVal = valSuccessArray[i].split(",");
										var items = {
											product: splitVal[0],
											productname: splitVal[1],
											uom: splitVal[2]

										}
										itemsArray.push(items);
									}

									function removeDuplicates(originalArray, prop) {
										var newArray = [];
										var lookupObject = {};

										for (var i in originalArray) {
											lookupObject[originalArray[i][prop]] = originalArray[i];
										}

										for (i in lookupObject) {
											newArray.push(lookupObject[i]);
										}
										return newArray;
									}

									var itemsSuccessArray = removeDuplicates(itemsArray, "product");

									for (var k = 0; k < itemsSuccessArray.length; k++) {
										var countK = k + 1
										var prodcnt = "0000000" + countK;
										prodcnt = prodcnt.substring(prodcnt.length - 8);
										itemsSuccessArray[k].prodno = prodcnt;
									}

									var jsonModel = new sap.ui.model.json.JSONModel(itemsSuccessArray);
									sap.ui.getCore().setModel(jsonModel, 'successModel');
									that.getView().byId("idTable").setModel(jsonModel);
									// Error  
									that._oBusyDialog.close();
								},
								error: function (data) {
									sap.m.MessageToast.show("Error");
									that._oBusyDialog.close();
								}
							});
						}
					});
				}
			} catch (oException) {
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
			}
		},
		/*	uploadFile2: function () {
				var file = jQuery.sap.domById("__xmlview2– fileupload - fu").files[0];
				try {
					if (file) {
						RSO_MSO_controller._bUploading = true;
						var that = RSO_MSO_controller;
					
						var a = “/Yourservice URL or Metadata URL “;
						var f = {
							headers: {“
								X - Requested - With”: “XMLHttpRequest”,
								“Content - Type”: “application / atom + xml”,
								DataServiceVersion: “2.0”,
								“X - CSRF - Token”: “Fetch”
							},
							requestUri: a,
							method: “GET”
						};
						var oHeaders;
						var sUrl = oDataModel.sServiceUrl + “/Your Entity Set “;
						var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
						sap.ui.getCore().setModel(oModel);
						OData.request(f, function (data, oSuccess) {
							oToken = oSuccess.headers[‘x - csrf - token’];
							oHeaders = {“
								x - csrf - token”: oToken,
								“slug”: “QF”,
							};
							//To Fetch CSRF Token To Upload File
							

							var oURL = oDataModel.sServiceUrl + “/Entity Set”;
							jQuery.ajax({
								type: ‘POST’,
								url: oURL,
								headers: oHeaders,
								cache: false,
								contentType: file.type,
								processData: false,
								data: file,
								success: function (data) {
									var rec = data.getElementsByTagName(“entry”)[0].children[5].getAttribute(“src”);
									sap.m.MessageToast.show(“File Uploaded Successfully” + rec);
								},
								error: function (data) {
									sap.m.MessageToast.show(“File Uploaded Successfully”);
								}
							});
						});
					}
				} catch (oException) {
					jQuery.sap.log.error(“File upload failed: \n” + oException.message);
				}
			},*/

		handleUploadComplete: function (c) {
			var _ = RSO_MSO_controller.getControllerInstance();
			var p = c.getParameters();
			if (parseInt(p.status, 10) >= 400) {
				var X = jQuery.parseXML(p.responseRaw);
				var e = RSO_MSO_controller.Xml2Json(X.documentElement);
				var s = {
					message: e.message,
					type: sap.ca.ui.message.Type.ERROR
				};
				sap.ca.ui.message.showMessageBox(s);
			}
			RSO_MSO_controller.onSubmitLRCsuccess(_.objectResponse, _.ResponseMessage);
		},
		getControllerInstance: function () {
			var _ = null;
			return _;

		},
		Xml2Json: function (n) {
			var a = {},
				t = RSO_MSO_controller;
			var A = function (e, v) {
				if (a[e]) {
					if (a[e].constructor !== Array) {
						a[e] = [a[e]];
					}
					a[e][a[e].length] = v;
				} else {
					a[e] = v;
				}
			};
			var c, b;
			for (c = 0; c < n.attributes.length; c++) {
				b = n.attributes[c];
				A(b.name, b.value);
			}
			for (c = 0; c < n.childNodes.length; c++) {
				b = n.childNodes[c];
				if (b.nodeType === 1) {
					if (b.childNodes.length === 1 && b.firstChild.nodeType === 3) {
						A(b.nodeName, b.firstChild.nodeValue);
					} else {
						A(b.nodeName, t.Xml2Json(b));
					}
				}
			}
			return a;
		}

	});
});