/*	TL.Media.Spotify
================================================== */

TL.Media.Spotify = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-spotify", this._el.content);

		// Get Media ID
		if (this.data.url.match(/^spotify:track/) || this.data.url.match(/^spotify:user:.+:playlist:/)) {
			this.media_id = this.data.url;
		}
		if (this.data.url.match(/spotify.com\/track\/(.+)/)) {
			this.media_id = "spotify:track:" + this.data.url.match(/spotify.com\/track\/(.+)/)[1];
		} else if (this.data.url.match(/spotify.com\/user\/(.+?)\/playlist\/(.+)/)) {
			var user = this.data.url.match(/spotify.com\/user\/(.+?)\/playlist\/(.+)/)[1];
			var playlist = this.data.url.match(/spotify.com\/user\/(.+?)\/playlist\/(.+)/)[2];
			this.media_id = "spotify:user:" + user + ":playlist:" + playlist;
		}

		if (this.media_id) {
			// API URL
			api_url = "https://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";

			this.player = TL.Dom.create("iframe", "tl-media-shadow", this._el.content_item);
			this.player.width 		= "100%";
			this.player.height 		= "100%";
			this.player.frameBorder = "0";
			this.player.src 		= api_url;

			// After Loaded
			this.onLoaded();

		} else {
				this.loadErrorDisplay(this._('spotify_invalid_url'));
		}
	},

	// Update Media Display

	_updateMediaDisplay: function(l) {
		var _height = this.options.height,
			_player_height = 0,
			_player_width = 0;

		if (TL.Browser.mobile) {
			_height = (this.options.height/2);
		} else {
			_height = this.options.height - this.options.credit_height - this.options.caption_height - 30;
		}

		this._el.content_item.style.maxHeight = "none";
		trace(_height);
		trace(this.options.width)
		if (_height > this.options.width) {
			trace("height is greater")
			_player_height = this.options.width + 80 + "px";
			_player_width = this.options.width + "px";
		} else {
			trace("width is greater")
			trace(this.options.width)
			_player_height = _height + "px";
			_player_width = _height - 80 + "px";
		}


		this.player.style.width = _player_width;
		this.player.style.height = _player_height;

		if (this._el.credit) {
			this._el.credit.style.width		= _player_width;
		}
		if (this._el.caption) {
			this._el.caption.style.width		= _player_width;
		}
	},


	_stopMedia: function() {
		// Need spotify stop code

	}

});
