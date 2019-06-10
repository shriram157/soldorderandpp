jQuery.sap.declare("toyota.ca.SoldOrder.util.formatter");

toyota.ca.SoldOrder.util.formatter = {

	format: function (val) {
		var text = "Test Case";
		if (val) {
			return text;
		}
		return text;
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
			if(Vtn)
			{
				return Code;
			}
			else
			{
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
		}
		else if (Code === "SO000013") {
			return "SO000013"; //"Comments not filled";
		}else if (Code === "SO000014") {
			return "SO000014"; //"Comments not filled";
		}else if (Code === "SO000015") {
			return "SO000015"; //"Comments not filled";
		}else if (Code === "SO000016") {
			return "SO000016"; //"Comments not filled";
		}else if (Code === "SO000017") {
			return "SO000017"; //"Comments not filled";
		}else if (Code === "SO000018") {
			return "SO000018"; //"Comments not filled";
		}else if (Code === "SO000019") {
			return "SO000019"; //"Comments not filled";
		}else if (Code === "SO000020") {
			return "SO000020"; //"Comments not filled";
		}
		else if (Code === "SO000021") {
			return "SO000021"; //"Comments not filled";
		}else if (Code === "SO000022") {
			return "SO000022"; //"Comments not filled";
		}else if (Code === "SO000023") {
			return "SO000023"; //"Comments not filled";
		}
		else {
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
	linkvehicleRetail: function (vehicle,status) {
		if ((!vehicle) && ((status==="Pending Fulfillment")||(status==="PENDING FULFILLMENT"))) {
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
		if ((Usertypevalue === "National") ||(Usertypevalue === "TCI_User") ) {
			return true;
		} else {
			return false;
		}
	},
	Tciusertype: function (Usertypevalue) {
		if (Usertypevalue == 'TCI_User') {
			return true;
		} else {
			return false;
		}
	},
	Tciusernzonetype: function (Usertypevalue){
		if ((Usertypevalue === 'TCI_User') || (Usertypevalue === "TCI_Zone_User"))
		{
			return true;
		}else {
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
		if ((svalue == 'APPROVED') || (svalue == 'REJECTED')) {
			return false;
		} else {
			return true;
		}
	},
		formatAmount: function (svalue) {
		if((svalue != "") && (svalue !== null) )
		{
			var pos = svalue.indexOf('.');
			var integer = svalue.substring(0,pos);
        var decimals = svalue.substring(pos+1, pos+3);
        var new_Value = integer+'.'+decimals;
			var amount = "$"+new_Value;
			return amount;
		}
		else
		{
			return "";
		}
	},
	formatdealers:function(dealerno,dealername)
	{
		if(dealerno){
		return dealerno.slice(-5) + "-" + dealername;
		}
	},
	formatdealerno:function(dealerno)
	{
		if(dealerno){
		return dealerno.slice(-5);
		}
	},
	ordercancelled:function(orderstatus)
	{
			if (orderstatus == "CANCELLED") {
			return false;
		} else {
			return true;
		}
	}

};