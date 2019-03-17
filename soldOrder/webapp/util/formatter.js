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
	formatSuffix: function (Suffix, SuffixDescriptionEN) {
		// "Suffix - " +  
		var text = Suffix + "/ " + SuffixDescriptionEN ;//InteriorColourDescription;
		if (Suffix) {
			return text;
		}
	},
	formatSuffix1: function (Suffix,Option,SuffixDescriptionEN) {
		// "Suffix - " + dd 
		var text = Suffix + "/ " + Option + "/ " + SuffixDescriptionEN ;//InteriorColourDescription;
		if (Suffix) {
			return text;
		}
	},
	formatColour: function (ColorCode, ColourDescription) {

		if (ColorCode) {
			return ColorCode + " - " + ColourDescription;
		}
	},
	formatOrderType: function (Code) {
		if (Code === "SO") {
			return "STOCK Restricted (SO)";
		} else if (Code === "DM") {
			return "DEMO (DM)";
		} else if (Code === "BA") {
			return "BANK ALLOC (BA)";
		} else if (Code === "LS") {
			return "LAUNCH Stock (LS)";
		} else if (Code === "RS") {
			return "RETAIL SOLD (RS) ";
		} else if (Code === "F1") {
			return "DLR RAC (F1)";
		} else if (Code === "F2") {
			return "DLR ELITE (F2)";
		} else if (Code === "F3") {
			return "NAT RAC (F3)";
		} else if (Code === "F4") {
			return "NAT ELITE (F4)";
		} else if (Code === "F5") {
			return "MOBILITY (F5)";
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
		} else {
			return;
		}
	},
	linkvehicle:function(vehicle)
	{
		if(vehicle)
		{
			return false;
		}else
		{
			return true;
		}
			
	
	}
};