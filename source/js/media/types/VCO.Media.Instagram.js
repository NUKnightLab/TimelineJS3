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
		this.loadingMessage();
		
		// Get Media ID
		this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];
		
		// Link
		this._el.content_link 				= VCO.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";
		
		// Photo
		this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-instagram vco-media-shadow", this._el.content_link);
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
		
		// Set source
		this._el.content_item.src			= "http://instagr.am/p/" + this.media_id + "/media/?size=" + this.sizes(this._el.content.offsetWidth);
		
		// API URL
		api_url = "http://api.instagram.com/oembed?url=http://instagr.am/p/" + this.media_id + "&callback=?";
		
		// After Loaded
		this.onLoaded();
	},
	
	_getMeta: function() {
		var self = this,
		api_url;
		
		// API URL
		api_url = "http://api.instagram.com/oembed?url=http://instagr.am/p/" + this.media_id + "&callback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + d.author_url + "' target='_blank'>" + d.author_name + "</a>";
			self.data.caption_alternate = d.title;
			self.updateMeta();
		});
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
