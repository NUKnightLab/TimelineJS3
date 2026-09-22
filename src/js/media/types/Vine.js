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
        var iframe = document.createElement("iframe");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("height", "100%");
        iframe.setAttribute("src", api_url);
        this._el.content_item.appendChild(iframe);

        var script = document.createElement("script");
        script.async = true;
        script.src = "https://platform.vine.co/static/scripts/embed.js";
        script.charset = "utf-8";
        this._el.content_item.appendChild(script);

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