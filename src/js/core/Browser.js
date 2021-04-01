/*
	Based on Leaflet Browser
*/

export const ua = navigator ? navigator.userAgent.toLowerCase() : 'no-user-agent-specified';

const doc = document ? document.documentElement : null;
const phantomjs = ua ? ua.indexOf("phantom") !== -1 : false;


export const ie = window && 'ActiveXObject' in window

export const ie9 = Boolean(ie && ua.match(/MSIE 9/i))
export const ielt9 = ie && document && !document.addEventListener

export const webkit = ua.indexOf('webkit') !== -1
export const android = ua.indexOf('android') !== -1

export const android23 = ua.search('android [23]') !== -1
export const mobile = (window) ? typeof window.orientation !== 'undefined' : false
export const msPointer = (navigator && window) ? navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent : false
export const pointer = (navigator && window) ? (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) : msPointer

export const opera = window ? window.opera : false;

export const gecko = ua.indexOf("gecko") !== -1 && !webkit && !opera && !ie;
export const firefox = ua.indexOf("gecko") !== -1 && !webkit && !opera && !ie;
export const chrome = ua.indexOf("chrome") !== -1;
export const edge = ua.indexOf("edge/") !== -1;

export const ie3d = (doc) ? ie && 'transition' in doc.style : false
export const webkit3d = (window) ? ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23 : false
export const gecko3d = (doc) ? 'MozPerspective' in doc.style : false
export const opera3d = (doc) ? 'OTransition' in doc.style : false

export const any3d = window && !window.L_DISABLE_3D &&
    (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs

export const mobileWebkit = mobile && webkit
export const mobileWebkit3d = mobile && webkit3d
export const mobileOpera = mobile && window.opera

export let retina = (window) ? 'devicePixelRatio' in window && window.devicePixelRatio > 1 : false

if (!retina && window && 'matchMedia' in window) {
    let media_matches = window.matchMedia('(min-resolution:144dpi)');
    retina = media_matches && media_matches.matches;
}

export const touch = window &&
    !window.L_NO_TOUCH &&
    !phantomjs &&
    (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch))


export function orientation() {
    var w = window.innerWidth,
        h = window.innerHeight,
        _orientation = "portrait";

    if (w > h) {
        _orientation = "landscape";
    }
    if (Math.abs(window.orientation) == 90) {
        //_orientation = "landscape";
    }
    return _orientation;
}