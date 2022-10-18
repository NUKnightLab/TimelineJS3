import { Media } from "../Media";
import { ratio } from "../../core/Util"

export default class DailyMotion extends Media {
    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-dailymotion", this._el.content);

        // Get Media ID
        if (this.data.url.match("video")) {
            this.media_id = this.data.url.split("video\/")[1].split(/[?&]/)[0];
        } else {
            this.media_id = this.data.url.split("embed\/")[1].split(/[?&]/)[0];
        }

        // API URL
        api_url = "https://www.dailymotion.com/embed/video/" + this.media_id + "?api=postMessage";

        // API Call
        this._el.content_item.innerHTML = "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"

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