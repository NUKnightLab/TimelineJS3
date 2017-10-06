/*	TL.DomEvent
	Inspired by Leaflet
	DomEvent contains functions for working with DOM events.
================================================== */
// TODO stamp
import { Util } from '../core/TL.Util.js'
import { Browser } from '../core/TL.Browser.js'

var DomEvent = (function() {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	function addListener(/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = Util.stamp()(fn),
			key = '_tl_' + type + id;

		if (obj[key]) {
			return;
		}

		var handler = function (e) {
			return fn.call(context || obj, e || TL.DomEvent._getEvent());
		};

		if (Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		} else if ('addEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				var originalHandler = handler,
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
				handler = function (e) {
					if (!TL.DomEvent._checkMouse(obj, e)) {
						return;
					}
					return originalHandler(e);
				};
				obj.addEventListener(newType, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}
		} else if ('attachEvent' in obj) {
			obj.attachEvent("on" + type, handler);
		}

		obj[key] = handler;
	}

	function removeListener(/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = Util.stamp()(fn),
			key = '_tl_' + type + id,
			handler = obj[key];

		if (!handler) {
			return;
		}

		if (Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else if ('removeEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null;
	}

	function _checkMouse(el, e) {
		var related = e.relatedTarget;

		if (!related) {
			return true;
		}

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}

		return (related !== el);
	}

	/*jshint noarg:false */ // evil magic for IE
	function _getEvent() {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	}
	/*jshint noarg:false */

	function stopPropagation(/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}

	// TODO TL.Draggable.START
	function disableClickPropagation(/*HTMLElement*/ el) {
		TL.DomEvent.addListener(el, TL.Draggable.START, TL.DomEvent.stopPropagation);
		TL.DomEvent.addListener(el, 'click', TL.DomEvent.stopPropagation);
		TL.DomEvent.addListener(el, 'dblclick', TL.DomEvent.stopPropagation);
	}

	function preventDefault(/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}

	function stop(e) {
		TL.DomEvent.preventDefault(e);
		TL.DomEvent.stopPropagation(e);
	}


	function getWheelDelta(e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	}
    return {
      addListener,
      removeListener,
      disableClickPropagation,
      preventDefault,
      stop,
      getWheelDelta
    }
})();

export {
  DomEvent
}

