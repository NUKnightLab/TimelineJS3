import { Media } from "../Media";
import { ratio } from "../../core/Util"

export default class Vine extends Media {

    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-vine tl-media-shadow", this._el.content);

        // Get Media ID
        this.media_id = this.data.url.split("vine.co/v/")[1];

        // API URL
        api_url = "https://vine.co/v/" + this.media_id + "/embed/simple";

        // API Call
        this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe><script async src='https://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>"

        // After Loaded
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        var size = ratio.square({ w: this._el.content_item.offsetWidth, h: this.options.height });
        this._el.content_item.style.height = size.h + "px";
    }

    _stopMedia() {
        this._el.content_item.querySelector("iframe").contentWindow.postMessage('pause', '*');
    }

}