/*  TL.I18NMixins
    assumes that its class has an options object with a TL.Language instance    
================================================== */
TL.I18NMixins = {
    getLanguage: function() {
        if (this.options && this.options.language) {
            return this.options.language;
        }
        trace("Expected a language option");
        return TL.Language.fallback;
    },

    _: function(msg) {
        return this.getLanguage()._(msg);
    }
}
