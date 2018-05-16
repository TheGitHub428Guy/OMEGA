/* Notes: 
1. This code is probably messy but I don't mind. It works, right?
*/
// Initialization of variables
var units; var units = 0;
var tickms; var tickms = 33;

// Functions
function updateUnits() { // Update the units text.
	if (units.toString(10).indexOf(".") == -1) {
		document.getElementById("units").innerHTML = units.toString(10);
	} else {
		document.getElementById("units").innerHTML = units.toString(10).slice(0, units.toString(10).indexOf(".") + 4);
		while (document.getElementById("units").innerHTML[-1] == "0" || document.getElementById("units").innerHTML[-1] == ".") {
			document.getElementById("units").innerHTML.pop();
		}
	}
}

function buy(gen) { // Buy a certain generator.
	alert("This is a work in (not much) progress right now.");
}

function tick(seconds) { // Called whenever 1 tick passes by.
	units += seconds;
	updateUnits()
}
setInterval(tick, tickms, (tickms / 1000));
