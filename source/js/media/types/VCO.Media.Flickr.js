/*	VCO.Media.Flickr

================================================== */

VCO.Media.Flickr = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Link
		this._el.content_link 				= VCO.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";
		
		// Photo
		this._el.content_item	= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-flickr vco-media-shadow", this._el.content_link);
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
		
		// Get Media ID
		this.establishMediaID();
		
		// API URL
		api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			if (d.stat == "ok") {
				self.createMedia(d);
			} else {
				self.loadErrorDisplay("Photo not found or private.");
			}
		});
		
	},

	establishMediaID: function() {
		var marker = 'flickr.com/photos/';
		var idx = this.data.url.indexOf(marker);
		if (idx == -1) { throw "Invalid Flickr URL"; }
		var pos = idx + marker.length;
		this.media_id = this.data.url.substr(pos).split("/")[1];
	},
	
	createMedia: function(d) {
		trace(d);
		var best_size 	= this.sizes(this.options.height),
			size 		= d.sizes.size[d.sizes.size.length - 2].source;
			self = this;
		
		for(var i = 0; i < d.sizes.size.length; i++) {
			if (d.sizes.size[i].label == best_size) {
				size = d.sizes.size[i].source;
			}
		}
			
		// Set Image Source
		this._el.content_item.src			= size;
		
		// After Loaded
		this.onLoaded();
	},
	
	_getMeta: function() {
		var self = this,
		api_url;
		
		// API URL
		api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + self.data.url + "' target='_blank'>" + d.photo.owner.realname + "</a>";
			self.data.caption_alternate = d.photo.title._content + " " + d.photo.description._content;
			self.updateMeta();
		});
	},
	
	sizes: function(s) {
		var _size = "";
		
		if (s <= 75) {
			if (s <= 0) {
				_size = "Large";
			} else {
				_size = "Thumbnail";
			}
		} else if (s <= 180) {
			_size = "Small";
		} else if (s <= 240) {
			_size = "Small 320";
		} else if (s <= 375) {
			_size = "Medium";
		} else if (s <= 480) {
			_size = "Medium 640";
		} else if (s <= 600) {
			_size = "Large";
		} else {
			_size = "Large";
		}
		
		return _size;
	}
	
	
	
});
