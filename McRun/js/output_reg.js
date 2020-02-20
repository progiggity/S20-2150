
// Output Register 
// ========

var my;
var theOutsideWorld;

module.exports = {
	setupSelf: function ( OutsideWorld ) {
		console.log ( "Setup Self" );
		theOutsideWorld = OutsideWorld;
		my = {
			  "Name": "Output"
			, "TalkTo": OutsideWorld
			, "Group": "Register"
			, "Interface": {
				  "bus" : { "width": 16, "mode": "io" }
				, "vcc" : { "width": 1, "mode": "i" }
				, "gnd" : { "width": 1, "mode": "i" }
				, "Ld"  : { "width": 1, "mode": "i" }
				, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
				// , "Clr" : { "width": 1, "mode": "i" }
				// , "Inc" : { "width": 1, "mode": "i" }
			}
			, "_data_": 0
			, "_InputBuffer_": 0
			, "_OutputBuffer_": 0
			, "_Ld_": null
			, "_Out_": null
			, "CurState": 0
			, "NewState": 0
			// , "_Clr_": null
			// , "_Inc_": null
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ld":  if ( val === 1 ) { PullBus(true); my["_data_"] = my["_InputBuffer_"]; }				TurnOn( "output_Ld"  );   Display( my["_data_"]); my["_Ld_"] = 1; break;
		case "Out": if ( val === 1 ) { my["_OutputBuffer_"] = my["_data_"]; PushBus(); }   TurnOn( "output_Out" );   Display( my["_data_"]); break;
		case "bus": if ( val === 1 && my["_Ld_"] === 1 ) { PullBus(); my["_data_"] = my["_InputBuffer_"]; }                   break;
		default:
			Error ( "Invalid Message", wire, val );
		}
		// case "Clr": if ( val === 1 ) { my["_data_"] = 0; }									TurnOn( "output_Clr" );   Display( my["_data_"]); break;
		// case "Inc": if ( val === 1 ) { my["_data_"] = my["_data_"] + 1; }	    			TurnOn( "output_Inc" );   Display( my["_data_"]); break;
	}
	, tick: function ( ) {
		if ( my["_Ld_"] === 1 ) {
			PullBus();
			my["_data_"] = my["_InputBuffer_"];
		}
		if ( my["_Out_"] === 1 ) {
			my["_OutputBuffer_"] = my["_data_"];
			PushBus();
		}

		Display( my["_data_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_Ld_"] = null;
		my["_Out_"] = null;
		// my["_Clr_"] = null;
		// my["_Inc_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( my["_data_"] );
	}
};

function PullBus() {
	if(theOutsideWorld.Bus && typeof theOutsideWorld.Bus.State === "function") {
		 my["_InputBuffer_"] = theOutsideWorld.Bus.State();
	}
}

function PushBus() {
	if(theOutsideWorld.Bus && typeof theOutsideWorld.Bus.SetState === "function") {
		theOutsideWorld.Bus.SetState( my["_OutputBuffer_"] );
	}
}

// Turn on display of a wire with this ID
function TurnOn ( id ) {
	if(typeof theOutsideWorld.TurnOn === "function") {
		theOutsideWorld.TurnOn ( my.Name, my, id );
	} else {
		console.log ( "Turn On ("+my.Name+")", id );
	}
}

// Display text to inside of register box
function Display ( val ) {
	if(typeof theOutsideWorld.Display === "function") {
		theOutsideWorld.Display ( my.Name, my, val );
	} else {
		console.log ( "Display ("+my.Name+")", val );
	}
}

// Return any errors generated in this "chip"
function Error ( errorMsg, wire, val ) {
	return ( [] );
}

