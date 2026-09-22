import { Media } from "../Media";
import { ratio } from "../../core/Util"

export default class DailyMotion extends Media {
    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-dailymotion", this._el.content);

        // Get Media ID
        if (this.data.url.indexOf("dai.ly/") != -1) {
            this.media_id = this.data.url.substr(this.data.url.indexOf("dai.ly/") + "dai.ly/".length)
        } else if (this.data.url.match("video")) {
            this.media_id = this.data.url.split("video\/")[1].split(/[?&]/)[0];
        } else {
            this.media_id = this.data.url.split("embed\/")[1].split(/[?&]/)[0];
        }

        // some URLs, at least old ones we have, include an underscore and a readable URL string 
        // which gets dropped in a rewrite, but which doesn't work in the embed URL
        if (this.media_id.indexOf('_') != -1) {
            this.media_id = this.media_id.split('_')[0]
        }

        // API URL
        api_url = "https://www.dailymotion.com/embed/video/" + this.media_id + "?api=postMessage";

        // API Call
        var iframe = document.createElement("iframe");
        iframe.setAttribute("autostart", "false");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("height", "100%");
        iframe.setAttribute("src", api_url);
        this._el.content_item.appendChild(iframe);

        // After Loaded
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        if (this._state.loaded) {
            this._el.content_item.style.height = ratio.r16_9({ w: this._el.content_item.offsetWidth }) + "px";
        }
    }

    _stopMedia() {
        if (this._state.loaded) {
            this._el.content_item.querySelector("iframe").contentWindow.postMessage('{"command":"pause","parameters":[]}', "*");
        }

    }

}