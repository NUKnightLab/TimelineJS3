import { Media } from "../Media";
import { ajax } from "../../net/Net";
import { unhtmlify } from "../../core/Util";

export default class TikTok extends Media {

    _loadMedia() {
        var self = this;

        try {
            // Extract video ID and username from URL
            // URL format: https://www.tiktok.com/@username/video/7611014647642098958
            var url_parts = this.data.url.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);

            if (!url_parts || url_parts.length < 3) {
                this.loadErrorDisplay(this._("tiktok_invalidurl_err"));
                return;
            }

            this.username = url_parts[1];
            this.media_id = url_parts[2];

            // Clean URL (remove query parameters)
            this.clean_url = `https://www.tiktok.com/@${this.username}/video/${this.media_id}`;

            if (!this.options.background) {
                this.createMedia();
            }

        } catch (e) {
            this.loadErrorDisplay(this._("tiktok_invalidurl_err"));
        }
    }

    createMedia() {
        var self = this;

        // Use TikTok oEmbed API
        var api_url = "https://www.tiktok.com/oembed?url=" + encodeURIComponent(this.clean_url);

        ajax({
            type: 'GET',
            url: api_url,
            dataType: 'json',
            success: function(data) {
                self.oembed_response = data;

                // Create content container
                self._el.content_item = self.domCreate("div", "tl-media-item tl-media-tiktok", self._el.content);

                // If we have thumbnail, show that with a link to TikTok
                if (data.thumbnail_url) {
                    // Link
                    self._el.content_link = self.domCreate("a", "", self._el.content_item);
                    self._el.content_link.href = self.clean_url;
                    self._el.content_link.target = "_blank";
                    self._el.content_link.setAttribute('rel', 'noopener');

                    // Thumbnail image
                    self._el.content_image = self.domCreate("img", "tl-media-image tl-media-shadow", self._el.content_link);
                    self._el.content_image.src = data.thumbnail_url;

                    if (self.data.alt) {
                        self._el.content_image.alt = self.data.alt;
                    } else if (data.title) {
                        self._el.content_image.alt = unhtmlify(data.title);
                    } else {
                        self._el.content_image.alt = "TikTok video by @" + self.username;
                    }

                    // Add play icon overlay
                    self._el.play_overlay = self.domCreate("div", "tl-media-tiktok-play-overlay", self._el.content_link);
                    self._el.play_icon = self.domCreate("span", "", self._el.play_overlay);

                    // Media loaded event
                    self._el.content_image.addEventListener('load', function(e) {
                        self.onMediaLoaded();
                    });

                    self.onLoaded();

                    // Get and display metadata (caption/credit)
                    self._getMeta();
                } else {
                    // Fallback: use HTML embed but with constraints
                    self._el.content_item.innerHTML = data.html || '';
                    self.onLoaded();
                }
            },
            error: function(xhr, type) {
                var error_text = self._("tiktok_invalidurl_err");
                self.loadErrorDisplay(error_text);
            }
        });
    }

    _updateMediaDisplay() {
        // Thumbnail scales with container
    }

    _getMeta() {
        if (this.oembed_response) {
            if (this.oembed_response.author_name) {
                this.data.credit_alternate = `TikTok: <a href="https://www.tiktok.com/@${this.username}" target="_blank" rel="noopener">@${this.username}</a>`;
            }
            if (this.oembed_response.title) {
                this.data.caption_alternate = this.oembed_response.title;
            }
        }
        this.updateMeta();
    }

}
