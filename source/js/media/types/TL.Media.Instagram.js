/*	TL.Media.Instagram

================================================== */

TL.Media.Instagram = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {		
		// Get Media ID
		this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];
		
		if(!this.options.background) {
		    this.createMedia();
		}
						
		// After Loaded
		this.onLoaded();
	},

    createMedia: function() {
        var self = this;
        
		// Link
		this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";
		
		// Photo
		this._el.content_item				= TL.Dom.create("img", "tl-media-item tl-media-image tl-media-instagram tl-media-shadow", this._el.content_link);
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

	    this._el.content_item.src = this.getImageURL(this._el.content.offsetWidth);
    },

    getImageURL: function(w, h) {
        return "http://instagr.am/p/" + this.media_id + "/media/?size=" + this.sizes(w);
    },
    	
	_getMeta: function() {
		var self = this,
		    api_url;
		
		// API URL
		api_url = "http://api.instagram.com/oembed?url=http://instagr.am/p/" + this.media_id + "&callback=?";
		
		// API Call
		TL.getJSON(api_url, function(d) {
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
