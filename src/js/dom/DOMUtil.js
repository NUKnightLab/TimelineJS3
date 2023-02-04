/*	DomUtil
	Inspired by Leaflet
	DomUtil contains various utility functions for working with DOM
	Why are they in DOMUtil and not DOM? 
================================================== */

//Run this command - git clone https://github.com/NUKnightLab/TimelineJS3.git
//Run this command - npm install
//Run this command - npm start
//Run this command to simulate website and look at your chnages - npm run disttest
//npm test will test, do every once in while to check that havent messed anything up

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