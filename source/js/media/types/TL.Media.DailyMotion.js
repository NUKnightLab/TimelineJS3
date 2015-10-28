/*	TL.Media.DailyMotion
================================================== */

TL.Media.DailyMotion = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
				
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-dailymotion", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("video")) {
			this.media_id = this.data.url.split("video\/")[1].split(/[?&]/)[0];
		} else {
			this.media_id = this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		}
		
		// API URL
		api_url = "http://www.dailymotion.com/embed/video/" + this.media_id;
		
		// API Call
		this._el.content_item.innerHTML = "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"		
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	}
	
});
