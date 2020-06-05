import { trace, unique_ID, getUrlVars, ratio, parseYouTubeTime } from "../../core/Util"
import { loadJS } from "../../core/Load"
import { Media } from "../Media";

export default class YouTube extends Media {
    _loadMedia() {
        var self = this,
            url_vars;

        this.youtube_loaded = false;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-youtube tl-media-shadow", this._el.content);
        this._el.content_item.id = unique_ID(7)

        // URL Vars
        url_vars = getUrlVars(this.data.url);

        // Get Media ID
        this.media_id = {};

        if (this.data.url.match('v=')) {
            this.media_id.id = url_vars["v"];
        } else if (this.data.url.match('\/embed\/')) {
            this.media_id.id = this.data.url.split("embed\/")[1].split(/[?&]/)[0];
        } else if (this.data.url.match(/v\/|v=|youtu\.be\//)) {
            this.media_id.id = this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
        } else {
            trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
        }

        // TODO: switch this to use parseYouTubeTime
        // Get start second
        if (this.data.url.match("start=")) {
            this.media_id.start = parseYouTubeTime(this.data.url.split("start=")[1], 10);
        } else if (this.data.url.match("t=")) {
            this.media_id.start = parseYouTubeTime(this.data.url.split("t=")[1], 10);
        }

        //Get end second
        if (this.data.url.match("end=")) {
            this.media_id.end = parseYouTubeTime(this.data.url.split("end=")[1], 10);
        }

        this.media_id.hd = Boolean(typeof(url_vars["hd"]) != 'undefined');


        // API Call
        loadJS('https://www.youtube.com/iframe_api', function() {
            self.createMedia();
        });

    }

    // Update Media Display
    _updateMediaDisplay() {
        //this.el.content_item = document.getElementById(this._el.content_item.id);
        this._el.content_item.style.height = ratio.r16_9({ w: this.options.width }) + "px";
        this._el.content_item.style.width = this.options.width + "px";
    }

    _stopMedia() {
        if (this.youtube_loaded) {
            try {
                if (this.player.getPlayerState() == YT.PlayerState.PLAYING) {
                    this.player.pauseVideo();
                }
            } catch (err) {
                trace(err);
            }

        }
    }
    createMedia() {
        var self = this;

        clearTimeout(this.timer);

        if (typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
            // Create Player
            this.player = new YT.Player(this._el.content_item.id, {
                playerVars: {
                    enablejsapi: 1,
                    color: 'white',
                    controls: 1,
                    start: this.media_id.start,
                    end: this.media_id.end,
                    fs: 1
                },
                videoId: this.media_id.id,
                events: {
                    onReady: function() {
                        self.onPlayerReady();
                        // After Loaded
                        self.onLoaded();
                    },
                    'onStateChange': self.onStateChange
                }
            });
        } else {
            this.timer = setTimeout(function() {
                self.createMedia();
            }, 1000);
        }
    }

    /*	Events
    ================================================== */
    onPlayerReady(e) {
        this.youtube_loaded = true;
        this._el.content_item = document.getElementById(this._el.content_item.id);
        this.onMediaLoaded();

    }

    onStateChange(e) {
        if (e.data == YT.PlayerState.ENDED) {
            e.target.seekTo(0);
            e.target.pauseVideo();
        }
    }


}