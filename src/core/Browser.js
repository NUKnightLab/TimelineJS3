/*
	Based on Leaflet Browser
	TL.Browser handles different browser and feature detections for internal  use.
*/

const ie = window && 'ActiveXObject' in window
const ua = (navigator) ? navigator.userAgent.toLowerCase() : null
const doc = (document) ? document.documentElement : null
const webkit = (ua) ? ua.indexOf('webkit') !== -1 : false
const phantomjs = (ua) ? ua.indexOf('phantom') !== -1 : false
const android23 = (ua) ? ua.search('android [23]') !== -1 : false
const mobile = (window) ? typeof window.orientation !== 'undefined' : false
const msPointer = (navigator && window) ? navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent : false
const pointer = (navigator && window) ? (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) : msPointer
const ie3d = (doc) ? ie && 'transition' in doc.style : false
const webkit3d = (window) ? ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23 : false
const gecko3d = (doc) ? 'MozPerspective' in doc.style : false
const opera3d = (doc) ? 'OTransition' in doc.style: false
const opera = (window) ? window.opera : false
let retina = (window) ? 'devicePixelRatio' in window && window.devicePixelRatio > 1 : false

if (!retina && window && 'matchMedia' in window) {
    var matches = window.matchMedia('(min-resolution:144dpi)');
    retina = matches && matches.matches;
}

const touch = (window) ? 
    !window.L_NO_TOUCH && 
    !phantomjs && 
    (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) : false

	export {
		ie,
		ua,
		// ie9: Boolean(ie && ua.match(/MSIE 9/i)),
		// ielt9: ie && !document.addEventListener,
		webkit,
		//gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		// firefox: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		// android: ua.indexOf('android') !== -1,
		android23,
		// chrome: ua.indexOf('chrome') !== -1,
		// edge: ua.indexOf('edge/') !== -1,
		ie3d,
		webkit3d,
		gecko3d,
		opera3d,
		// any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,

		mobile,
		// mobileWebkit: mobile && webkit,
		// mobileWebkit3d: mobile && webkit3d,
		// mobileOpera: mobile && window.opera,

		// touch: !! touch,
		// msPointer: !! msPointer,
		// pointer: !! pointer,

		// retina: !! retina,
		// orientation: function() {
		// 	var w = window.innerWidth,
		// 		h = window.innerHeight,
		// 		_orientation = "portrait";

		// 	if (w > h) {
		// 		_orientation = "landscape";
		// 	}
		// 	if (Math.abs(window.orientation) == 90) {
		// 		//_orientation = "landscape";
		// 	}
		// 	trace(_orientation);
		// 	return _orientation;
}
