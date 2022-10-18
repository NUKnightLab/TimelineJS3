import { Media } from "../Media";
import { loadJS } from "../../core/Load";
import { ajax } from "../../net/Net";
import { ratio, trace } from "../../core/Util";
import TLError from "../../core/TLError";

export default class Imgur extends Media {

    _loadMedia() {
        try {
            var self = this;

            if (this.data.url.match("<blockquote class=['\"]imgur-embed-pub['\"]")) {
                var found = this.data.url.match(/(imgur\.com)\/(\w+)/);
                this.media_id = found[2];
                this.data.url = "http://imgur.com/gallery/" + this.media_id;
            } else if (this.data.url) {
                this.media_id = this.data.url.split('/').slice(-1)[0];
            }

            loadJS([
                    'https://s.imgur.com/min/embed.js'
                ],
                function() {
                    self.createMedia();
                }
            );

        } catch (e) {
            this.loadErrorDisplay(this._("imgur_invalidurl_err"));
        }
    }

    createMedia() {
        var self = this;
        var api_url = "https://api.imgur.com/oembed.json?url=" + this.data.url;

        // Content div
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-image tl-media-imgur",
            this._el.content);

        // API Call

        ajax({
            type: 'GET',
            url: api_url,
            dataType: 'json',
            success: function(data) {
                try {
                    self._el.content_item.innerHTML = data.html;
                    setInterval(function() {
                        if (document.querySelector("blockquote.imgur-embed-pub") == null) {
                            clearInterval();
                        } else {
                            imgurEmbed.createIframe();
                            document.getElementById("imageElement").removeAttribute("style");
                            document.getElementById("image").removeAttribute("style");
                        }
                    }, 2000);
                } catch (e) {
                    trace("Error processing imgur ajax response", e)
                }
            },
            error: function(xhr, errorType, error) {
                if (errorType == 'parsererror') {
                    self.loadErrorDisplay(self._("imgur_invalidurl_err"));
                } else {
                    self.loadErrorDisplay(self._("unknown_read_err", errorType));
                }
            }
        });
        this.onLoaded();

    }

    _updateMediaDisplay() {
        //this.el.content_item = document.getElementById(this._el.content_item.id);
        this._el.content_item.style.width = this.options.width + "px";
        this._el.content_item.style.height = ratio.r16_9({ w: this.options.width }) + "px";
    }

}