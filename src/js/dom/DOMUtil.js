/*	DomUtil
	Inspired by Leaflet
	DomUtil contains various utility functions for working with DOM
	Why are they in DOMUtil and not DOM? 
================================================== */

function hasClass(el, name) {
    return (el.className.length > 0) &&
        new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
}

export function addClass(el, name) {
    if (!hasClass(el, name)) {
        el.className += (el.className ? ' ' : '') + name;
    }
}

export function removeClass(el, name) {
    el.className = el.className.replace(/(\S+)\s*/g, function(w, match) {
        if (match === name) {
            return '';
        }
        return w;
    }).replace(/^\s+/, '');
}