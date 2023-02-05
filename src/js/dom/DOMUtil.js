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

//el.classList.contains(name)
//To check if an element contains a class
function hasClass(el, name) {
    return (el.className.length > 0) &&
        new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
}

/**
 * @TODO - find where addClass() is referenced and replace with el.classList.add(name)
 * 
 * src/js/slider/Slide.js - line: 324*, 327*, 334*
 * src/js/slider/StorySlider.js - line: 397*
 * src/js/timeline/Timeline.js - line: 195 (ask about this line) 
 *                               this._el.container.class... - 1 test fail new error
 *                               this._el.class... - 2 test fail, TypeError: Cannot read properties of undefined (reading 'add')
 *                               , 201*, 205*
 * src/js/timenav/TimeMarker.js - line: 184*
 * website/static/js/main.js - line: 207 (ask about this line), 210 (ask about this line)
 */
export function addClass(el, name) {
    if (!hasClass(el, name)) {
        el.className += (el.className ? ' ' : '') + name;
    }
}

//el.classList.remove(name)
//removes class from element
export function removeClass(el, name) {
    el.className = el.className.replace(/(\S+)\s*/g, function(w, match) {
        if (match === name) {
            return '';
        }
        return w;
    }).replace(/^\s+/, '');
}