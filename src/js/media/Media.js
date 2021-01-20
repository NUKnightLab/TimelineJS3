import { classMixin, mergeData, linkify, } from "../core/Util"
import { I18NMixins } from "../language/I18NMixins";
import Events from "../core/Events"
import * as DOM from "../dom/DOM"
import * as Browser from "../core/Browser"
import { Text } from "./types/Text"
import Message from "../ui/Message"


class Media {
    constructor(data, options, language) { //add_to_container) {
        if (language) {
            this.setLanguage(language)
        }
        // DOM ELEMENTS
        this._el = {
            container: {},
            content_container: {},
            content: {},
            content_item: {},
            content_link: {},
            caption: null,
            credit: null,
            parent: {},
            link: null
        };

        // Player (If Needed)
        this.player = null;

        // Timer (If Needed)
        this.timer = null;
        this.load_timer = null;

        // Message
        this.message = null;

        // Media ID
        this.media_id = null;

        // State
        this._state = {
            loaded: false,
            show_meta: false,
            media_loaded: false
        };

        // Data
        this.data = {
            unique_id: null,
            url: null,
            credit: null,
            caption: null,
            credit_alternate: null,
            caption_alternate: null,
            link: null,
            link_target: null
        };

        //Options
        this.options = {
            api_key_flickr: "bd3a7c45ddd52f3101825d41563a6125",
            api_key_googlemaps: "AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
            api_key_embedly: "", // ae2da610d1454b66abdf2e6a4c44026d
            credit_height: 0,
            caption_height: 0,
            background: 0 // is background media (for slide)
        };

        this.animator = {};

        // Merge Data and Options
        mergeData(this.options, options);
        mergeData(this.data, data);

        // Don't create DOM elements if this is background media
        if (!this.options.background) {
            this._el.container = DOM.create("div", "tl-media");

            if (this.data.unique_id) {
                this._el.container.id = this.data.unique_id;
            }

            this._initLayout();

        }
    }

    loadMedia() {
        var self = this;

        if (!this._state.loaded) {
            try {
                this.load_timer = setTimeout(function() {
                    self.loadingMessage();
                    self._loadMedia();
                    // self._state.loaded = true; handled in onLoaded()
                    self._updateDisplay();
                }, 1200);
            } catch (e) {
                trace("Error loading media for ", this._media);
                trace(e);
            }
        }
    }

    _updateMessage(msg) {
        if (this.message) {
            this.message.updateMessage(msg);
        }
    }

    loadingMessage() {
        this._updateMessage(this._('loading') + " " + this.options.media_name);
    }

    errorMessage(msg) {
        if (msg) {
            msg = this._('error') + ": " + msg;
        } else {
            msg = this._('error');
        }
        this._updateMessage(msg);
    }

    updateMediaDisplay(layout) {
        if (this._state.loaded && !this.options.background) {

            if (Browser.mobile) {
                this._el.content_item.style.maxHeight = (this.options.height / 2) + "px";
            } else {
                this._el.content_item.style.maxHeight = this.options.height - this.options.credit_height - this.options.caption_height - 30 + "px";
            }

            //this._el.content_item.style.maxWidth = this.options.width + "px";
            this._el.container.style.maxWidth = this.options.width + "px";
            // Fix for max-width issues in Firefox
            if (Browser.firefox) {
                if (this._el.content_item.offsetWidth > this._el.content_item.offsetHeight) {
                    //this._el.content_item.style.width = "100%";
                }
            }

            this._updateMediaDisplay(layout);

            if (this._state.media_loaded) {
                if (this._el.credit) {
                    this._el.credit.style.width = this._el.content_item.offsetWidth + "px";
                }
                if (this._el.caption) {
                    this._el.caption.style.width = this._el.content_item.offsetWidth + "px";
                }
            }

        }
    }

    /*	Media Specific
    ================================================== */
    _loadMedia() {
        // All overrides must call this.onLoaded() to set state
        this.onLoaded();
    }

    _updateMediaDisplay(l) {
        //this._el.content_item.style.maxHeight = (this.options.height - this.options.credit_height - this.options.caption_height - 16) + "px";
        if (Browser.firefox) {
            this._el.content_item.style.maxWidth = this.options.width + "px";
            this._el.content_item.style.width = "auto";
        }
    }

    _getMeta() {

    }

    _getImageURL(w, h) {
        // Image-based media types should return <img>-compatible src url
        return "";
    }

    /*	Public
    ================================================== */
    show() {

    }

    hide() {

    }

    addTo(container) {
        container.appendChild(this._el.container);
        this.onAdd();
    }

    removeFrom(container) {
        container.removeChild(this._el.container);
        this.onRemove();
    }

    getImageURL(w, h) {
        return this._getImageURL(w, h);
    }

    // Update Display
    updateDisplay(w, h, l) {
        this._updateDisplay(w, h, l);
    }

    stopMedia() {
        this._stopMedia();
    }

    loadErrorDisplay(message) {
        try {
            this._el.content.removeChild(this._el.content_item);
        } catch (e) {
            // if this._el.content_item isn't a child of this._el then just keep truckin
        }
        this._el.content_item = DOM.create("div", "tl-media-item tl-media-loaderror", this._el.content);
        this._el.content_item.innerHTML = "<div class='tl-icon-" + this.options.media_type + "'></div><p>" + message + "</p>";

        // After Loaded
        this.onLoaded(true);
    }

    /*	Events
    ================================================== */
    onLoaded(error) {
        this._state.loaded = true;
        this.fire("loaded", this.data);
        if (this.message) {
            this.message.hide();
        }
        if (!(error || this.options.background)) {
            this.showMeta();
        }
        this.updateDisplay();
    }

    onMediaLoaded(e) {
        this._state.media_loaded = true;
        this.fire("media_loaded", this.data);
        if (this._el.credit) {
            this._el.credit.style.width = this._el.content_item.offsetWidth + "px";
        }
        if (this._el.caption) {
            this._el.caption.style.width = this._el.content_item.offsetWidth + "px";
        }
    }

    showMeta(credit, caption) {
        this._state.show_meta = true;
        // Credit
        if (this.data.credit && this.data.credit != "") {
            this._el.credit = DOM.create("div", "tl-credit", this._el.content_container);
            this._el.credit.innerHTML = this.options.autolink == true ? linkify(this.data.credit) : this.data.credit;
            this.options.credit_height = this._el.credit.offsetHeight;
        }

        // Caption
        if (this.data.caption && this.data.caption != "") {
            this._el.caption = DOM.create("div", "tl-caption", this._el.content_container);
            this._el.caption.innerHTML = this.options.autolink == true ? linkify(this.data.caption) : this.data.caption;
            this.options.caption_height = this._el.caption.offsetHeight;
        }

        if (!this.data.caption || !this.data.credit) {
            this.getMeta();
        }

    }

    getMeta() {
        this._getMeta();
    }

    updateMeta() {
        if (!this.data.credit && this.data.credit_alternate) {
            this._el.credit = DOM.create("div", "tl-credit", this._el.content_container);
            this._el.credit.innerHTML = this.data.credit_alternate;
            this.options.credit_height = this._el.credit.offsetHeight;
        }

        if (!this.data.caption && this.data.caption_alternate) {
            this._el.caption = DOM.create("div", "tl-caption", this._el.content_container);
            this._el.caption.innerHTML = this.data.caption_alternate;
            this.options.caption_height = this._el.caption.offsetHeight;
        }

        this.updateDisplay();
    }

    onAdd() {
        this.fire("added", this.data);
    }

    onRemove() {
        this.fire("removed", this.data);
    }

    /*	Private Methods
    ================================================== */
    _initLayout() {

        // Message
        this.message = new Message(this._el.container, this.options, this.getLanguage());
        // this.message.addTo(this._el.container);

        // Create Layout
        this._el.content_container = DOM.create("div", "tl-media-content-container", this._el.container);

        // Link
        if (this.data.link && this.data.link != "") {

            this._el.link = DOM.create("a", "tl-media-link", this._el.content_container);
            this._el.link.href = this.data.link;
            if (this.data.link_target && this.data.link_target != "") {
                this._el.link.target = this.data.link_target;
            } else {
                this._el.link.target = "_blank";
            }

            if (this._el.link.target == '_blank') {
                this._el.link.setAttribute('rel', 'noopener');
            }

            this._el.content = DOM.create("div", "tl-media-content", this._el.link);

        } else {
            this._el.content = DOM.create("div", "tl-media-content", this._el.content_container);
        }


    }

    // Update Display
    _updateDisplay(w, h, l) {
        if (w) {
            this.options.width = w;

        }
        //this._el.container.style.width = this.options.width + "px";
        if (h) {
            this.options.height = h;
        }

        if (l) {
            this.options.layout = l;
        }

        if (this._el.credit) {
            this.options.credit_height = this._el.credit.offsetHeight;
        }
        if (this._el.caption) {
            this.options.caption_height = this._el.caption.offsetHeight + 5;
        }

        this.updateMediaDisplay(this.options.layout);

    }

    domCreate(...params) {
        return DOM.create(...params)
    }

    _stopMedia() {

    }

}

classMixin(Media, Events, I18NMixins)

export { Media, Text }