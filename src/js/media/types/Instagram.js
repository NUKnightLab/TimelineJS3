import { unhtmlify, trace } from "../../core/Util";
import { ajax, fetchJSON } from "../../net/Net";
import { Media } from "../Media";

const CLIENT_TOKEN = '830b21071290df4f81a35c56abbea096'
const FB_APP_ID = '704270473831239'
const ACCESS_TOKEN = `${FB_APP_ID}|${CLIENT_TOKEN}`
const API_URL_ROOT = `https://graph.facebook.com/v8.0/instagram_oembed?access_token=${ACCESS_TOKEN}&fields=html,thumbnail_url,author_name&url=`

/**
 * Break out from AJAX call for clarity. Remember to .bind() a this value.
 * @param {XMLHttpResponse} resp 
 */
function successHandler(resp) {

    this.oembed_response = resp;

    // Link
    this._el.content_link = this.domCreate("a", "", this._el.content);
    this._el.content_link.href = this.data.url;
    this._el.content_link.target = "_blank";
    this._el.content_link.setAttribute('rel', 'noopener');

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
        this.onMediaLoaded();
    }.bind(this));

    this._el.content_item.src = resp.thumbnail_url

    // After Loaded
    this.onLoaded();

}

/**
 * Break out from AJAX call for clarity. Remember to .bind() a this value.
 * @param {XMLHttpResponse} resp
 */
function errorHandler(resp) {
    let msg = `${resp.statusText} [${resp.status}]`
    if (resp.status == 400) {
        msg = this._('instagram_bad_request')
    }
    this.loadErrorDisplay(msg)
}

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

        let data_url = `${API_URL_ROOT}${this.data.url}`
        try {
            ajax({ // getJSON doesn't let us set an errorhandler :-(
                url: data_url,
                dataType: 'json',
                success: successHandler,
                error: errorHandler,
                context: this
            })
        } catch (e) {
            console.log(`Instagram: error fetching ${data_url}`)
            console.log(e)
            debugger;
        }


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