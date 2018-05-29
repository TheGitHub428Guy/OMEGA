/* Notes: 
1. This code is probably messy but I don't mind. It works, right?
*/

//Break Omega
function BrOmega(mantissa, exponent) {  // Mantissa also has sign (like -5). Exponent can be negative.
	/* Initialization first, of course */
	this.mantissa = mantissa * (10 ** (exponent % 1))
	this.exponent = Math.floor(exponent)
	if (this.mantissa == 0 || this.exponent == -Infinity) {
		this.mantissa = 1
		this.exponent = -Infinity
	}
	while (Math.abs(this.mantissa) >= 10) {
		this.exponent += 1
		this.mantissa /= 10
	}
	while ((Math.abs(this.mantissa) < 1) && (Math.abs(this.mantissa) > 0)) {
		this.exponent -= 1
		this.mantissa *= 10
	}
	/* TIME FOR FUNCTIONS */
	this.add = function (other) {
		if (other.exponent > this.exponent) {
			return new BrOmega(other.mantissa + (this.mantissa * (10 ** (this.exponent - other.exponent))), other.exponent)
		} else {
			return new BrOmega(this.mantissa + (other.mantissa * (10 ** (other.exponent - this.exponent))), this.exponent)
		}
	}
	this.sub = function (other) {
		return this.add(new BrOmega(-other.mantissa, other.exponent))
	}
	this.mul = function (other) {
		return new BrOmega(this.mantissa * other.mantissa, this.exponent + other.exponent)
	}
	this.div = function (other) {
		return new BrOmega(this.mantissa / other.mantissa, this.exponent - other.exponent)
	}
	this.pow = function (other) { //use an integer for "other" in this one
		let logten = 0;
		if (this.mantissa == 0) {
			return new BrOmega(0, 0)
		} else {
			if (Math.log10(10) == 1) {
				logten = Math.log10(Math.abs(this.mantissa));
			} else {
				logten = Math.log(Math.abs(this.mantissa)) / Math.log(10);
			}
			let almostdone = new BrOmega(10 ** ((logten * other) % 1), (this.exponent * other) + Math.floor(logten * other));
			return new BrOmega(almostdone.mantissa * ((this.mantissa / Math.abs(this.mantissa)) ** other), almostdone.exponent);
		}
	}
	this.abs = function () {
		return new BrOmega(Math.abs(this.mantissa), this.exponent)
	}
	this.eq = function (other) {
		return (this.mantissa == other.mantissa) && (this.exponent == other.exponent)
	}
	this.gt = function (other) {
		return (((this.sub(other)).mantissa > 0) && !((this.sub(other)).exponent == -Infinity))
	}
	this.lt = function (other) {
		return other.gt(this)
	}
	this.toSci = function (plus, digitsRight, digitsLimit) { // This one was the hardest one so far
		/* The "plus" parameter determines if it's like 5e9 or 5e+9. 
		The "digitsRight" parameter determines how many digits are to the right of the decimal point. Example: 6.856e+8 -> 6.85e+8.
		The "digitsLeft" parameter determines how big/small the number has to be until it switches to scientific notation. Example: 12345 -> 1.23e4.*/
		let sciResult = "";
		if (Math.abs(this.exponent) > digitsLimit) {
			if (plus && (this.exponent >= 0)) { 
				if ((this.mantissa.toString(10).indexOf(".") == -1) || (this.mantissa.toString(10).length < this.mantissa.toString(10).indexOf(".") + digitsRight + 3)) {
					sciResult = (this.mantissa.toString(10) + "e+" + this.exponent.toString(10)) 
				} else {
					sciResult = (this.mantissa.toString(10).slice(0, this.mantissa.toString(10).indexOf(".") + digitsRight + 1) + "e+" + this.exponent.toString(10)) 
				}
			} else { 
				if ((this.mantissa.toString(10).indexOf(".") == -1) || (this.mantissa.toString(10).length < this.mantissa.toString(10).indexOf(".") + digitsRight + 3)) {
					sciResult = (this.mantissa.toString(10) + "e" + this.exponent.toString(10)) 
				} else {
					sciResult = (this.mantissa.toString(10).slice(0, this.mantissa.toString(10).indexOf(".") + digitsRight + 1) + "e" + this.exponent.toString(10)) 
				}
			}
		} else {
			if (((this.mantissa * (10 ** this.exponent)).toString(10).indexOf(".") == -1) || ((this.mantissa * (10 ** this.exponent)).toString(10).length < this.mantissa.toString(10).indexOf(".") + digitsRight + 3)) {
				sciResult = ((this.mantissa * (10 ** this.exponent)).toString(10))
			} else {
				sciResult = ((this.mantissa * (10 ** this.exponent)).toString(10).slice(0, this.mantissa.toString(10).indexOf(".") + digitsRight + 1))
			}
		}
		if (sciResult[sciResult.length - 1] == ".") {
			sciResult = sciResult.slice(0, sciResult.length - 1);
		}
		if (this.exponent == -Infinity) {
			return "0";
		} else {
			return sciResult;
		}
	}
}

// Initialization of variables
var units; var units = new BrOmega(1, 0);
var tickms; var tickms = 33;
var gens; var gens = [[new BrOmega(0, 0), new BrOmega(0, 0), new BrOmega(0, 0), new BrOmega(0, 0), new BrOmega(0, 0), new BrOmega(0, 0), new BrOmega(0, 0), new BrOmega(0, 0)], [0, 0, 0, 0, 0, 0, 0, 0]] // First list is generator amount; Second list is amount brought.
var genCosts; var genCosts = [[new BrOmega(1, 0), new BrOmega(1, 1), new BrOmega(1, 2), new BrOmega(1, 3), new BrOmega(1, 5), new BrOmega(1, 7), new BrOmega(1, 9), new BrOmega(1, 11)], [new BrOmega(2, 0), new BrOmega(3, 0), new BrOmega(4, 0), new BrOmega(6, 0), new BrOmega(16, 0), new BrOmega(24, 0), new BrOmega(32, 0), new BrOmega(64, 0)]] // First list is generator cost base; second list is generator cost scaling.

// Functions

function buy(gen) { // Buy a certain generator.
	if (!(units.lt(genCosts[0][gen].mul(genCosts[1][gen].pow(gens[1][gen]))))) {
		units = units.sub(genCosts[0][gen].mul(genCosts[1][gen].pow(gens[1][gen])))
		console.log(genCosts[0][gen].mul(genCosts[1][gen].pow(gens[1][gen])).toSci(false, 5, 10))
		gens[1][gen] += 1;
		gens[0][gen] = gens[0][gen].add(new BrOmega(1, 0))
		document.getElementById("buyAlpha").innerHTML = "Cost: " + genCosts[0][gen].mul(genCosts[1][gen].pow(gens[1][gen])).toSci(false, 2, 4)
	}
}

function calcMul(gen) {
	return new BrOmega(1, 0);
}

function tick(seconds) { // Called whenever 1 tick passes by.
	units = units.add((new BrOmega(seconds, 0)).mul(gens[0][0]));
	for (let i=0; i < 7; i++) {
		gens[0][i] = gens[0][i].add((new BrOmega(seconds, 0)).mul(gens[0][i+1]))
		// gens[0][i] += seconds * Math.floor(gens[0][i+1]);
	}
	document.getElementById("units").innerHTML = units.toSci(false, 2, 3);
	document.getElementById("alpha").innerHTML = gens[0][0].toSci(false, 2, 3) + "(" + gens[1][0].toString(10) + ")";
}
setInterval(tick, tickms, (tickms / 1000));
