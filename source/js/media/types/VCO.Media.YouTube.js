/*	VCO.Media.YouTube
================================================== */

VCO.Media.YouTube = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this,
			url_vars;
		
		// Loading Message 
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		this.youtube_loaded = false;
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-youtube vco-media-shadow", this._el.content);
		this._el.content_item.id = VCO.Util.unique_ID(7)
		
		// URL Vars
		url_vars = VCO.Util.getUrlVars(this.data.url);
		
		// Get Media ID
		this.media_id = {};
		
		if (this.data.url.match('v=')) {
			this.media_id.id	= url_vars["v"];
		} else if (this.data.url.match('\/embed\/')) {
			this.media_id.id	= this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		} else if (this.data.url.match(/v\/|v=|youtu\.be\//)){
			this.media_id.id	= this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
		} else {
			trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
		}
		
		this.media_id.start		= url_vars["t"];
		this.media_id.hd		= url_vars["hd"];
		
		
		// API Call
		VCO.Load.js('https://www.youtube.com/player_api', function() {
			self.createMedia();
		});
		
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	},
	
	_stopMedia: function() {
		if (this.youtube_loaded) {
			try {
				this.player.pauseVideo();
			}
			catch(err) {
				trace(err);
			}
			
		}
	},
	
	createMedia: function() {
		var self = this;
		
		// Determine Start of Media
		if (typeof(this.media_id.start) != 'undefined') {
			
			var vidstart			= this.media_id.start.toString(),
				vid_start_minutes	= 0,
				vid_start_seconds	= 0;
				
			if (vidstart.match('m')) {
				vid_start_minutes = parseInt(vidstart.split("m")[0], 10);
				vid_start_seconds = parseInt(vidstart.split("m")[1].split("s")[0], 10);
				this.media_id.start = (vid_start_minutes * 60) + vid_start_seconds;
			} else {
				this.media_id.start = 0;
			}
		} else {
			this.media_id.start = 0;
		}
		
		// Determine HD
		if (typeof(this.media_id.hd) != 'undefined') {
			this.media_id.hd = true;
		} else {
			this.media_id.hd = false;
		}
		
		this.createPlayer();
		
			
	},
	
	createPlayer: function() {
		var self = this;
		
		clearTimeout(this.timer);
		
		if(typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
			// Create Player
			this.player = new YT.Player(this._el.content_item.id, {
				playerVars: {
					enablejsapi:		1,
					color: 				'white',
					showinfo:			0,
					theme:				'light',
					start:				this.media_id.start,
					rel:				0
				},
				videoId: this.media_id.id,
				events: {
					onReady: 			function() {
						self.onPlayerReady();
						// After Loaded
						self.onLoaded();
					},
					'onStateChange': 	self.onStateChange
				}
			});
		} else {
			this.timer = setTimeout(function() {
				self.createPlayer();
			}, 1000);
		}
		
	},
	
	/*	Events
	================================================== */
	onPlayerReady: function(e) {
		this.youtube_loaded = true;
		
	},
	
	onStateChange: function(e) {
		
	}

	
});
