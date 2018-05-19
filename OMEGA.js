/* Notes: 
1. This code is probably messy but I don't mind. It works, right?
*/

//Break Omega (oh gosh)
function BrOmega(mantissa, exponent) {  // Mantissa also has sign (like -5). Exponent can be negative.
	//help me
	//aaaaa
	this.mantissa = mantissa
	this.exponent = exponent
	while (Math.abs(this.mantissa) >= 10) {
		this.exponent += 1
		this.mantissa /= 10
	}
	while ((Math.abs(this.mantissa) < 1) && (Math.abs(this.mantissa) > 0)) {
		this.exponent -= 1
		this.mantissa *= 10
	}
	if (this.mantissa == 0) {
		this.exponent = -Infinity
	}
}

// Initialization of variables
var units; var units = 1;
var tickms; var tickms = 33;
var gens; var gens = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]] // First list is generator amount; Second list is amount brought.
var genCosts; var genCosts = [[1, 10, 100, 1000, 1e+5, 1e+7, 1e+9, 1e+11], [2, 3, 4, 6, 16, 24, 32, 64]] // First list is generator cost base; second list is generator cost scaling.

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
	console.log("WIP");
}

function tick(seconds) { // Called whenever 1 tick passes by.
	units += seconds * Math.floor(gens[0][0]);
	for (let i=0; i < 7; i++) {
		gens[0][i] += seconds * Math.floor(gens[0][i+1]);
	}
	updateUnits()
}
setInterval(tick, tickms, (tickms / 1000));
