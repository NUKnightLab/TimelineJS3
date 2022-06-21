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
	el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
		if (match === name) {
			return '';
		}
		return w;
	}).replace(/^\s+/, '');
}

export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
