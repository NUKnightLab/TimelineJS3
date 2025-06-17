/*	DOMEvent
	Inspired by Leaflet 
	DomEvent contains functions for working with DOM events.
================================================== */
import { Draggable } from "../ui/Draggable"
import { touch as BROWSER_TOUCH } from "../core/Browser";
import { stamp } from "../core/Util"

const DOMEvent = {
	/* Modern event handling - simplified for modern browsers */
	addListener(obj, type, fn, context) {
		const id = stamp(fn);
		const key = `_tl_${type}${id}`;

		if (obj[key]) {
			return;
		}

		const handler = (e) => {
			return fn.call(context || obj, e);
		};

		if (BROWSER_TOUCH && type === "dblclick" && this.addDoubleTapListener) {
            this.addDoubleTapListener(obj, handler, id);
        } else {
            if (type === "mousewheel") {
                // Modern browsers support 'wheel' event
                obj.addEventListener("wheel", handler, false);
                // Fallback for older browsers
                obj.addEventListener("DOMMouseScroll", handler, false);
                obj.addEventListener(type, handler, false);
            } else if (type === "mouseenter" || type === "mouseleave") {
                const originalHandler = handler;
                const newType = type === "mouseenter" ? "mouseover" : "mouseout";
                const mouseHandler = (e) => {
                    if (!DOMEvent._checkMouse(obj, e)) {
                        return;
                    }
                    return originalHandler(e);
                };
                obj.addEventListener(newType, mouseHandler, false);
            } else {
                obj.addEventListener(type, handler, false);
            }
        }

		obj[key] = handler;
	},

	removeListener(obj, type, fn) {
		const id = stamp(fn);
		const key = `_tl_${type}${id}`;
		const handler = obj[key];

		if (!handler) {
			return;
		}

		if (BROWSER_TOUCH && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else {
			if (type === 'mousewheel') {
				obj.removeEventListener('wheel', handler, false);
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		}
		obj[key] = null;
	},

	_checkMouse: function (el, e) {
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
	},

	// Modern browsers always pass event as parameter, no need for IE compatibility
	_getEvent() {
		// This method is kept for compatibility but is no longer needed
		// Modern event handlers always receive the event as a parameter
		return null;
	},

	stopPropagation(e) {
		e.stopPropagation();
	},
	
	disableClickPropagation: function (/*HTMLElement*/ el) {
		DOMEvent.addListener(el, Draggable.START, DOMEvent.stopPropagation);
		DOMEvent.addListener(el, "click", DOMEvent.stopPropagation);
		DOMEvent.addListener(el, "dblclick", DOMEvent.stopPropagation);
	},

	preventDefault(e) {
		e.preventDefault();
	},

	stop: function (e) {
		DOMEvent.preventDefault(e);
		DOMEvent.stopPropagation(e);
	},

	getWheelDelta(e) {
		// Modern browsers use deltaY from wheel events
		if (e.deltaY !== undefined) {
			return -e.deltaY / 100; // Normalize to similar scale as old wheelDelta
		}
		// Fallback for older browsers
		if (e.wheelDelta) {
			return e.wheelDelta / 120;
		}
		if (e.detail) {
			return -e.detail / 3;
		}
		return 0;
	}
};

export { DOMEvent }
