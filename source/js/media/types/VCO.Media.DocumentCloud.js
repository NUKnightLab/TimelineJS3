/*	VCO.Media.DocumentCloud
================================================== */

VCO.Media.DocumentCloud = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;
		
		// Loading Message 
		this.loadingMessage();
				
		// Create Dom elements
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-documentcloud vco-media-shadow", this._el.content);
		this._el.content_item.id = VCO.Util.unique_ID(7)
		
		// Check url
		if(this.data.url.match(/\.html$/)) {
		    this.data.url = this._transformURL(this.data.url);
		} else if(!(this.data.url.match(/.(json|js)$/))) {
		    trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX");
		}
		
		// Load viewer API
        VCO.Load.js([
                '//s3.documentcloud.org/viewer/loader.js', 
                '//s3.amazonaws.com/s3.documentcloud.org/viewer/viewer.js'],
            function() {	
	            self.createMedia();
			}
		);	
	},
	
	// Viewer API needs js, not html
	_transformURL: function(url) {
        return url.replace(/(.*)\.html$/, '$1.js')
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
        this._el.content_item.style.height = this.options.height + "px";
		//this._el.content_item.style.width = this.options.width + "px";
	},
		
	createMedia: function() {		
		// DocumentCloud API call	
		DV.load(this.data.url, {
		    container: '#'+this._el.content_item.id, 
		    showSidebar: false
		});
		this.onLoaded();
	},
	

	
	/*	Events
	================================================== */


	
});
