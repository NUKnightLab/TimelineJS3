/*	VCO.Media.Instagram

================================================== */

VCO.Media.Instagram = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		// Get Media ID
		this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];
		
		this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-instagram vco-media-shadow", this._el.content);
		this._el.content_item.src			= "http://instagr.am/p/" + this.media_id + "/media/?size=" + this.sizes(this._el.content.offsetWidth);
		
		
		this.onLoaded();
		
	},
	
	sizes: function(s) {
		var _size = "";
		if (s <= 150) {
			_size = "t";
		} else if (s <= 306) {
			_size = "m";
		} else {
			_size = "l";
		}
		
		return _size;
	}
	
	
	
});
