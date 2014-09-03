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
		// http://open.spotify.com/track/1OT1G66Lt9EpKFWkwK8i9z
		// spotify:track:1OT1G66Lt9EpKFWkwK8i9z
		//this.media_id = this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		
		if (this.data.url.match("open.spotify.com/track/")) {
			// http://open.spotify.com/track/1OT1G66Lt9EpKFWkwK8i9z
			this.media_id = "spotify:track:" + this.data.url.split("open.spotify.com/track/")[1];
		} else if (this.data.url.match("spotify:track:")) {
			// spotify:track:1OT1G66Lt9EpKFWkwK8i9z
			this.media_id = this.data.url;
		} else if (this.data.url.match("/playlist/")) {
			// http://open.spotify.com/user/zachwise/playlist/3KqOUdFJXsEUC0DKudovj1
			var user = this.data.url.split("open.spotify.com/user/")[1].split("/playlist/")[0];
			this.media_id = "spotify:user:" + user + ":playlist:" + this.data.url.split("/playlist/")[1];
			//<iframe src="https://embed.spotify.com/?uri=spotify:user:zachwise:playlist:3KqOUdFJXsEUC0DKudovj1" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
			//<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:5Z7ygHQo02SUrFmcgpwsKW,1x6ACsKV4UdWS2FMuPFUiT,4bi73jCM02fMpkI11Lqmfe" frameborder="0" allowtransparency="true"></iframe>
		} else if (this.data.url.match(":playlist:")) {
			this.media_id = this.data.url;
			//spotify:user:zachwise:playlist:3KqOUdFJXsEUC0DKudovj1
		}
		
		trace(this.media_id);
		
		// API URL
		api_url = "https://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";
		//<iframe src="https://embed.spotify.com/?uri=spotify:track:3wAX3qn53iQUFE84hpfeen" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
		
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
		trace("_updateMediaDisplay Spotify")
		//trace(this._el.content_item.offsetHeight - 80)
		trace(this.options.height);
		trace(this.options.width);
		trace(this._el.content_item.offsetHeight)
		trace(this._el.content_item.offsetWidth)
		
		if (_height > this.options.width) {
			this.player.style.height = this._el.content_item.offsetWidth + 80 + "px";
			this.player.style.width = this.options.width + "px";
		} else {
			this.player.style.width = _height - 80 + "px";
			this.player.style.height = _height + "px";
		}
		
		//this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
		//this._el.content_item.style.width = VCO.Util.ratio.square({h:this._el.content_item.offsetHeight}) - 80 + "px";
		//this.player.style.width = VCO.Util.ratio.square({h:this._el.content_item.offsetHeight}) - 80 + "px";
		//this.player.style.height = this._el.content_item.offsetWidth + 80 + "px";
		//square
	},
	
	
	_stopMedia: function() {
		// Need spotify stop code
		
	}
	
});
