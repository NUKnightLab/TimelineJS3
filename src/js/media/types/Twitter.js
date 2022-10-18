import { Media } from "../Media";
import { ajax } from "../../net/Net";
import { loadJS } from "../../core/Load";

export default class Twitter extends Media {
    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-twitter", this._el.content);
        this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";

        // Get Media ID
        if (this.data.url.match("^(https?:)?\/*(www.)?twitter\.com")) {
            if (this.data.url.match("status\/")) {
                this.media_id = this.data.url.split("status\/")[1];
            } else if (this.data.url.match("statuses\/")) {
                this.media_id = this.data.url.split("statuses\/")[1];
            } else {
                this.media_id = "";
            }
        } else if (this.data.url.match("<blockquote class=['\"]twitter-tweet['\"]")) {

            var found = this.data.url.match(/(status|statuses)\/(\d+)/);
            if (found && found.length > 2) {
                this.media_id = found[2];
            } else {
                self.loadErrorDisplay(self._("twitterembed_invalidurl_err"));
                return;
            }
        }

        // API URL
        api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";

        // API Call
        ajax({
            type: 'GET',
            url: api_url,
            dataType: 'json', //json data type
            success: function(d) {
                self.createMedia(d);
            },
            error: function(xhr, type) {
                var error_text = "";
                error_text += self._("twitter_load_err") + "<br/>" + self.media_id + "<br/>" + type;
                self.loadErrorDisplay(error_text);
            }
        });

    }

    createMedia(d) {
        var tweet = "",
            tweet_text = "",
            tweetuser = "",
            tweet_status_temp = "",
            tweet_status_url = "",
            tweet_status_date = "",
            self = this;

        //	TWEET CONTENT
        tweet_text = d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
        tweetuser = d.author_url.split("twitter.com\/")[1];
        tweet_status_temp = d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
        tweet_status_url = tweet_status_temp.split("\"\>")[0];
        tweet_status_date = tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];

        // Open links in new window
        tweet_text = tweet_text.replace(/<a href/ig, '<a target="_blank" rel="noopener" href');

        if (tweet_text.includes("pic.twitter.com")) {

            loadJS('https://platform.twitter.com/widgets.js', function() {
                twttr.widgets.createTweet(self.media_id, self._el.content_item, {
                    conversation: 'none', // or all
                    linkColor: '#cc0000', // default is blue
                    theme: 'light' // or dark
                })
            });

            this.onLoaded();

        } else {

            // 	TWEET CONTENT
            tweet += tweet_text;

            //	TWEET AUTHOR
            tweet += "<div class='vcard'>";
            tweet += "<a href='" + tweet_status_url + "' class='twitter-date' rel='noopener' target='_blank'>" + tweet_status_date + "</a>";
            tweet += "<img src='" + "' class='tl-media-item tl-media-image'>" + "</a>";
            tweet += "<div class='author'>";
            tweet += "<a class='screen-name url' href='" + d.author_url + "' rel='noopener' target='_blank'>";
            tweet += "<span class='avatar'></span>";
            tweet += "<span class='fn'>" + d.author_name + " <span class='tl-icon-twitter'></span></span>";
            tweet += "<span class='nickname'>@" + tweetuser + "<span class='thumbnail-inline'></span></span>";
            tweet += "</a>";
            tweet += "</div>";
            tweet += "</div>";


            // Add to DOM
            this._el.content_item.innerHTML = tweet;

            // After Loaded
            this.onLoaded();
        }
    }


    updateMediaDisplay() {

    }

    _updateMediaDisplay() {

    }
}