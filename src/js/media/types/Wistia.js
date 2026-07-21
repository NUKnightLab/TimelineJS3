import { Media } from "../Media";
import { ratio, trace } from "../../core/Util";

export default class Wistia extends Media {

    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-wistia tl-media-shadow", this._el.content);

        // Get Media ID
        this.media_id = this.data.url.split(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/medias\/(.*)/)[3];
        trace(`Wistia: media_id: ${this.media_id}`)
            // API URL
        api_url = "https://fast.wistia.com/embed/iframe/" + this.media_id + "?version=v1&controlsVisibleOnLoad=true&playerColor=aae3d8";

        this.player = this.domCreate("iframe", "", this._el.content_item);

        // Media Loaded Event
        this.player.addEventListener('load', function(e) {
            self.onMediaLoaded();
        });

        this.player.width = "100%";
        this.player.height = "100%";
        this.player.frameBorder = "0";
        this.player.src = api_url;

        this.player.setAttribute('allowfullscreen', '');
        this.player.setAttribute('webkitallowfullscreen', '');
        this.player.setAttribute('mozallowfullscreen', '');

        // After Loaded
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        this._el.content_item.style.height = ratio.r16_9({ w: this._el.content_item.offsetWidth }) + "px";
    }

    _stopMedia() {
        try {
            this.player.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "https://player.vimeo.com");
        } catch (err) {
            trace(err);
        }
    }
}