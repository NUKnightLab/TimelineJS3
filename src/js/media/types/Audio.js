import { Media } from "../Media";
import * as Browser from "../../core/Browser"

export default class Audio extends Media {
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
        var self = this,
            audio_class = "tl-media-item tl-media-audio tl-media-shadow";

        // Link
        if (this.data.link) {
            this._el.content_link = this.domCreate("a", "", this._el.content);
            this._el.content_link.href = this.data.link;
            this._el.content_link.target = "_blank";
            this._el.content_link.setAttribute('rel', 'noopener');
            this._el.content_item = this.domCreate("audio", audio_class, this._el.content_link);
        } else {
            this._el.content_item = this.domCreate("audio", audio_class, this._el.content);
        }

        this._el.content_item.controls = true;
        this._el.source_item = this.domCreate("source", "", this._el.content_item);

        // Media Loaded Event
        this._el.content_item.addEventListener('load', function(e) {
            self.onMediaLoaded();
        });

        this._el.source_item.src = this.data.url;
        this._el.source_item.type = this._getType(this.data.url, this.data.mediatype.match_str);
        this._el.content_item.innerHTML += "Your browser doesn't support HTML5 audio with " + this._el.source_item.type;
    }

    _updateMediaDisplay(layout) {
        if (Browser.firefox) {
            this._el.content_item.style.width = "auto";
        }
    }

    _getType(url, reg) {
        var ext = url.match(reg);
        var type = "audio/"
        switch (ext[1]) {
            case "mp3":
                type += "mpeg";
                break;
            case "wav":
                type += "wav";
                break;
            case "m4a":
                type += "mp4";
                break;
            default:
                type = "audio";
                break;
        }
        return type
    }

}