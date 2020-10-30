import { unhtmlify, trace } from "../../core/Util";
import { getJSON, fetchJSON } from "../../net/Net";
import { Media } from "../Media";

const CLIENT_TOKEN = '830b21071290df4f81a35c56abbea096'
const FB_APP_ID = '704270473831239'
const ACCESS_TOKEN = `${FB_APP_ID}|${CLIENT_TOKEN}`
const API_URL_ROOT = `https://graph.facebook.com/v8.0/instagram_oembed?access_token=${ACCESS_TOKEN}&fields=html,thumbnail_url,author_name&url=`

export default class Instagram extends Media {



    _loadMedia() {
        // Get Media ID
        this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];

        if (!this.options.background) {
            this.createMedia();
        }

    }

    createMedia() {
        this.oembed_response = null;
        var self = this;

        getJSON(`${API_URL_ROOT}${this.data.url}`, (resp) => {

            self.oembed_response = resp;

            // Link
            self._el.content_link = self.domCreate("a", "", self._el.content);
            self._el.content_link.href = self.data.url;
            self._el.content_link.target = "_blank";

            // Photo
            self._el.content_item = self.domCreate("img", "tl-media-item tl-media-image tl-media-instagram tl-media-shadow", self._el.content_link);

            if (self.data.alt) {
                self._el.content_item.alt = self.data.alt;
            } else if (self.data.caption) {
                self._el.content_item.alt = unhtmlify(self.data.caption);
            }

            if (self.data.title) {
                self._el.content_item.title = self.data.title;
            } else if (self.data.caption) {
                self._el.content_item.title = unhtmlify(self.data.caption);
            }

            // Media Loaded Event
            self._el.content_item.addEventListener('load', function(e) {
                self.onMediaLoaded();
            });

            self._el.content_item.src = resp.thumbnail_url

            // After Loaded
            this.onLoaded();

        })

    }

    getImageURL() {
        if (this.oembed_response && this.oembed_response.thumbnail_url) {
            return this.oembed_response.thumbnail_url
        }

        fetchJSON(`${API_URL_ROOT}${this.data.url}`).then(json => {
            return json.thumbnail_url
        }).catch(err => {
            trace(`Instagram getImageURL Error: ${err.status} ${err.statusText}`)
        })
    }

    _getMeta() {
        if (this.oembed_response && this.oembed_response.author_name) {
            this.data.credit_alternate = `Instagram: <a href="https://instagram.com/${this.oembed_response.author_name}" target="_blank">@${this.oembed_response.author_name}</a>`
        }
        // nothing in our data helps us provide an alternative caption...
        // this.data.caption_alternate = d.title;
        this.updateMeta();
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