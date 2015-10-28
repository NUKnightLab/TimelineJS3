/*	TL.Media.Flickr

================================================== */

TL.Media.Flickr = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		try {
		    // Get Media ID
		    this.establishMediaID();

            // API URL
            api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";

            // API Call
            TL.getJSON(api_url, function(d) {
                if (d.stat == "ok") {
                    self.sizes = d.sizes.size; // store sizes info

                    if(!self.options.background) {
                        self.createMedia();
                    }

                    self.onLoaded();
                } else {
                    self.loadErrorDisplay(self._("flickr_notfound_err"));
                }
            });
		} catch(e) {
		    self.loadErrorDisplay(self._(e.message_key));
		}
	},

	establishMediaID: function() {
		if (this.data.url.match(/flic.kr\/.+/i)) {
			var encoded = this.data.url.split('/').slice(-1)[0];
			this.media_id = TL.Util.base58.decode(encoded);
		} else {
			var marker = 'flickr.com/photos/';
			var idx = this.data.url.indexOf(marker);
			if (idx == -1) { throw new TL.Error("flickr_invalidurl_err"); }
			var pos = idx + marker.length;
			this.media_id = this.data.url.substr(pos).split("/")[1];
		}
	},

	createMedia: function() {
	    var self = this;

		// Link
		this._el.content_link = TL.Dom.create("a", "", this._el.content);
		this._el.content_link.href = this.data.url;
		this._el.content_link.target = "_blank";

		// Photo
		this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image tl-media-flickr tl-media-shadow", this._el.content_link);

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		// Set Image Source
		this._el.content_item.src = this.getImageURL(this.options.width, this.options.height);
	},

    getImageURL: function(w, h) {
        var best_size 	= this.size_label(h),
            source = this.sizes[this.sizes.length - 2].source;

		for(var i = 0; i < this.sizes.length; i++) {
			if (this.sizes[i].label == best_size) {
				source = this.sizes[i].source;
			}
		}

		return source;
    },

	_getMeta: function() {
		var self = this,
		api_url;

		// API URL
		api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";

		// API Call
		TL.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + self.data.url + "' target='_blank'>" + d.photo.owner.realname + "</a>";
			self.data.caption_alternate = d.photo.title._content + " " + d.photo.description._content;
			self.updateMeta();
		});
	},

	size_label: function(s) {
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
