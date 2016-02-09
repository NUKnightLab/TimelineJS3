/*	TL.Media.SoundCloud
================================================== */

TL.Media.SoundCloud = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
				
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-soundcloud tl-media-shadow", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = "http://soundcloud.com/oembed?url=" + this.media_id + "&format=js&callback=?"
		
		// API Call
		TL.getJSON(api_url, function(d) {
			self.createMedia(d);
		});
		
	},
	
	createMedia: function(d) {
		this._el.content_item.innerHTML = d.html;
		
		// After Loaded
		this.onLoaded();
	}
	
});
