/*	TL.Media.Audio
	Produces audio assets.
	Takes a data object and populates a dom object
================================================== */

TL.Media.Audio = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Loading Message
		this.loadingMessage();

        // Create media?
        if(!this.options.background) {
            this.createMedia();
        }

        // After loaded
		this.onLoaded();
	},

  createMedia: function() {
    var self = this,
        audio_class = "tl-media-item tl-media-audio tl-media-shadow";

 		// Link
		if (this.data.link) {
			this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
			this._el.content_link.href 		= this.data.link;
			this._el.content_link.target 	= "_blank";
			this._el.content_item					= TL.Dom.create("audio", audio_class, this._el.content_link);
		} else {
			this._el.content_item					= TL.Dom.create("audio", audio_class, this._el.content);
		}

		this._el.content_item.controls = true;
		this._el.source_item = TL.Dom.create("source", "", this._el.content_item);

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this._el.source_item.src = this.data.url;
		this._el.source_item.type = this._getType(this.data.url, this.data.mediatype.match_str);
		this._el.content_item.innerHTML += "Your browser doesn't support HTML5 audio with " + this._el.source_item.type;
  },

	_updateMediaDisplay: function(layout) {
		if(TL.Browser.firefox) {
			this._el.content_item.style.width = "auto";
		}
	},

	_getType: function(url, reg) {
		var ext = url.match(reg);
		var type = "audio/"
		switch(ext[1]) {
			case "mp3":
				type += "mpeg";
				break;
			case "wav":
				type += "wav";
				break;
			case "m4a":
				type += "mp4";
				break;
			default:
				type = "audio";
				break;
		}
		return type
	}

});
