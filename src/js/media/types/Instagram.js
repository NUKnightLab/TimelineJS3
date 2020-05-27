import { unhtmlify } from "../../core/Util";
import { getJSON } from "../../net/Net";
import { Media } from "../Media";

export default class Instagram extends Media {
    _loadMedia() {
        // Get Media ID
        this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];

        if (!this.options.background) {
            this.createMedia();
        }

        // After Loaded
        this.onLoaded();
    }

    createMedia() {
        var self = this;

        // Link
        this._el.content_link = this.domCreate("a", "", this._el.content);
        this._el.content_link.href = this.data.url;
        this._el.content_link.target = "_blank";

        // Photo
        this._el.content_item = this.domCreate("img", "tl-media-item tl-media-image tl-media-instagram tl-media-shadow", this._el.content_link);

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

        this._el.content_item.src = this.getImageURL(this._el.content.offsetWidth);
    }

    getImageURL(w, h) {
        let img_url = "https://instagram.com/p/" + this.media_id + "/media/?size=" + this.sizes(w)
        console.log('insta URL', img_url)
        return img_url;
    }

    _getMeta() {
        var self = this,
            api_url;

        // API URL
        api_url = "https://api.instagram.com/oembed?url=https://instagr.am/p/" + this.media_id + "&callback=?";

        // API Call
        getJSON(api_url, function(d) {
            self.data.credit_alternate = "<a href='" + d.author_url + "' target='_blank'>" + d.author_name + "</a>";
            self.data.caption_alternate = d.title;
            self.updateMeta();
        });
    }

    sizes(s) {
        var _size = "";
        if (s <= 150) {
            _size = "t";
        } else if (s <= 306) {
            _size = "m";
        } else {
            _size = "l";
        }

        return _size;
    }

}