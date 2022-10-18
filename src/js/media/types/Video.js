import { Media } from "../Media";
import * as Browser from "../../core/Browser"
import { transformMediaURL } from "../../core/Util";

export default class Video extends Media {
    _loadMedia() {
        // Loading Message
        this.loadingMessage();

        // Create media?
        if (!this.options.background) {
            this.createMedia();
        }

        // After loaded
        this.onLoaded();
    }

    createMedia() {
        //Transform URL for Dropbox
        var url = transformMediaURL(this.data.url),
            self = this;

        var self = this,
            video_class = "tl-media-item tl-media-video tl-media-shadow";

        // Link
        this._el.content_item = this.domCreate("video", video_class, this._el.content);

        this._el.content_item.controls = true;
        this._el.source_item = this.domCreate("source", "", this._el.content_item);

        // Media Loaded Event
        this._el.content_item.addEventListener('load', function(e) {
            self.onMediaLoaded();
        });

        this._el.source_item.src = url;
        this._el.source_item.type = this._getType(this.data.url, this.data.mediatype.match_str);
        this._el.content_item.innerHTML += "Your browser doesn't support HTML5 video with " + this._el.source_item.type;
        this.player_element = this._el.content_item

    }

    _updateMediaDisplay(layout) {
        if (Browser.firefox) {
            this._el.content_item.style.width = "auto";
        }
    }

    _stopMedia() {
        if (this.player_element) {
            this.player_element.pause()
        }
    }

    _getType(url, reg) {
        var ext = url.match(reg);
        var type = "video/"
        switch (ext[1]) {
            case "mp4":
                type += "mp4";
                break;
            case "webm":
                type += "webm";
                break;
            default:
                type = "video";
                break;
        }
        return type
    }

}