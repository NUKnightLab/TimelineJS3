/*	VCO.Media.Website
================================================== */

VCO.Media.Website = VCO.Media.extend({
	
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
		this._el.content_item.innerHTML = "<a target='_blank' href='" + this.media_id + "'> " + this.media_id + "</a>";
		
		// After Loaded
		this.onLoaded();
		
	},
	
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
	
	
});
