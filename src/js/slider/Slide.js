import "wicg-inert";

import { addClass } from "../dom/DOMUtil"
import { I18NMixins } from "../language/I18NMixins";
import Events from "../core/Events";
import { DOMMixins } from "../dom/DOMMixins";
import { classMixin, mergeData, trim } from "../core/Util"
import * as DOM from "../dom/DOM"
import { Animate } from "../animation/Animate"
import { easeInSpline } from "../animation/Ease"
import * as Browser from "../core/Browser"
import { lookupMediaType } from "../media/MediaType";
import { Text } from "../media/Media"

export class Slide {

    constructor(data, options, title_slide, language) {
        if (language) {
            this.setLanguage(language)
        }

        // DOM Elements
        this._el = {
            container: {},
            scroll_container: {},
            background: {},
            content_container: {},
            content: {}
        };

        // Components
        this._media = null;
        this._mediaclass = {};
        this._text = {};
        this._background_media = null;

        // State
        this._state = {
            loaded: false
        };

        this.has = {
            headline: false,
            text: false,
            media: false,
            title: false,
            background: {
                image: false,
                color: false,
                color_value: ""
            }
        }

        this.has.title = title_slide;

        // Data
        this.data = {
            unique_id: null,
            background: null,
            start_date: null,
            end_date: null,
            location: null,
            text: null,
            media: null,
            autolink: true
        };

        // Options
        this.options = {
            // animation
            duration: 1000,
            slide_padding_lr: 40,
            ease: easeInSpline,
            width: 600,
            height: 600,
            skinny_size: 650,
            media_name: ""
        };

        // Actively Displaying
        this.active = false;

        // Animation Object
        this.animator = {};

        // Merge Data and Options
        mergeData(this.options, options);
        mergeData(this.data, data);

        this._initLayout();
        this._initEvents();


    }

    /*	Adding, Hiding, Showing etc
    ================================================== */
    show() {
        this.animator = Animate(this._el.slider_container, {
            left: -(this._el.container.offsetWidth * n) + "px",
            duration: this.options.duration,
            easing: this.options.ease
        });
    }

    hide() {

    }

    setActive(is_active) {
        this.active = is_active;

        if (this.active) {
            if (this.data.background) {
                this.fire("background_change", this.has.background);
            }
            this._setInteractive(true)
            this.loadMedia();
        } else {
            this.stopMedia();
            this._setInteractive(false)
        }
    }

    addTo(container) {
        container.appendChild(this._el.container);
        //this.onAdd();
    }

    removeFrom(container) {
        container.removeChild(this._el.container);
    }

    updateDisplay(width, height, layout) {
        var content_width,
            content_padding_left = this.options.slide_padding_lr,
            content_padding_right = this.options.slide_padding_lr;

        if (width) {
            this.options.width = width;
        } else {
            this.options.width = this._el.container.offsetWidth;
        }

        content_width = this.options.width - (this.options.slide_padding_lr * 2);

        if (Browser.mobile && (this.options.width <= this.options.skinny_size)) {
            content_padding_left = 0;
            content_padding_right = 0;
            content_width = this.options.width;
        } else if (layout == "landscape") {

        } else if (this.options.width <= this.options.skinny_size) {
            content_padding_left = 50;
            content_padding_right = 50;
            content_width = this.options.width - content_padding_left - content_padding_right;
        } else {

        }

        this._el.content.style.paddingLeft = content_padding_left + "px";
        this._el.content.style.paddingRight = content_padding_right + "px";
        this._el.content.style.width = content_width + "px";

        if (height) {
            this.options.height = height;
            //this._el.scroll_container.style.height		= this.options.height + "px";

        } else {
            this.options.height = this._el.container.offsetHeight;
        }

        if (this._media) {

            if (!this.has.text && this.has.headline) {
                this._media.updateDisplay(content_width, (this.options.height - this._text.headlineHeight()), layout);
            } else if (!this.has.text && !this.has.headline) {
                this._media.updateDisplay(content_width, this.options.height, layout);
            } else if (this.options.width <= this.options.skinny_size) {
                this._media.updateDisplay(content_width, this.options.height, layout);
            } else {
                this._media.updateDisplay(content_width / 2, this.options.height, layout);
            }
        }

        this._updateBackgroundDisplay();
    }

    loadMedia() {
        var self = this;

        if (this._media && !this._state.loaded) {
            this._media.loadMedia();
            this._state.loaded = true;
        }

        if (this._background_media && !this._background_media._state.loaded) {
            this._background_media.on("loaded", function() {
                self._updateBackgroundDisplay();
            });
            this._background_media.loadMedia();
        }
    }

    stopMedia() {
        if (this._media && this._state.loaded) {
            this._media.stopMedia();
        }
    }

    getBackground() {
        return this.has.background;
    }

    scrollToTop() {
        this._el.container.scrollTop = 0;
    }

    getFormattedDate() {

        if (trim(this.data.display_date).length > 0) {
            return this.data.display_date;
        }
        var date_text = "";

        if (!this.has.title) {
            if (this.data.end_date) {
                date_text = " &mdash; " + this.data.end_date.getDisplayDate(this.getLanguage());
            }
            if (this.data.start_date) {
                date_text = this.data.start_date.getDisplayDate(this.getLanguage()) + date_text;
            }
        }
        return date_text;
    }

    /*	Events
    ================================================== */


    /*	Private Methods
    ================================================== */
    _initLayout() {
        // Create Layout
        this._el.container = DOM.create("div", "tl-slide");

        if (this.has.title) {
            this._el.container.className = "tl-slide tl-slide-titleslide";
        }

        if (this.data.unique_id) {
            this._el.container.id = this.data.unique_id;
        }
        this._el.scroll_container = DOM.create("div", "tl-slide-scrollable-container", this._el.container);
        this._el.content_container = DOM.create("div", "tl-slide-content-container", this._el.scroll_container);
        this._el.content = DOM.create("div", "tl-slide-content", this._el.content_container);
        this._el.background = DOM.create("div", "tl-slide-background", this._el.container);
        // Style Slide Background
        if (this.data.background) {
            if (this.data.background.url) {
                var media_type = lookupMediaType(this.data.background, true);
                if (media_type) {
                    this._background_media = new media_type.cls(this.data.background, { background: 1 });

                    this.has.background.image = true;
                    this._el.container.className += ' tl-full-image-background';
                    this.has.background.color_value = "#000";
                    this._el.background.style.display = "block";
                }
                if (this.data.background.alt) {
                    this._el.background.setAttribute('role', 'img');
                    this._el.background.setAttribute('aria-label', this.data.background.alt);
                }
            }
            if (this.data.background.color) {
                this.has.background.color = true;
                this._el.container.className += ' tl-full-color-background';
                this.has.background.color_value = this.data.background.color;
                //this._el.container.style.backgroundColor = this.data.background.color;
                //this._el.background.style.backgroundColor 	= this.data.background.color;
                //this._el.background.style.display 			= "block";
            }
            if (this.data.background.text_background) {
                this._el.container.className += ' tl-text-background';
            }

        }



        // Determine Assets for layout and loading
        if (this.data.media && this.data.media.url && this.data.media.url != "") {
            this.has.media = true;
        }
        if (this.data.text && this.data.text.text) {
            this.has.text = true;
        }
        if (this.data.text && this.data.text.headline) {
            this.has.headline = true;
        }

        // Create Media
        if (this.has.media) {
            // Determine the media type
            this.data.media.mediatype = lookupMediaType(this.data.media);
            this.options.media_name = this.data.media.mediatype.name;
            this.options.media_type = this.data.media.mediatype.type;
            this.options.autolink = this.data.autolink;

            // Create a media object using the matched class name
            this._media = new this.data.media.mediatype.cls(this.data.media, this.options, this.getLanguage());
        }

        // Create Text
        if (this.has.text || this.has.headline) {
            this._text = new Text(this.data.text, { title: this.has.title, language: this.getLanguage(), autolink: this.data.autolink });
            this._text.addDateText(this.getFormattedDate());
        }



        // Add to DOM
        if (!this.has.text && !this.has.headline && this.has.media) {
            addClass(this._el.container, 'tl-slide-media-only');
            this._media.addTo(this._el.content);
        } else if (this.has.headline && this.has.media && !this.has.text) {
            addClass(this._el.container, 'tl-slide-media-only');
            this._text.addTo(this._el.content);
            this._media.addTo(this._el.content);
        } else if (this.has.text && this.has.media) {
            this._text.addTo(this._el.content);
            this._media.addTo(this._el.content);
        } else if (this.has.text || this.has.headline) {
            addClass(this._el.container, 'tl-slide-text-only');
            this._text.addTo(this._el.content);
        }

        // Fire event that the slide is loaded
        this.onLoaded();

    }

    _initEvents() {

    }

    _updateBackgroundDisplay() {
        if (this._background_media && this._background_media._state.loaded) {
            this._el.background.style.backgroundImage = "url('" + this._background_media.getImageURL(this.options.width, this.options.height) + "')";
        }
    }

    _setInteractive(is_interactive) {
        if (is_interactive) {
            this._el.container.removeAttribute('inert');
        } else {
            this._el.container.setAttribute('inert', true);
        }
    }
}
classMixin(Slide, I18NMixins, Events, DOMMixins)