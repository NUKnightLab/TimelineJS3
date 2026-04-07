import { Media } from "../Media";
import { transformMediaURL } from "../../core/Util";

export default class PDF extends Media {

    _loadMedia() {
        const url = transformMediaURL(this.data.url);

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe", this._el.content);

        // Use Google Docs viewer for Dropbox URLs since they need special handling
        let markup;
        if (url.match(/dl.dropboxusercontent.com/)) {
            markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='//docs.google.com/viewer?url=" + url + "&amp;embedded=true'></iframe>";
        } else {
            markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + url + "'></iframe>"
        }
        this._el.content_item.innerHTML = markup
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        this._el.content_item.style.height = this.options.height + "px";
    }


}