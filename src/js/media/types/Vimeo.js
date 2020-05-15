import { trace, ratio } from "../../core/Util"
import { Media } from "../Media";

export default class Vimeo extends Media {

	_loadMedia() {
		var api_url,
			self = this;

		// Create Dom element
		this._el.content_item	= this.domCreate("div", "tl-media-item tl-media-iframe tl-media-vimeo tl-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		var start_time = null;

		// Get start time
		if (this.data.url.match(/#t=([^&]+).*/)) {
			start_time = this.data.url.match(/#t=([^&]+).*/)[1];
		}

		// API URL
		api_url = "https://player.vimeo.com/video/" + this.media_id + "?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
		if (start_time) {
			api_url = api_url += '&amp;#t=' + start_time;
		}

		this.player = this.domCreate("iframe", "", this._el.content_item);

		// Media Loaded Event
		this.player.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;

		this.player.setAttribute('allowfullscreen', '');
		this.player.setAttribute('webkitallowfullscreen', '');
		this.player.setAttribute('mozallowfullscreen', '');

		// After Loaded
		this.onLoaded();
	}

	// Update Media Display
	_updateMediaDisplay() {
		this._el.content_item.style.height = ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	}

	_stopMedia() {

		try {
			this.player.contentWindow.postMessage(JSON.stringify({method: "pause"}), "https://player.vimeo.com");
		}
		catch(err) {
			trace(err);
		}
	}
}
