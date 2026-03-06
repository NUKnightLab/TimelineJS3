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
        // Store context-bound listeners for removal
        this._tl_bound_listeners = new Map();
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

        // Store the mapping so we can remove it later
        const key = `${type}:${fn}:${context || 'default'}`;
        if (!this._tl_bound_listeners.has(key)) {
            this._tl_bound_listeners.set(key, wrapper);
        }

        super.addEventListener(type, this._tl_bound_listeners.get(key));
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
     * Remove event listeners for the given type with the given callback and context.
     * @param {string} type
     * @param {function} fn
     * @param {object} [context]
     * @returns { Events } this (the instance upon which the method was called)
     */
    removeEventListener(type, fn, context) {
        const key = `${type}:${fn}:${context || 'default'}`;
        const wrapper = this._tl_bound_listeners.get(key);

        if (wrapper) {
            super.removeEventListener(type, wrapper);
            this._tl_bound_listeners.delete(key);
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