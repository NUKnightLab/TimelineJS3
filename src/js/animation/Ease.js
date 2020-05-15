/* The equations defined here are open source under BSD License.
 * http://www.robertpenner.com/easing_terms_of_use.html (c) 2003 Robert Penner
 * Adapted to single time-based by
 * Brian Crescimanno <brian.crescimanno@gmail.com>
 * Ken Snyder <kendsnyder@gmail.com>
 */

/** MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * KeySpline - use bezier curve for transition easing function
 * is inspired from Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 */

const Easings = {
    ease:        [0.25, 0.1, 0.25, 1.0], 
    linear:      [0.00, 0.0, 1.00, 1.0],
    easein:     [0.42, 0.0, 1.00, 1.0],
    easeout:    [0.00, 0.0, 0.58, 1.0],
    easeinout: [0.42, 0.0, 0.58, 1.0]
};

function sinusoidal(pos){
	return (-Math.cos(pos * Math.PI) / 2) + 0.5;
}

function KeySpline(a) {
//KeySpline(mX1, mY1, mX2, mY2){
    function get(aX) {
           if (a[0] == a[1] && a[2] == a[3]) return aX; // linear
           return CalcBezier(GetTForX(aX), a[1], a[3]);
       }

	function A(aA1, aA2) {
		return 1.0 - 3.0 * aA2 + 3.0 * aA1;
	}

	function B(aA1, aA2) {
		return 3.0 * aA2 - 6.0 * aA1;
	}

	function C(aA1) {
		return 3.0 * aA1;
	}

	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.

	function CalcBezier(aT, aA1, aA2) {
		return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
	}

	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.

	function GetSlope(aT, aA1, aA2) {
		return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	}

	function GetTForX(aX) {
		// Newton raphson iteration
		var aGuessT = aX;
		for (var i = 0; i < 4; ++i) {
			var currentSlope = GetSlope(aGuessT, a[0], a[2]);
			if (currentSlope == 0.0) return aGuessT;
			var currentX = CalcBezier(aGuessT, a[0], a[2]) - aX;
			aGuessT -= currentX / currentSlope;
		}
		return aGuessT;
	}
}
	


export function easeInSpline(t){
	var spline = new KeySpline(Easings.easein);
	return spline.get(t);
}

export function easeInOutExpo(t){
	var spline = new KeySpline(Easings.easein);
	return spline.get(t);
}

export function easeOut(t){
	return Math.sin(t * Math.PI / 2);
}
export function easeOutStrong(t){
	return (t == 1) ? 1 : 1 - Math.pow(2, - 10 * t);
}
export function easeIn(t){
	return t * t;
}
export function easeInStrong(t){
	return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
}
export function easeOutBounce(pos){
	if ((pos) < (1 / 2.75)) {
		return (7.5625 * pos * pos);
	} else if (pos < (2 / 2.75)) {
		return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
	} else if (pos < (2.5 / 2.75)) {
		return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
	} else {
		return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
	}
}
export function easeInBack(pos){
	var s = 1.70158;
	return (pos) * pos * ((s + 1) * pos - s);
}
export function easeOutBack(pos){
	var s = 1.70158;
	return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
}
export function bounce(t){
	if (t < (1 / 2.75)) {
		return 7.5625 * t * t;
	}
	if (t < (2 / 2.75)) {
		return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
	}
	if (t < (2.5 / 2.75)) {
		return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
	}
	return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
}
export function bouncePast(pos){
	if (pos < (1 / 2.75)) {
		return (7.5625 * pos * pos);
	} else if (pos < (2 / 2.75)) {
		return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
	} else if (pos < (2.5 / 2.75)) {
		return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
	} else {
		return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
	}
}
export function swingTo(pos){
	var s = 1.70158;
	return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
}
export function swingFrom(pos){
	var s = 1.70158;
	return pos * pos * ((s + 1) * pos - s);
}
export function elastic(pos){
	return -1 * Math.pow(4, - 8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
}
export function spring(pos){
	return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
}
export function blink(pos, blinks){
	return Math.round(pos * (blinks || 5)) % 2;
}
export function pulse(pos, pulses){
	return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
}
export function wobble(pos){
	return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
}

export function flicker(pos){
	var pos = pos + (Math.random() - 0.5) / 5;
	return sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
}
export function mirror(pos){
	if (pos < 0.5) return sinusoidal(pos * 2);
	else return sinusoidal(1 - (pos - 0.5) * 2);
}
// accelerating from zero velocity
export function easeInQuad(t){ return t*t }
// decelerating to zero velocity
export function easeOutQuad(t){ return t*(2-t) }
// acceleration until halfway, then deceleration
export function easeInOutQuad(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t }
// accelerating from zero velocity 
export function easeInCubic(t){ return t*t*t }
// decelerating to zero velocity 
export function easeOutCubic(t){ return (--t)*t*t+1 }
// acceleration until halfway, then deceleration 
export function easeInOutCubic(t){ return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }
// accelerating from zero velocity 
export function easeInQuart(t){ return t*t*t*t }
// decelerating to zero velocity 
export function easeOutQuart(t){ return 1-(--t)*t*t*t }
// acceleration until halfway, then deceleration
export function easeInOutQuart(t){ return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }
// accelerating from zero velocity
export function easeInQuint(t){ return t*t*t*t*t }
// decelerating to zero velocity
export function easeOutQuint(t){ return 1+(--t)*t*t*t*t }
// acceleration until halfway, then deceleration 
export function easeInOutQuint(t){ return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }

