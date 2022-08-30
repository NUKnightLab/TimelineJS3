/*  I18NMixins
    assumes that its class has an attribute `language` with a Language instance    
================================================== */
import { trace } from "../core/Util"
import { fallback } from "../language/Language"
class I18NMixins {
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

    _(msg, context) {
        return this.getLanguage()._(msg, context);
    }
}

export { I18NMixins }