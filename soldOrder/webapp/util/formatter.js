jQuery.sap.declare("toyota.ca.SoldOrder.util.formatter");

toyota.ca.SoldOrder.util.formatter = {

	format: function (val) {
		var text = "Test Case";
		if (val) {
			return text;
		}
		return text;
	},
	formatRF: function (val) {
		var j;
		if (val == "R") {
			j = "Retail";
		} else if (val == "F") {
			j = "Fleet";
		} else {
			j = "Retail";
		}
		return j;
	},
	formatcurrentMonth: function (m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12) {
		var d = new Date();
		var n = d.getMonth() + 1;
		var currentMonth = " ";
		var currentMonth1 = " ";
		var currentMonth2 = " ";
		if (n == 1) {
			currentMonth = m1;
			currentMonth1 = m2;
			currentMonth2 = m3;
		} else if (n == "2") {
			currentMonth = m2;
			currentMonth1 = m3;
			currentMonth2 = m4;
		} else if (n == "3") {
			currentMonth = m3;
			currentMonth1 = m4;
			currentMonth2 = m5;
		} else if (n == "4") {
			currentMonth = m4;
			currentMonth1 = m5;
			currentMonth2 = m6;
		} else if (n == "5") {
			currentMonth = m5;
			currentMonth1 = m6;
			currentMonth2 = m7;
		} else if (n == "6") {
			currentMonth = m6;
			currentMonth1 = m7;
			currentMonth2 = m8;
		} else if (n == "7") {
			currentMonth = m7;
			currentMonth1 = m8;
			currentMonth2 = m9;
		} else if (n == "8") {
			currentMonth = m8;
			currentMonth1 = m9;
			currentMonth2 = m10;
		} else if (n == "9") {
			currentMonth = m9;
			currentMonth1 = m10;
			currentMonth2 = m11;
		} else if (n == "10") {
			currentMonth = m10;
			currentMonth1 = m11;
			currentMonth2 = m12;
		} else if (n == "11") {
			currentMonth = m11;
			currentMonth1 = m12;
			currentMonth2 = m1;
		} else {
			currentMonth = m12;
			currentMonth1 = m1;
			currentMonth2 = m2;
		}
		return currentMonth;
	},
	formatcurrentMonth1: function (m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12) {
		var d = new Date();
		var n = d.getMonth() + 1;
		var currentMonth = " ";
		var currentMonth1 = " ";
		var currentMonth2 = " ";
		if (n == 1) {
			currentMonth = m1;
			currentMonth1 = m2;
			currentMonth2 = m3;
		} else if (n == "2") {
			currentMonth = m2;
			currentMonth1 = m3;
			currentMonth2 = m4;
		} else if (n == "3") {
			currentMonth = m3;
			currentMonth1 = m4;
			currentMonth2 = m5;
		} else if (n == "4") {
			currentMonth = m4;
			currentMonth1 = m5;
			currentMonth2 = m6;
		} else if (n == "5") {
			currentMonth = m5;
			currentMonth1 = m6;
			currentMonth2 = m7;
		} else if (n == "6") {
			currentMonth = m6;
			currentMonth1 = m7;
			currentMonth2 = m8;
		} else if (n == "7") {
			currentMonth = m7;
			currentMonth1 = m8;
			currentMonth2 = m9;
		} else if (n == "8") {
			currentMonth = m8;
			currentMonth1 = m9;
			currentMonth2 = m10;
		} else if (n == "9") {
			currentMonth = m9;
			currentMonth1 = m10;
			currentMonth2 = m11;
		} else if (n == "10") {
			currentMonth = m10;
			currentMonth1 = m11;
			currentMonth2 = m12;
		} else if (n == "11") {
			currentMonth = m11;
			currentMonth1 = m12;
			currentMonth2 = m1;
		} else {
			currentMonth = m12;
			currentMonth1 = m1;
			currentMonth2 = m2;
		}
		return currentMonth1;
	},
	formatcurrentMonth2: function (m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12) {
		var d = new Date();
		var n = d.getMonth() + 1;
		var currentMonth = " ";
		var currentMonth1 = " ";
		var currentMonth2 = " ";
		if (n == 1) {
			currentMonth = m1;
			currentMonth1 = m2;
			currentMonth2 = m3;
		} else if (n == "2") {
			currentMonth = m2;
			currentMonth1 = m3;
			currentMonth2 = m4;
		} else if (n == "3") {
			currentMonth = m3;
			currentMonth1 = m4;
			currentMonth2 = m5;
		} else if (n == "4") {
			currentMonth = m4;
			currentMonth1 = m5;
			currentMonth2 = m6;
		} else if (n == "5") {
			currentMonth = m5;
			currentMonth1 = m6;
			currentMonth2 = m7;
		} else if (n == "6") {
			currentMonth = m6;
			currentMonth1 = m7;
			currentMonth2 = m8;
		} else if (n == "7") {
			currentMonth = m7;
			currentMonth1 = m8;
			currentMonth2 = m9;
		} else if (n == "8") {
			currentMonth = m8;
			currentMonth1 = m9;
			currentMonth2 = m10;
		} else if (n == "9") {
			currentMonth = m9;
			currentMonth1 = m10;
			currentMonth2 = m11;
		} else if (n == "10") {
			currentMonth = m10;
			currentMonth1 = m11;
			currentMonth2 = m12;
		} else if (n == "11") {
			currentMonth = m11;
			currentMonth1 = m12;
			currentMonth2 = m1;
		} else {
			currentMonth = m12;
			currentMonth1 = m1;
			currentMonth2 = m2;
		}
		return currentMonth2;
	},
	formatNFSOFlag: function (oData, apiData, nfFlag, soFlag) {
		var empty = " ";
		if (nfFlag == true) {
			return oData;
		} else if (soFlag == true) {
			return apiData;
		} else {
			return empty;
		}

	},
	formatModel: function (ModelCode, ModelDescription) {
		var text = ModelCode + "-" + ModelDescription;
		return text;
	},
	formatDealer: function (DealerCode, DealerName) {
		var text = DealerCode + "-" + DealerName;
		return text;
	},

	VTNDate: function (value, vtn) {
		if (vtn) {
			return value;
		} else {
			return "";
		}

	},
	formatSuffix: function (Suffix, SuffixDescriptionEN) {
		// "Suffix - " +  
		var text = Suffix + "/ " + SuffixDescriptionEN; //InteriorColourDescription;
		if (Suffix) {
			return text;
		}
	},
	formatSuffix1: function (Suffix, Option, SuffixDescriptionEN) {
		// "Suffix - " + dd 
		var text = Suffix + "/ " + Option + "/ " + SuffixDescriptionEN; //InteriorColourDescription;
		if (Suffix) {
			return text;
		}
	},
	formatColour: function (ColorCode, ColourDescription) {

		if (ColorCode) {
			return ColorCode + " - " + ColourDescription;
		}
	},
	formatName: function (firstName, famName, custReg) {

		var name = firstName + " " + famName;
		if (custReg == 'X') {
			return name;
		} else {
			return "";
		}
	},
	formatOrderTypewithVTN: function (Code, Vtn) {
		if (Vtn) {
			return Code;
		} else {
			return "";
		}
	},
	formatOrderType: function (Code) {
		if (Code === "SO") {
			return "STOCK Restricted";
		} else if (Code === "DM") {
			return "DEMO";
		} else if (Code === "BA") {
			return "BANK ALLOC";
		} else if (Code === "LS") {
			return "LAUNCH Stock";
		} else if (Code === "RS") {
			return "RETAIL SOLD";
		} else if (Code === "F1") {
			return "DLR RAC";
		} else if (Code === "F2") {
			return "DLR ELITE";
		} else if (Code === "F3") {
			return "NAT RAC";
		} else if (Code === "F4") {
			return "NAT ELITE";
		} else if (Code === "F5") {
			return "MOBILITY";
		} else {
			return;
		}
	},
	formatErrorType: function (Code) {
		if (Code === "SO00001") {
			return "SO00001"; //"User can only pick future dates.
		} else if (Code === "SO00002") {
			return "SO00002"; //"User should leave at least 5 days duration between from and to date.
		} else if (Code === "SO00003") {
			return "SO00003"; //"The user has not selected/entered all the mandatory information. Please complete all Mandatory fields";
		} else if (Code === "SO00004") {
			return "SO00004"; //"The user did not validate the customer information. Please validate customer information before submitting the request";
		} else if (Code === "SO00005") {
			return "SO00005"; //"System validation against the trading guideline before assignment failed. Assignment is  not completed.";
		} else if (Code === "SO00006") {
			return "SO00006"; //"Comments not filled and reason for selection is other.";
		} else if (Code === "SO00007") {
			return "SO00007"; //"User should select a row";
		} else if (Code === "SO00008") {
			return "SO00008"; //"The user selected a date which is less than 30 days+ Current calendar date";
		} else if (Code === "SO00009") {
			return "SO00009"; //"The user selected a date with less than 5 days gap from, from date";
		} else if (Code === "SO000010") {
			return "SO000010"; //"System doesn't find a vehicle with the VIN number or VTN number or Vehicle is not available for dealer assignment";
		} else if (Code === "SO000011") {
			return "SO000011"; //"Invalid FAN Number. Enter correct FAN Number";
		} else if (Code === "SO000012") {
			return "SO000012"; //"Comments not filled";
		} else if (Code === "SO000013") {
			return "SO000013"; //"Comments not filled";
		} else if (Code === "SO000014") {
			return "SO000014"; //"Comments not filled";
		} else if (Code === "SO000015") {
			return "SO000015"; //"Comments not filled";
		} else if (Code === "SO000016") {
			return "SO000016"; //"Comments not filled";
		} else if (Code === "SO000017") {
			return "SO000017"; //"Comments not filled";
		} else if (Code === "SO000018") {
			return "SO000018"; //"Comments not filled";
		} else if (Code === "SO000019") {
			return "SO000019"; //"Comments not filled";
		} else if (Code === "SO000020") {
			return "SO000020"; //"Comments not filled";
		} else if (Code === "SO000021") {
			return "SO000021"; //"Comments not filled";
		} else if (Code === "SO000022") {
			return "SO000022"; //"Comments not filled";
		} else if (Code === "SO000023") {
			return "SO000023"; //"Comments not filled";
		} else {
			return;
		}
	},
	linkvehicle: function (vehicle) {
		if (vehicle) {
			return false;
		} else {
			return true;
		}

	},
	linkvehicleRetail: function (vehicle, status) {
		if ((!vehicle) && ((status === "Pending Fulfillment") || (status === "PENDING FULFILLMENT"))) {
			return true;
		} else {
			return false;
		}

	},

	RegCustomer: function (cust, regvalue) {
		if (regvalue == 'X') {
			return cust;
		} else {
			return "";
		}
	},
	Dealerusertype: function (Usertypevalue) {
		if (Usertypevalue == 'Dealer_User') {
			return true;
		} else {
			return false;
		}
	},
	NationalorZonalusertype: function (Usertypevalue) {

		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		if ((Usertypevalue === "National") || (Usertypevalue === "TCI_User") || (Usertypevalue === "National_Fleet_User") || (Usertypevalue == "TCI_Zone_User")) {
			return true;
		} else {
			return false;
		}
	},
	TCIorZonalusertype: function (Usertypevalue) {

		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		if ((Usertypevalue === "TCI_User") || (Usertypevalue == "TCI_Zone_User") || (Usertypevalue === "National_Fleet_User")) {
			return true;
		} else {
			return false;
		}
	},
	NonTCIorZonalusertype: function (Usertypevalue) {
		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		if ((Usertypevalue === "TCI_User") || (Usertypevalue == "TCI_Zone_User") || (Usertypevalue === "National_Fleet_User")) {
			return false;
		} else {
			return true;
		}
	},
	Nationalusertype: function (Usertypevalue) {
		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		if ((Usertypevalue === "National") || (Usertypevalue === "TCI_User") || (Usertypevalue === "National_Fleet_User") || (Usertypevalue === "TCI_Zone_User")) {
			return false;
		} else {
			return true;
		}
	},
	Tciusertype: function (Usertypevalue) {
		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		if ((Usertypevalue == 'TCI_User') || (Usertypevalue === "National_Fleet_User") || (Usertypevalue === "TCI_Zone_User")) {
			return true;
		} else {
			return false;
		}
	},
	Tciusernzonetype: function (Usertypevalue) {
		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		if ((Usertypevalue === 'TCI_User') || (Usertypevalue === "TCI_Zone_User") || (Usertypevalue === "National_Fleet_User")) {
			return true;
		} else {
			return false;
		}

	},
	Tciuseraudit: function (status) {
		if (status == "IN-PROGRESS") {
			return true;
		} else {
			return false;
		}
	},
	TciApprove: function (svalue) {
		//Added by for National fleet user singhmi DMND0002946 on 11/03/2021
		var oUserType = this.getParent().getParent().oPropagatedProperties.oModels.LoginUserModel.getData().UserType;
		if (svalue === "REQUESTED" && oUserType !== "National_Fleet_User") {
			return true;
		} else if (svalue === "ZONE APPROVED" && oUserType === "National_Fleet_User") {
			return true;
		} else {
			return false;
		}
	},
	formatAmount: function (svalue) {
		if ((svalue != "") && (svalue !== null) && (svalue !== undefined)) {
			var pos = svalue.indexOf('.');
			var integer = svalue.substring(0, pos);
			var decimals = svalue.substring(pos + 1, pos + 3);
			var new_Value = integer + '.' + decimals;
			var amount = "$" + new_Value;
			return amount;
		} else {
			return "";
		}
	},
	formatdealers: function (dealerno, dealername) {
		if (dealerno) {
			return dealerno.slice(-5) + "-" + dealername;
		}
	},
	formatdealerno: function (dealerno) {
		if (dealerno) {
			return dealerno.slice(-5);
		}
	},
	// changes done for incident INC0207766 by Minakshi on 20/04/2022
	ordercancelled: function (orderstatus) {
		if (orderstatus == "CANCELLED" || orderstatus == "CHANGED") {
			return false;
		} else {
			return true;
		}
	},
	// changes done for incident INC0207766 by Minakshi on 20/04/2022
	orderFilled: function (orderstatus) {
		if (orderstatus == "CANCELLED" || orderstatus == "FILLED" || orderstatus == "CHANGED") {
			return false;
		} else {
			return true;
		}
	},
	_timeStamp: function (date) {
		var dat1 = "";
		var res4 = " ";
		if (date) {
			var str = date;
			var res = str.split("(");
			var res2 = res[1].split(")");
			var result = res2[0];
			var result2 = parseInt(result);
			var dat4 = new Date(result2);
			dat1 = dat4.toDateString();
			var dat2 = dat4.toTimeString();
			var res3 = dat2.split(" ");
			res4 = res3[0];
		} else {
			dat1 = "";
			res4 = "";
		}
		return dat1 + " " + res4;
	},
	_timeStamp1: function (date) {
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			style: "yyyy-MM-dd"
		});
		var empty = "";
		if (date) {
			var sDate = oFormat.format(new Date(date));
			return sDate;
		} else
			return empty;
	},
	usertype: function (userType) {
		if (userType == "9999") {
			return "TCI_User";
		} else if (userType == "8888") {
			return "TCI_Zone_User";
		} else {
			return "Dealer_User ";
		}

	},
	_DateFomatter: function (oDate) {
		if (oDate) {
			var year = oDate.substring(0, 4);
			var month = oDate.substring(4, 6);
			var day = oDate.substring(6, 8);

			return year + "-" + month + "-" + day;
		}
	},
	fnDateFormat: function (val) {
		var Oval;
		if (val) {
			//var oText = val.toUTCString();
			Oval = moment.utc(val).format("DD.MM.YYYY");
		} else {
			Oval = null;
		}
		return Oval;

	},
	fnValFormat: function (val) {
		if(val){
			return "    " + val;
		}
	},
	stringDateConverter: function (val) {
		var sval, sdate;
		// var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
		// 	pattern: "MM-DD-YYYY"
		// });
		if (val != "" && val != null && val != undefined) {
			sdate = val.split(" ")[0];
			sval = sdate.replaceAll(".", "-");
		} else {
			sval = null;
		}
		return sval;
	},
	tableCount: function(current, totalCount)
	{
		var recordStatus = "["+current+" / "+totalCount+"]";
		return recordStatus;
	}

};