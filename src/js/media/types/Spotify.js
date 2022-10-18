import { trace } from "../../core/Util"
import { Media } from "../Media";
import * as Browser from "../../core/Browser"

export function computeMediaId(url) {

    var media_id = null;

    if (url.match(/^spotify:/)) return url; // trust all Spotify URIs will be embeddable

    url = new URL(url)

    // again, we're kind of trusting here, but especially that the embed service will reject wrong cases.
    let path = url.pathname.replace(/\/$/, '') // strip trailing slash if there is one
    return `spotify${path.replace(/\//g,':')}`
}

export default class Spotify extends Media {
    _loadMedia() {

        var api_url;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-spotify", this._el.content);


        this.media_id = computeMediaId(this.data.url)

        if (this.media_id) {
            // API URL
            api_url = "https://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";

            this.player = this.domCreate("iframe", "tl-media-shadow", this._el.content_item);
            this.player.width = "100%";
            this.player.height = "100%";
            this.player.frameBorder = "0";
            this.player.src = api_url;

            // After Loaded
            this.onLoaded();

        } else {
            this.loadErrorDisplay(this._('spotify_invalid_url'));
        }
    }

    // Update Media Display

    _updateMediaDisplay(l) {
        var _height = this.options.height,
            _player_height = 0,
            _player_width = 0;

        if (Browser.mobile) {
            _height = (this.options.height / 2);
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
            this._el.credit.style.width = _player_width;
        }
        if (this._el.caption) {
            this._el.caption.style.width = _player_width;
        }
    }


    _stopMedia() {
        // Need spotify stop code

    }

}