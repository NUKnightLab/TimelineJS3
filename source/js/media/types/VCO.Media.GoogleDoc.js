/*	VCO.Media.GoogleDoc

================================================== */

VCO.Media.GoogleDoc = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = this.media_id;
		
		// API Call
		if (this.media_id.match(/docs.google.com/i)) {
			this._el.content_item.innerHTML	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + this.media_id + "&amp;embedded=true'></iframe>";
		} else {
			this._el.content_item.innerHTML	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "http://docs.google.com/viewer?url=" + this.media_id + "&amp;embedded=true'></iframe>";
		}
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}

	
});
