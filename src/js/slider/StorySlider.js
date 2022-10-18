import { I18NMixins } from "../language/I18NMixins";
import Events from "../core/Events";
import { easeInOutQuint } from "../animation/Ease"
import { classMixin, mergeData, unique_ID, findArrayNumberByUniqueID, hexToRgb, trace } from "../core/Util"
import { Animate } from "../animation/Animate"
import * as DOM from "../dom/DOM"
import { DOMEvent } from "../dom/DOMEvent"
import * as Browser from "../core/Browser"
import { addClass } from "../dom/DOMUtil"
import Swipable from "../ui/Swipable";
import Message from "../ui/Message"
import { Slide } from "./Slide"
import { SlideNav } from "./SlideNav"

export class StorySlider {
    constructor(elem, data, options, language) {

        if (language) {
            this.setLanguage(language)
        }

        // DOM ELEMENTS
        this._el = {
            container: {},
            background: {},
            slider_container_mask: {},
            slider_container: {},
            slider_item_container: {}
        };

        this._nav = {};
        this._nav.previous = {};
        this._nav.next = {};

        // Slide Spacing
        this.slide_spacing = 0;

        // Slides Array
        this._slides = [];

        // Swipe Object
        this._swipable;

        // Preload Timer
        this.preloadTimer;

        // Message
        this._message;

        // Current Slide
        this.current_id = '';

        // Data Object
        this.data = {};

        this.options = {
            id: "",
            layout: "portrait",
            width: 600,
            height: 600,
            default_bg_color: { r: 255, g: 255, b: 255 },
            slide_padding_lr: 40, // padding on slide of slide
            start_at_slide: 1,
            slide_default_fade: "0%", // landscape fade
            // animation
            duration: 1000,
            ease: easeInOutQuint,
            // interaction
            dragging: true,
            trackResize: true
        };

        // Main element ID
        if (typeof elem === 'object') {
            this._el.container = elem;
            this.options.id = unique_ID(6, "tl");
        } else {
            this.options.id = elem;
            this._el.container = DOM.get(elem);
        }

        if (!this._el.container.id) {
            this._el.container.id = this.options.id;
        }

        // Animation Object
        this.animator = null;

        // Merge Data and Options
        mergeData(this.options, options);
        mergeData(this.data, data);

    }

    init() {
        this._initLayout();
        this._initEvents();
        this._initData();
        this.updateDisplay();

        // Go to initial slide
        this.goTo(this.options.start_at_slide);

        this._onLoaded();
    }

    /* Slides
    ================================================== */
    _addSlide(slide) {
        slide.addTo(this._el.slider_item_container);
        slide.on('added', this._onSlideAdded, this);
        slide.on('background_change', this._onBackgroundChange, this);
    }

    _createSlide(d, title_slide, n) {
        var slide = new Slide(d, this.options, title_slide, this.getLanguage());
        this._addSlide(slide);
        if (n < 0) {
            this._slides.push(slide);
        } else {
            this._slides.splice(n, 0, slide);
        }
    }

    _createSlides(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].unique_id == "") {
                array[i].unique_id = unique_ID(6, "tl-slide");
            }
            this._createSlide(array[i], false, -1);
        }
    }

    _removeSlide(slide) {
        slide.removeFrom(this._el.slider_item_container);
        slide.off('added', this._onSlideRemoved, this);
        slide.off('background_change', this._onBackgroundChange);
    }

    _destroySlide(n) {
        this._removeSlide(this._slides[n]);
        this._slides.splice(n, 1);
    }

    _findSlideIndex(n) {
        var _n = n;
        if (typeof n == 'string' || n instanceof String) {
            _n = findArrayNumberByUniqueID(n, this._slides, "unique_id");
        }
        return _n;
    }

    /*	Public
    ================================================== */
    updateDisplay(width, height, animate, layout) {
        var nav_pos, _layout;

        if (typeof layout === 'undefined') {
            _layout = this.options.layout;
        } else {
            _layout = layout;
        }

        this.options.layout = _layout;

        if (width) {
            this.options.width = width;
        } else {
            this.options.width = this._el.container.offsetWidth;
        }

        if (height) {
            this.options.height = height;
        } else {
            this.options.height = this._el.container.offsetHeight;
        }

        this.slide_spacing = this.options.width * 2;

        // position navigation
        nav_pos = (this.options.height / 2);
        this._nav.next.setPosition({ top: nav_pos });
        this._nav.previous.setPosition({ top: nav_pos });


        // Position slides
        for (var i = 0; i < this._slides.length; i++) {
            this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
            this._slides[i].setPosition({ left: (this.slide_spacing * i), top: 0 });

        };

        // Go to the current slide
        this.goToId(this.current_id, true, true);
    }


    // Create a slide
    createSlide(d, n) {
        this._createSlide(d, false, n);
    }

    // Create Many Slides from an array
    createSlides(array) {
        this._createSlides(array);
    }

    // Destroy slide by index
    destroySlide(n) {
        this._destroySlide(n);
    }

    // Destroy slide by id
    destroySlideId(id) {
        this.destroySlide(this._findSlideIndex(id));
    }

    /*	Navigation
    ================================================== */
    goTo(n, fast, displayupdate) {
        n = parseInt(n);
        if (isNaN(n)) n = 0;

        var self = this;

        this.changeBackground({ color_value: "", image: false });

        // Clear Preloader Timer
        if (this.preloadTimer) {
            clearTimeout(this.preloadTimer);
        }

        // Set Slide Active State
        for (var i = 0; i < this._slides.length; i++) {
            this._slides[i].setActive(false);
        }

        if (n < this._slides.length && n >= 0) {
            this.current_id = this._slides[n].data.unique_id;

            // Stop animation
            if (this.animator) {
                this.animator.stop();
            }
            if (this._swipable) {
                this._swipable.stopMomentum();
            }

            if (fast) {
                this._el.slider_container.style.left = -(this.slide_spacing * n) + "px";
                this._onSlideChange(displayupdate);
            } else {
                this.animator = Animate(this._el.slider_container, {
                    left: -(this.slide_spacing * n) + "px",
                    duration: this.options.duration,
                    easing: this.options.ease,
                    complete: this._onSlideChange(displayupdate)
                });
            }

            // Set Slide Active State
            this._slides[n].setActive(true);

            // Update Navigation and Info
            if (this._slides[n + 1]) {
                this.showNav(this._nav.next, true);
                this._nav.next.update(this._slides[n + 1]);
            } else {
                this.showNav(this._nav.next, false);
            }
            if (this._slides[n - 1]) {
                this.showNav(this._nav.previous, true);
                this._nav.previous.update(this._slides[n - 1]);
            } else {
                this.showNav(this._nav.previous, false);
            }

            // Preload Slides
            this.preloadTimer = setTimeout(function() {
                self.preloadSlides(n);
            }, this.options.duration);
        }
    }

    goToId(id, fast, displayupdate) {
        this.goTo(this._findSlideIndex(id), fast, displayupdate);
    }

    preloadSlides(n) {
        if (this._slides[n + 1]) {
            this._slides[n + 1].loadMedia();
            this._slides[n + 1].scrollToTop();
        }
        if (this._slides[n + 2]) {
            this._slides[n + 2].loadMedia();
            this._slides[n + 2].scrollToTop();
        }
        if (this._slides[n - 1]) {
            this._slides[n - 1].loadMedia();
            this._slides[n - 1].scrollToTop();
        }
        if (this._slides[n - 2]) {
            this._slides[n - 2].loadMedia();
            this._slides[n - 2].scrollToTop();
        }
    }

    next() {
        var n = this._findSlideIndex(this.current_id);
        if ((n + 1) < (this._slides.length)) {
            this.goTo(n + 1);
        } else {
            this.goTo(n);
        }
    }

    previous() {
        var n = this._findSlideIndex(this.current_id);
        if (n - 1 >= 0) {
            this.goTo(n - 1);
        } else {
            this.goTo(n);
        }
    }

    showNav(nav_obj, show) {

        if (this.options.width <= 500 && Browser.mobile) {
            nav_obj.hide();
        } else {
            if (show) {
                nav_obj.show();
            } else {
                nav_obj.hide();
            }

        }
    }



    changeBackground(bg) {
            var bg_color = { r: 256, g: 256, b: 256 },
                bg_color_rgb;

            if (bg.color_value && bg.color_value != "") {
                bg_color = hexToRgb(bg.color_value);
                if (!bg_color) {
                    trace("Invalid color value " + bg.color_value);
                    bg_color = this.options.default_bg_color;
                }
            } else {
                bg_color = this.options.default_bg_color;
                bg.color_value = "rgb(" + bg_color.r + " , " + bg_color.g + ", " + bg_color.b + ")";
            }

            bg_color_rgb = bg_color.r + "," + bg_color.g + "," + bg_color.b;
            this._el.background.style.backgroundImage = "none";


            if (bg.color_value) {
                this._el.background.style.backgroundColor = bg.color_value;
            } else {
                this._el.background.style.backgroundColor = "transparent";
            }

            if (bg_color.r < 255 || bg_color.g < 255 || bg_color.b < 255 || bg.image) {
                this._nav.next.setColor(true);
                this._nav.previous.setColor(true);
            } else {
                this._nav.next.setColor(false);
                this._nav.previous.setColor(false);
            }
        }
        /*	Private Methods
        ================================================== */

    // Update Display

    // Reposition and redraw slides
    _updateDrawSlides() {
        var _layout = this.options.layout;

        for (var i = 0; i < this._slides.length; i++) {
            this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
            this._slides[i].setPosition({ left: (this.slide_spacing * i), top: 0 });
        };

        this.goToId(this.current_id, true, false);
    }


    /*	Init
    ================================================== */
    _initLayout() {

        addClass(this._el.container, 'tl-storyslider');

        // Create Navigation
        this._nav.previous = new SlideNav({ title: "Previous", description: "description" }, { direction: "previous" }, this._el.container);
        this._nav.next = new SlideNav({ title: "Next", description: "description" }, { direction: "next" }, this._el.container);

        // Create Layout
        this._el.slider_container_mask = DOM.create('div', 'tl-slider-container-mask', this._el.container);
        this._el.background = DOM.create('div', 'tl-slider-background tl-animate', this._el.container);
        this._el.slider_container = DOM.create('div', 'tl-slider-container tlanimate', this._el.slider_container_mask);
        this._el.slider_item_container = DOM.create('div', 'tl-slider-item-container', this._el.slider_container);

        // Add aria-live polite to slide_container
        this._el.slider_container.setAttribute('aria-live', 'polite');

        // Update Size
        this.options.width = this._el.container.offsetWidth;
        this.options.height = this._el.container.offsetHeight;

        this._el.slider_container.style.left = "0px";

        if (Browser.touch) {
            //this._el.slider_touch_mask = DOM.create('div', 'tl-slider-touch-mask', this._el.slider_container_mask);
            this._swipable = new Swipable(this._el.slider_container_mask, this._el.slider_container, {
                enable: { x: true, y: false },
                snap: true
            });
            this._swipable.enable();

            // Message
            this._message = new Message(this._el.container, {
                    message_class: "tl-message-full",
                    message_icon_class: "tl-icon-swipe-left"
                },
                this.getLanguage());
            this._message.updateMessage(this._("swipe_to_navigate"));
            this._message.addTo(this._el.container);
        }

    }

    _initEvents() {
        this._nav.next.on('clicked', this._onNavigation, this);
        this._nav.previous.on('clicked', this._onNavigation, this);

        if (this._message) {
            this._message.on('clicked', this._onMessageClick, this);
        }

        if (this._swipable) {
            this._swipable.on('swipe_left', this._onNavigation, this);
            this._swipable.on('swipe_right', this._onNavigation, this);
            this._swipable.on('swipe_nodirection', this._onSwipeNoDirection, this);
        }


    }

    _initData() {
        if (this.data.title) {
            this._createSlide(this.data.title, true, -1);
        }
        this._createSlides(this.data.events);
    }

    /*	Events
    ================================================== */
    _onBackgroundChange(e) {
        var n = this._findSlideIndex(this.current_id);
        var slide_background = this._slides[n].getBackground();
        this.changeBackground(e);
        this.fire("colorchange", slide_background);
    }

    _onMessageClick(e) {
        this._message.hide();
    }

    _onSwipeNoDirection(e) {
        this.goToId(this.current_id);
    }

    _onNavigation(e) {

        if (e.direction == "next" || e.direction == "left") {
            this.next();
        } else if (e.direction == "previous" || e.direction == "right") {
            this.previous();
        }
        this.fire("nav_" + e.direction, this.data);
    }

    _onSlideAdded(e) {
        trace("slideadded")
        this.fire("slideAdded", this.data);
    }

    _onSlideRemoved(e) {
        this.fire("slideRemoved", this.data);
    }

    _onSlideChange(displayupdate) {
        if (!displayupdate) {
            this.fire("change", { unique_id: this.current_id });
        }
    }

    _onMouseClick(e) {

    }

    _fireMouseEvent(e) {
        if (!this._loaded) {
            return;
        }

        var type = e.type;
        type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

        if (!this.hasEventListeners(type)) {
            return;
        }

        if (type === 'contextmenu') {
            DOMEvent.preventDefault(e);
        }

        this.fire(type, {
            latlng: "something", //this.mouseEventToLatLng(e),
            layerPoint: "something else" //this.mouseEventToLayerPoint(e)
        });
    }

    _onLoaded() {
        this.fire("loaded", this.data);
    }


}

classMixin(StorySlider, I18NMixins, Events)
