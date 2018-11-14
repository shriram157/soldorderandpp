jQuery.sap.declare("toyota.ca.SoldOrder.Formatter.formatter");

	toyota.ca.SoldOrder.Formatter.formatter = {

	format: function(val) {
			var text="nothing";
			if(val){
				return text;
			}
			return text;
			//ModelCode+"-"+ModelDescription;
	
	},
	formatModel: function(ModelCode, ModelDescription) {
			var text =ModelCode+"-"+ModelDescription;
			return text;
			//ModelCode+"-"+ModelDescription;
	
	},
	formatSuffix: function(SuffixDescription, InteriorColourDescription) {
		var text="Suffix - " + SuffixDescription + "/ " + InteriorColourDescription;
		if (SuffixDescription) {
			return text;
		}
	},
	formatColor: function(ColorCode, ColourDescription) {

		if (ColorCode) {
			return ColorCode + " - " + ColourDescription;
		}
	},
	formatOrderType: function(Code) {
		if (Code === "SO") {
			return "STOCK Restricted";
		}
		else if (Code === "DM") {
			return "DEMO ";
		}
		else if (Code === "BA") {
			return "BANK ALLOC ";
		}
		else if (Code === "LS") {
			return "LAUNCH Stock ";
		}
		else if (Code === "RS") {
			return "RETAIL SOLD ";
		}
		else if (Code === "F1") {
			return "DLR RAC ";
		}
		else if (Code === "F2") {
			return "DLR ELITE ";
		}
		else if (Code === "F3") {
			return "NAT RAC ";
		}
		else if (Code === "F4") {
			return "NAT ELITE";
		}
		else if(Code === "F5") {
			return "MOBILITY ";
		}
		else {
			return ;
		}
	}
};