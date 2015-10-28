/*	TL.Media.Flickr

================================================== */

TL.Media.Imgur = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		try {
		    this.media_id = this.data.url.split('/').slice(-1)[0];

            if(!this.options.background) {
                this.createMedia();
            }
            
			// After Loaded
			this.onLoaded();

		} catch(e) {
		    this.loadErrorDisplay(self._("imgur_invalidurl_err"));
		}
	},
		
	createMedia: function() {
	    var self = this;
	    
		// Link
		this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";

		// Photo
		this._el.content_item	= TL.Dom.create("img", "tl-media-item tl-media-image tl-media-imgur tl-media-shadow", this._el.content_link);

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
	
        this._el.content_item.src			= this.getImageURL();
	},
	
	getImageURL: function(w, h) {
	    return 'https://i.imgur.com/' + this.media_id + '.png';	
	}
	
});
