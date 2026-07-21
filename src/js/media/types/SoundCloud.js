import { Media } from "../Media";
import { getJSON } from "../../net/Net";
import { loadJS } from "../../core/Load";

export default class SoundCloud extends Media {
	_loadMedia() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-soundcloud tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url;

		// API URL
		api_url = "https://soundcloud.com/oembed?url=" + this.media_id + "&format=js&callback=?"

		// API Call
		getJSON(api_url, function(d) {
			loadJS("https://w.soundcloud.com/player/api.js", function() {//load soundcloud api for pausing.
				self.createMedia(d);
			});
		});

	}

	createMedia(d) {
		this._el.content_item.innerHTML = d.html;

		self.widget = SC.Widget(this._el.content_item.querySelector("iframe"));//create widget for api use
		this.soundCloudCreated = true;


		// After Loaded
		this.onLoaded();
	}

	_stopMedia() {
		if (this.soundCloudCreated)
		{
			self.widget.pause();
		}
	}

}
