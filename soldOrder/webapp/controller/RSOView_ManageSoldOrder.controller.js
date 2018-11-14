sap.ui.define([
	"toyota/ca/SoldOrder/controller/BaseController",
	"sap/ui/model/resource/ResourceModel"
], function (BaseController, ResourceModel) {
	"use strict";

	return BaseController.extend("toyota.ca.SoldOrder.controller.RSOView_ManageSoldOrder", {
		/*onInit: function () {
			var i18nModel = new ResourceModel({
				bundleName: "toyota.ca.SoldOrder.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");
		},*/
		onInit: function () {
			this.getBrowserLanguage();
			this._oBusyDialog = new sap.m.BusyDialog();
		},
		_onDeleteAttachment: function (evt) {
			var oTable = this.getView().byId("table_RSOViewManageSO");
			console.log(evt.getSource().getBindingContext()); // "/ProductCollection/0"
			var sPath = evt.getSource().getBindingContext().sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			var model = oTable.getModel();
			var data = model.getProperty("/ProductCollection");
			var removed = data.splice(oIndex, 1);
			model.setProperty("/ProductCollection", data);
			console.log(data);
			oTable.getModel().refresh();
			this.getView().getModel().refresh(true);

		},
		browse: function () {
			console.log("in upload complete");
		},
		_oBrowse: function () {
			console.log("in upload progress");
			var textArea = this.getView().byId("idComments_TA_RSO_ManageSO");
			var text = textArea.getValue();
			console.log(text);
			if (text == "") {
				textArea.setValueState("Error");
				textArea.setValueStateText("Fill the comments");
			}
		},

		_ohandleUploadComplete: function () {

		},

		onAfterRendering: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = "S09732984"; // this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("mangSoldOrder", [sRecipient]);
			this.getView().byId("label_MangSoldOrderid").setText(sMsg);
		},
		onUpload: function (e) {

			var t = this;
			var fU = this.getView().byId("idfileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			var dublicateValue = [];
			try {
				if (file) {
					var that = this;
					that._oBusyDialog.open();

					/****************To Fetch CSRF Token*******************/

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

							/****************To Fetch CSRF Token*******************/

							/*******************To Upload File************************/

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

									/******* Success  *********/
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

									/******* Error  *********/
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
		uploadFile2: function () {
			var file = jQuery.sap.domById(“__xmlview2– fileupload - fu”).files[0];
			try {
				if (file) {
					this._bUploading = true;
					var that = this;
					/****************To Fetch CSRF Token*******************/
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
						/****************To Fetch CSRF Token*******************/
						/*******************To Upload File************************/

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
		},

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.capractise.view.RSOView_ManageSoldOrder
		 */
		//	onExit: function() {
		//
		//	}

			handleUploadComplete: function (c) {
			var _ = this.getControllerInstance();
			var p = c.getParameters();
			if (parseInt(p.status, 10) >= 400) {
				var X = jQuery.parseXML(p.responseRaw);
				var e = this.Xml2Json(X.documentElement);
				var s = {
					message: e.message,
					type: sap.ca.ui.message.Type.ERROR
				};
				sap.ca.ui.message.showMessageBox(s);
			}
			this.onSubmitLRCsuccess(_.objectResponse, _.ResponseMessage);
		},
		getControllerInstance: function () {
			var _ = null;
			return _;

		},
		Xml2Json: function (n) {
			var a = {},
				t = this;
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