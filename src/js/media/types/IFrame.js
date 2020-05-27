import { Media } from "../Media";

export default class IFrame extends Media {
    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe", this._el.content);

        // Get Media ID
        this.media_id = this.data.url;

        // API URL
        api_url = this.media_id;

        // API Call
        this._el.content_item.innerHTML = api_url;

        // After Loaded
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        this._el.content_item.style.height = this.options.height + "px";
    }

}