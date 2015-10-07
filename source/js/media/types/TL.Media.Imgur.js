/*	TL.Media.Flickr

================================================== */

TL.Media.Imgur = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Loading Message
		this.loadingMessage();

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

		try {
			var image_id = this.data.url.split('/').slice(-1);
			// Set Image Source
			this._el.content_item.src			= 'https://i.imgur.com/' + image_id + '.png';

			// After Loaded
			this.onLoaded();

		} catch(e) {
		    self.loadErrorDisplay(self._(e.message_key));
		}
	}
});
