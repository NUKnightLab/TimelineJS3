import { Media } from "../Media";
import { ajax } from "../../net/Net";

export default class TwitterEmbed extends Media {
    _loadMedia() {
        var api_url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-twitter", this._el.content);
        this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";

        // Get Media ID
        var found = this.data.url.match(/(status|statuses)\/(\d+)/);
        if (found && found.length > 2) {
            this.media_id = found[2];
        } else {
            self.loadErrorDisplay(self._("twitterembed_invalidurl_err"));
            return;
        }

        // API URL
        api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";

        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }(document, "script", "twitter-wjs"));

        // API Call
        ajax({
            type: 'GET',
            url: api_url,
            dataType: 'json', //json data type
            success(d) {
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
            tweet_status_date = "";

        //	TWEET CONTENT
        tweet_text = d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
        tweetuser = d.author_url.split("twitter.com\/")[1];
        tweet_status_temp = d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
        tweet_status_url = tweet_status_temp.split("\"\>")[0];
        tweet_status_date = tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];

        // Open links in new window
        tweet_text = tweet_text.replace(/<a href/ig, '<a target="_blank" rel="noopener" href');
        let mediaID = this.media_id; // make visible in callback.
        if (tweet_text.includes("pic.twitter.com")) {
            twttr.ready(
                function(evt) {
                    tweet = document.getElementsByClassName("tl-media-twitter")[0];
                    var id = String(mediaID);
                    twttr.widgets.createTweet(id, tweet, {
                            conversation: 'none', // or all
                            linkColor: '#cc0000', // default is blue
                            theme: 'light' // or dark
                        })
                        .then(function(evt) {
                            this.onLoaded();
                        });
                }
            );
            this._el.content_item.innerHTML = tweet;
            this.onLoaded();
        } else {
            // 	TWEET CONTENT
            tweet += tweet_text;

            //	TWEET AUTHOR
            tweet += "<div class='vcard'>";
            tweet += "<a href='" + tweet_status_url + "' class='twitter-date' rel='noopener' target='_blank'>" + tweet_status_date + "</a>";
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