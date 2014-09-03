/*	VCO.Media.Spotify
================================================== */

VCO.Media.Spotify = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-spotify", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("open.spotify.com/track/")) {
			this.media_id = "spotify:track:" + this.data.url.split("open.spotify.com/track/")[1];
		} else if (this.data.url.match("spotify:track:")) {
			this.media_id = this.data.url;
		} else if (this.data.url.match("/playlist/")) {
			var user = this.data.url.split("open.spotify.com/user/")[1].split("/playlist/")[0];
			this.media_id = "spotify:user:" + user + ":playlist:" + this.data.url.split("/playlist/")[1];
		} else if (this.data.url.match(":playlist:")) {
			this.media_id = this.data.url;
		}
		
		// API URL
		api_url = "https://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";
				
		this.player = VCO.Dom.create("iframe", "vco-media-shadow", this._el.content_item);
		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	
	_updateMediaDisplay: function(l) {
		var _height = this.options.height;
		if (!VCO.Browser.mobile) {
			_height = (this.options.height/2);
		}
		
		if (_height > this.options.width) {
			this.player.style.height = this._el.content_item.offsetWidth + 80 + "px";
			this.player.style.width = this.options.width + "px";
		} else {
			this.player.style.width = _height - 80 + "px";
			this.player.style.height = _height + "px";
		}
	},
	
	
	_stopMedia: function() {
		// Need spotify stop code
		
	}
	
});
