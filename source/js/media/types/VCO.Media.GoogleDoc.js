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
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("open\?id\=")) {
			this.media_id = this.data.url.split("open\?id\=")[1];
			if (this.data.url.match("\&authuser\=0")) {
				this.media_id = this.media_id("\&authuser\=0")[0];
			};
		} else if (this.data.url.match("\/d\/")) {
			this.media_id = this.data.url.split("\/d\/")[1];
			if (this.data.url.match("[^\/]*\/")) {
				this.media_id = this.media_id("[^\/]*\/")[0];
			};
		} else {
			this.media_id = "";
		}
		
		// API URL
		api_url = "http://www.googledrive.com/host/" + this.media_id + "/";
		
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
