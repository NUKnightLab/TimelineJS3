/*	VCO.Media.Blockquote
================================================== */

VCO.Media.Blockquote = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-blockquote", this._el.content);
		this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API Call
		this._el.content_item.innerHTML = this.media_id;
		
		// After Loaded
		this.onLoaded();
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}

	
});
