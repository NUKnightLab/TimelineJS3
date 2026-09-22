/*	Events
	Base class using native EventTarget for event handling
================================================== */

import TLError from "../core/TLError"

/**
 * Modern Events base class using native EventTarget.
 * Classes extending this get native browser event capabilities with backward-compatible API.
 */
export default class Events extends EventTarget {

    constructor(...args) {
        super();
        // Registered listeners as {type, fn, context, wrapper}, matched by
        // identity so they can be found again for removal
        this._tl_listeners = [];
    }

    /**
     * Add an event listener callback for the given type.
     * @param {string} type
     * @param {function} fn
     * @param {object} [context] - context to bind the callback to
     * @returns { Events } this (the instance upon which the method was called)
     */
    on(type, fn, context) {
        if (!fn) {
            throw new TLError("No callback function provided")
        }

        // Create a wrapper that calls fn with the right context and event format
        const wrapper = (event) => {
            // Extract detail from CustomEvent, maintain backward compatibility
            const eventData = event.detail || event;
            fn.call(context || this, eventData);
        };

        this._tl_listeners.push({ type, fn, context, wrapper });
        super.addEventListener(type, wrapper);
        return this;
    }

    /**
     * Synonym for on(type, fn, context).
     * @param {string} type
     * @param {function} fn
     * @param {object} [context]
     * @returns { Events } this (the instance upon which the method was called)
     */
    addEventListener(type, fn, context) {
        return this.on(type, fn, context)
    }

    /**
     * Return true if this object has any listeners of the given type.
     * @param {string} type
     * @returns {boolean}
     */
    hasEventListeners(type) {
        return this._tl_listeners.some(l => l.type === type);
    }

    /**
     * Remove an event listener for the given type that uses the given
     *     callback and, if one is given, the given context.
     * @param {string} type
     * @param {function} fn
     * @param {object} [context]
     * @returns { Events } this (the instance upon which the method was called)
     */
    removeEventListener(type, fn, context) {
        const i = this._tl_listeners.findIndex(l =>
            l.type === type && l.fn === fn && (!context || l.context === context)
        );

        if (i !== -1) {
            super.removeEventListener(type, this._tl_listeners[i].wrapper);
            this._tl_listeners.splice(i, 1);
        }

        return this;
    }

    /**
     * Synonym for removeEventListener.
     * @param {string} type
     * @param {function} fn
     * @param {object} [context]
     * @returns { Events } this (the instance upon which the method was called)
     */
    off(type, fn, context) {
        return this.removeEventListener(type, fn, context)
    }

    /**
     * Dispatch an event with the given data.
     * @param {string} type
     * @param {object} [data]
     * @returns { Events } this (the instance upon which the method was called)
     */
    fire(type, data) {
        const event = new CustomEvent(type, {
            detail: {
                type: type,
                target: this,
                ...data
            }
        });

        this.dispatchEvent(event);
        return this;
    }

};