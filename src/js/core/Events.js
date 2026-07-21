/*	Events
	adds custom events functionality to TL classes
================================================== */

import { mergeData, trace } from "../core/Util"
import TLError from "../core/TLError"

export default class Events {

    /**
     * Add an event listener callback for the given type.
     * @param {string} type 
     * @param {function} fn 
     * @param {object} [context] 
     * @returns { Events } this (the instance upon which the method was called)
     */
    on(type, fn, context) {
        if (!fn) {
            throw new TLError("No callback function provided")
        }
        var events = this._tl_events = this._tl_events || {};
        events[type] = events[type] || [];
        events[type].push({
            action: fn,
            context: context || this
        });
        return this;
    }

    /**
     * Synonym for on(type, fn, context). It would be great to determine 
     *     that this is obsolete, but that wasn't clear.
     * @param {string} type
     * @param {function} fn
     * @param {object} [context]
     * @returns { Events } this (the instance upon which the method was called)
     */
    addEventListener( /*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
        return this.on(type, fn, context)
    }

    /**
     * Return true if this object has any listeners of the given type.
     * @param {string} type 
     * @returns {boolean}
     */
    hasEventListeners(type) {
        var k = '_tl_events';
        return (k in this) && (type in this[k]) && (this[k][type].length > 0);
    }

    /**
     * Remove any event listeners for the given type that use the given 
     *     callback and have the given context.
     * @param {string} type 
     * @param {function} fn 
     * @param {object} context 
     * @returns { Events } this (the instance upon which the method was called)
     */
    removeEventListener( /*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
        if (!this.hasEventListeners(type)) {
            return this;
        }

        for (var i = 0, events = this._tl_events, len = events[type].length; i < len; i++) {
            if (
                (events[type][i].action === fn) &&
                (!context || (events[type][i].context === context))
            ) {
                events[type].splice(i, 1);
                return this;
            }
        }
        return this;
    }

    /**
     * Synonym for removeEventListener. Is this really needed? While 'off' is opposite of 'on',
     *     it doesn't actually read as 'remove' unless you know that.
     * @param {string} type
     * @param {function} fn
     * @param {object} context
     * @returns { Events } this (the instance upon which the method was called)
     */
    off(type, fn, context) {
        return this.removeEventListener(type, fn, context)
    }

    /**
     * Activate (execute) all registered callback functions for the given
     *     type, passing the given data, if any.
     * @param {string} type 
     * @param {object} [data] 
     * @returns { Events } this (the instance upon which the method was called)
     */
    fire(type, data) {
        if (!this.hasEventListeners(type)) {
            return this;
        }

        var event = mergeData({
            type: type,
            target: this
        }, data);

        var listeners = this._tl_events[type].slice();

        for (var i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i].action) {
                listeners[i].action.call(listeners[i].context || this, event);
            } else {
                trace(`no action defined for ${type} listener`)
            }
        }

        return this;
    }

};