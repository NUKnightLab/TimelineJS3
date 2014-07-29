/*	VCO.Media.Vimeo
================================================== */

VCO.Media.Vimeo = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-vimeo vco-media-shadow", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		
		// API URL
		api_url = "http://player.vimeo.com/video/" + this.media_id + "?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
		
		this.player = VCO.Dom.create("iframe", "", this._el.content_item);
		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
		
	},
	
	_stopMedia: function() {
		
		try {
			this.player.contentWindow.postMessage(JSON.stringify({method: "pause"}), "http://player.vimeo.com");
		}
		catch(err) {
			trace(err);
		}
		
	}
	
});
