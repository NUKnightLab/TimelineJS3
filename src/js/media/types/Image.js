import { Media } from "../Media"
import { unhtmlify, transformMediaURL } from "../../core/Util"
import * as Browser from "../../core/Browser"

export default class Image extends Media {

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
            image_class = "tl-media-item tl-media-image tl-media-shadow";

        if (this.data.url.match(/.png(\?.*)?$/) || this.data.url.match(/.svg(\?.*)?$/)) {
            image_class = "tl-media-item tl-media-image"
        }

        this._el.content_item = this.domCreate("img", image_class, this._el.content);

        if (this.data.alt) {
            this._el.content_item.alt = this.data.alt;
        } else if (this.data.caption) {
            this._el.content_item.alt = unhtmlify(this.data.caption);
        }

        if (this.data.title) {
            this._el.content_item.title = this.data.title;
        } else if (this.data.caption) {
            this._el.content_item.title = unhtmlify(this.data.caption);
        }

        // Media Loaded Event
        this._el.content_item.addEventListener('load', function(e) {
            self.onMediaLoaded();
        });

        this._el.content_item.src = this.getImageURL();
    }

    getImageURL(w, h) {
        return transformMediaURL(this.data.url);
    }

    _updateMediaDisplay(layout) {
        if (Browser.firefox) {
            //this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
            this._el.content_item.style.width = "auto";
        }
    }

}