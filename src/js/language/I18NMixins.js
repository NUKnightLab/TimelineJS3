/*  I18NMixins
    Base class providing internationalization support
================================================== */
import { trace } from "../core/Util"
import { fallback } from "../language/Language"
import Events from "../core/Events"

/**
 * Base class that combines Events with I18N functionality.
 * Classes can extend this to get both event handling and internationalization.
 */
class I18NMixins extends Events {
    constructor(...args) {
        super(...args);
        this.language = null;
    }

    setLanguage(language) {
        this.language = language;
    }

    getLanguage() {
        if (this.language) {
            if (typeof this.language == 'object') {
                return this.language;
            } else {
                trace(
                    `I18NMixins.getLanguage: this.language should be object, but is ${typeof this
                        .language}`
                );
            }
        }

        // trace("I18NMixins.getLanguage: Expected a language option");
        return fallback;
    }

    /**
     * Look up a localized version of a standard message using the Language instance
     * that was previously set with {@link setLanguage}.
     *
     * @see {@link Language#_}
     * @param {string} msg - a message key
     * @param {Object} [context] - a dictionary with string keys appropriate to message `k`
     *      and string values which will be interpolated into the message.
     * @returns {string} - a localized string appropriate to the message key
     */
    _(msg, context) {
        return this.getLanguage()._(msg, context);
    }
}

export { I18NMixins }