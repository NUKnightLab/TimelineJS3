/*	VCO.Media.Vine

================================================== */

VCO.Media.Vine = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-vine vco-media-shadow", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url.split("vine.co/v/")[1];
		
		// API URL
		api_url = "https://vine.co/v/" + this.media_id + "/embed/simple";
		
		// API Call
		this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>"		
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		var size = VCO.Util.ratio.square({w:this._el.content_item.offsetWidth , h:this.options.height});
		this._el.content_item.style.height = size.h + "px";
	}
	
});
