import { Media } from "../Media";
import { ajax } from "../../net/Net";
import { unhtmlify } from "../../core/Util";

export default class Bluesky extends Media {

    _loadMedia() {
        var self = this;

        try {
            // Extract handle and post ID from URL
            // URL format: https://bsky.app/profile/{handle}/post/{postId}
            var url_parts = this.data.url.match(/bsky\.app\/profile\/([^\/]+)\/post\/([^\/\?]+)/);

            if (!url_parts || url_parts.length < 3) {
                this.loadErrorDisplay(this._("bluesky_invalidurl_err"));
                return;
            }

            this.handle = url_parts[1];
            this.post_id = url_parts[2];

            // Clean URL (remove query parameters)
            this.clean_url = `https://bsky.app/profile/${this.handle}/post/${this.post_id}`;

            if (!this.options.background) {
                this.createMedia();
            }

        } catch (e) {
            this.loadErrorDisplay(this._("bluesky_invalidurl_err"));
        }
    }

    createMedia() {
        var self = this;

        // Construct AT URI from handle and post ID
        var atUri = `at://${this.handle}/app.bsky.feed.post/${this.post_id}`;

        // Use Bluesky public API to fetch post data
        var api_url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}`;

        ajax({
            type: 'GET',
            url: api_url,
            dataType: 'json',
            success: function(data) {
                self.renderPost(data);
            },
            error: function(xhr, type) {
                self.loadErrorDisplay(self._("bluesky_invalidurl_err"));
            }
        });
    }

    renderPost(data) {
        var self = this;

        if (!data.thread || !data.thread.post) {
            this.loadErrorDisplay(this._("bluesky_invalidurl_err"));
            return;
        }

        var post = data.thread.post;
        var author = post.author;
        var record = post.record;

        // Create content container
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-bluesky", this._el.content);
        this._el.content_container.className = "tl-media-content-container";

        // Post container
        var postContainer = this.domCreate("div", "bluesky-post", this._el.content_item);

        // Author info
        var authorDiv = this.domCreate("div", "bluesky-author", postContainer);
        var authorLink = this.domCreate("a", "bluesky-author-link", authorDiv);
        authorLink.href = `https://bsky.app/profile/${author.handle}`;
        authorLink.target = "_blank";
        authorLink.setAttribute('rel', 'noopener');

        if (author.avatar) {
            var avatar = this.domCreate("img", "bluesky-avatar", authorLink);
            avatar.src = author.avatar;
            avatar.alt = author.displayName || author.handle;
        }

        var authorName = this.domCreate("strong", "bluesky-display-name", authorLink);
        authorName.innerHTML = (author.displayName || author.handle) + " <span class='tl-icon-bluesky'></span>";

        var authorHandle = this.domCreate("span", "bluesky-handle", authorDiv);
        authorHandle.textContent = ` @${author.handle}`;

        // Post text
        if (record.text) {
            var textDiv = this.domCreate("div", "bluesky-text", postContainer);
            textDiv.textContent = record.text;
        }

        // Embedded images
        if (post.embed && post.embed.images && post.embed.images.length > 0) {
            var imagesDiv = this.domCreate("div", "bluesky-images", postContainer);
            post.embed.images.forEach(function(img) {
                var imgElement = self.domCreate("img", "bluesky-image", imagesDiv);
                imgElement.src = img.thumb || img.fullsize;
                imgElement.alt = img.alt || "";
            });
        }

        // Quote posts (embedded records)
        if (post.embed && post.embed.record && post.embed.record.author) {
            var quoteDiv = this.domCreate("div", "bluesky-quote", postContainer);
            var quotedPost = post.embed.record;

            // Quoted author
            var quoteAuthor = this.domCreate("div", "bluesky-quote-author", quoteDiv);
            if (quotedPost.author.avatar) {
                var quoteAvatar = this.domCreate("img", "bluesky-avatar-small", quoteAuthor);
                quoteAvatar.src = quotedPost.author.avatar;
                quoteAvatar.alt = quotedPost.author.displayName || quotedPost.author.handle;
            }
            var quoteName = this.domCreate("strong", "", quoteAuthor);
            quoteName.textContent = quotedPost.author.displayName || quotedPost.author.handle;
            var quoteHandle = this.domCreate("span", "bluesky-handle", quoteAuthor);
            quoteHandle.textContent = ` @${quotedPost.author.handle}`;

            // Quoted text
            if (quotedPost.value && quotedPost.value.text) {
                var quoteText = this.domCreate("div", "bluesky-quote-text", quoteDiv);
                quoteText.textContent = quotedPost.value.text;
            }

            // Quoted images (if present in embeds)
            if (quotedPost.embeds && quotedPost.embeds[0] && quotedPost.embeds[0].images) {
                var quoteImagesDiv = this.domCreate("div", "bluesky-quote-images", quoteDiv);
                quotedPost.embeds[0].images.forEach(function(img) {
                    var imgElement = self.domCreate("img", "bluesky-image-small", quoteImagesDiv);
                    imgElement.src = img.thumb || img.fullsize;
                    imgElement.alt = img.alt || "";
                });
            }
        }

        // Link to original post
        var linkDiv = this.domCreate("div", "bluesky-link", postContainer);
        var link = this.domCreate("a", "", linkDiv);
        link.href = this.clean_url;
        link.target = "_blank";
        link.setAttribute('rel', 'noopener');
        link.textContent = "View on Bluesky";

        this.onLoaded();
    }

    updateMediaDisplay() {
        // Static content, no dynamic updates needed
    }

    _updateMediaDisplay() {
        // Static content, no dynamic updates needed
    }

}
