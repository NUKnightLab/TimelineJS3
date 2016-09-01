/*	TL.Media.SoundCloud
================================================== */

var soundCoudCreated = false;

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
		api_url = "https://soundcloud.com/oembed?url=" + this.media_id + "&format=js&callback=?"

		// API Call
		TL.getJSON(api_url, function(d) {
			TL.Load.js("https://w.soundcloud.com/player/api.js", function() {//load soundcloud api for pausing.
				self.createMedia(d);
			});
		});

	},

	createMedia: function(d) {
		this._el.content_item.innerHTML = d.html;

		this.soundCloudCreated = true;

		self.widget = SC.Widget(this._el.content_item.querySelector("iframe"));//create widget for api use

		// After Loaded
		this.onLoaded();
	},

	_stopMedia: function() {
		if (this.soundCloudCreated)
		{
			self.widget.pause();
		}
	}

});
