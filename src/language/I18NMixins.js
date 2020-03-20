/*  I18NMixins
    assumes that its class has an options object with a Language instance    
================================================== */
import { trace } from "../core/Util"
import { fallback } from "../language/Language"
const I18NMixins = {
    getLanguage: function() {
        if (this.options && this.options.language) {
            if (typeof this.options.language == 'object') {
                return this.options.language;
            } else {
                trace(
                    `I18NMixins.getLanguage: this.options.language should be object, but is ${typeof this
                        .options.language}`
                );
            }
        }
        trace("I18NMixins.getLanguage: Expected a language option");
        return fallback;
    },

    _: function(msg) {
        return this.getLanguage()._(msg);
    }
}

export { I18NMixins }