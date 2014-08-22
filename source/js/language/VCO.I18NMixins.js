/*  VCO.I18NMixins
    assumes that its class has an options object with a VCO.Language instance    
================================================== */
VCO.I18NMixins = {
    _: function(msg) {
        if (this.options && this.options.language) {
            return this.options.language._(msg);
        }
        trace("Expected a language option");
        return VCO.Language.default._(msg);
    }
}
