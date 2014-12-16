/*  VCO.Media.Blockquote
================================================== */

VCO.Media.Map = VCO.Media.extend({
    
    includes: [VCO.Events],
    
    _API_KEY: "AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
    /*  Load the media
    ================================================== */
    _buildURL: function(url) {
        var match = url.
        var match = url.match(/(http.+\/maps\/)(search|place|directions|view)\/(.+)/)
        if (match && match[2] == 'place') {
            parts = [match[1],'embed/v1',match[2]];
            var new_url = parts.join('/');

        }
        

        // streetview has different setup?
    },
    _loadMedia: function() {
        
        // Loading Message
        this.loadingMessage();
        
        // Create Dom element
        this._el.content_item   = VCO.Dom.create("div", "vco-media-item vco-media-map", this._el.content);
        this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";
        
        // Get Media ID (why?)
        this.media_id = this.data.url;
        
        // API Call
        
        this.mapframe = VCO.Dom.create("iframe", "", this._el.content_item);
        window.stash = this;
        this.mapframe.width       = "100%";
        this.mapframe.height      = "100%";
        this.mapframe.frameBorder = "0";
        this.mapframe.src         = VCO.Util.makeGoogleMapsEmbedURL(this.data.url, this.options.api_key_googlemaps);
        
        // After Loaded
        this.onLoaded();
    },
    
    updateMediaDisplay: function() {
        
    },
    
    _updateMediaDisplay: function() {
        
    }

    
});
