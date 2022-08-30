import { Media } from "../Media";
import { getJSON } from "../../net/Net";
import { loadJS } from "../../core/Load";

export default class TikTok extends Media {
    _loadMedia() {

        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe tl-media-tiktok tl-media-shadow", this._el.content);
        this.media_id = this.data.url
        let api_url = `https://www.tiktok.com/oembed?url=${this.media_id}`

        // oembed includes script tag which won't be loaded 
        // when innerHTML is set. If that tag URL changes
        // this will need updating
        let self = this
        getJSON(api_url, function(d) {
            loadJS("https://www.tiktok.com/embed.js", function() {
                self.createMedia(d);
            });
        });
    }

    createMedia(d) {
        this._el.content_item.innerHTML = d.html;

        // After Loaded
        this.onLoaded();
    }

}