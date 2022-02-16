import { Media } from "../Media";
import { transformMediaURL } from "../../core/Util";
import * as Browser from "../../core/Browser"

export default class PDF extends Media {

    _loadMedia() {
        var url = transformMediaURL(this.data.url),
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe", this._el.content);
        var markup = "";
        // not assigning media_id attribute. Seems like a holdover which is no longer used.
        if (Browser.ie || Browser.edge || url.match(/dl.dropboxusercontent.com/)) {
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