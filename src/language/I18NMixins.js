/*  I18NMixins
    assumes that its class has an options object with a Language instance    
================================================== */
import { trace } from "../core/Util"
import { fallback } from "../language/Language"
const I18NMixins = {
    getLanguage: function() {
        if (this.options && this.options.language) {
            return this.options.language;
        }
        trace("Expected a language option");
        return fallback;
    },

    _: function(msg) {
        return this.getLanguage()._(msg);
    }
}

export { I18NMixins }