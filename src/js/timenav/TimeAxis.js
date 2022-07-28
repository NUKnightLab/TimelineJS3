import { classMixin, mergeData } from "../core/Util"
import Events from "../core/Events"
import { DOMMixins } from "../dom/DOMMixins"
import { isInHorizontalViewport } from "../dom/DOMUtil"
import { I18NMixins } from "../language/I18NMixins"
import { easeInSpline } from "../animation/Ease";
import * as DOM from "../dom/DOM"

export class TimeAxis {
    constructor(elem, options, language) {

        if (language) {
            this.setLanguage(language)
        }
        // DOM Elements
        this._el = {
            container: {},
            content_container: {},
            major: {},
            minor: {},
        };

        // Components
        this._text = {};

        // State
        this._state = {
            loaded: false
        };


        // Data
        this.data = {};

        // Options
        this.options = {
            duration: 1000,
            ease: easeInSpline,
            width: 600,
            height: 600
        };

        // Actively Displaying
        this.active = false;

        // Animation Object
        this.animator = {};

        // Axis Helper
        this.axis_helper = {};

        // Minor tick dom element array
        this.minor_ticks = [];

        // Minor tick dom element array
        this.major_ticks = [];

        // Main element
        if (typeof elem === 'object') {
            this._el.container = elem;
        } else {
            this._el.container = DOM.get(elem);
        }

        // Merge Data and Options
        mergeData(this.options, options);

        this._initLayout();
        this._initEvents();

    }

    /*	Adding, Hiding, Showing etc
    ================================================== */
    show() {

    }

    hide() {

    }

    addTo(container) {
        container.appendChild(this._el.container);
    }

    removeFrom(container) {
        container.removeChild(this._el.container);
    }

    updateDisplay(w, h) {
        this._updateDisplay(w, h);
    }

    getLeft() {
        return this._el.container.style.left.slice(0, -2);
    }

    drawTicks(timescale, optimal_tick_width) {

        var ticks = timescale.getTicks();

        // FADE OUT
        this._el.major.className = "tl-timeaxis-major";
        this._el.minor.className = "tl-timeaxis-minor";
        this._el.major.style.opacity = 0;
        this._el.minor.style.opacity = 0;

        // CREATE MAJOR TICKS
        this.major_ticks = this._createTickElements(
            ticks['major'].ticks,
            this._el.major,
            timescale.getAxisTickDateFormat(ticks['major'].name)
        );

        // CREATE MINOR TICKS
        this.minor_ticks = this._createTickElements(
            ticks['minor'].ticks,
            this._el.minor,
            timescale.getAxisTickDateFormat(ticks['minor'].name),
            ticks['major'].ticks
        );

        this.positionTicks(timescale, optimal_tick_width, true);

        // FADE IN
        this._el.major.className = "tl-timeaxis-major tl-animate-opacity tl-timeaxis-animate-opacity";
        this._el.minor.className = "tl-timeaxis-minor tl-animate-opacity tl-timeaxis-animate-opacity";
        this._el.major.style.opacity = 1;
        this._el.minor.style.opacity = 1;
    }

    _createTickElements(ts_ticks, tick_element, dateformat, ticks_to_skip) {
        tick_element.innerHTML = "";
        var skip_times = {};

        var yearZero = new Date(-1, 13, -30);
        skip_times[yearZero.getTime()] = true;

        if (ticks_to_skip) {
            for (var i = 0; i < ticks_to_skip.length; i++) {
                skip_times[ticks_to_skip[i].getTime()] = true;
            }
        }

        var tick_elements = []
        for (var i = 0; i < ts_ticks.length; i++) {
            var ts_tick = ts_ticks[i];
            if (!(ts_tick.getTime() in skip_times)) {
                var tick = DOM.create("div", "tl-timeaxis-tick", tick_element),
                    tick_text = DOM.create("span", "tl-timeaxis-tick-text tl-animate-opacity", tick);

                let tick_display_date = ts_tick.getDisplayDate(this.getLanguage(), dateformat)
                tick_text.innerHTML = tick_display_date;

                tick_elements.push({
                    tick: tick,
                    tick_text: tick_text,
                    display_date: tick_display_date,
                    date: ts_tick
                });
            }
        }
        return tick_elements;
    }

    positionTicks(timescale, optimal_tick_width, no_animate) {

        // Handle Animation
        if (no_animate) {
            this._el.major.className = "tl-timeaxis-major";
            this._el.minor.className = "tl-timeaxis-minor";
        } else {
            this._el.major.className = "tl-timeaxis-major tl-timeaxis-animate";
            this._el.minor.className = "tl-timeaxis-minor tl-timeaxis-animate";
        }

        this._positionTickArray(this.major_ticks, timescale, optimal_tick_width);
        this._positionTickArray(this.minor_ticks, timescale, optimal_tick_width);

    }

    _positionTickArray(tick_array, timescale, optimal_tick_width) {
        // Poition Ticks & Handle density of ticks
        if (tick_array[1] && tick_array[0]) {
            var distance = (timescale.getPosition(tick_array[1].date.getMillisecond()) - timescale.getPosition(tick_array[0].date.getMillisecond())),
                fraction_of_array = 1;


            if (distance < optimal_tick_width) {
                fraction_of_array = Math.round(optimal_tick_width / timescale.getPixelsPerTick());
            }

            var show = 1;

            for (var i = 0; i < tick_array.length; i++) {

                var tick = tick_array[i];

                // Poition Ticks
                tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
                tick.tick_text.innerHTML = tick.display_date;

                // Handle density of ticks
                if (fraction_of_array > 1) {
                    if (show >= fraction_of_array) {
                        show = 1;
                        tick.tick_text.style.opacity = 1;
                        tick.tick.className = "tl-timeaxis-tick";
                    } else {
                        show++;
                        tick.tick_text.style.opacity = 0;
                        tick.tick.className = "tl-timeaxis-tick tl-timeaxis-tick-hidden";
                    }
                } else {
                    tick.tick_text.style.opacity = 1;
                    tick.tick.className = "tl-timeaxis-tick";
                }

            }
        }
    }

    getVisibleTicks() {
        return {
            major: this._getVisibleTickArray(this.major_ticks),
            minor: this._getVisibleTickArray(this.minor_ticks)
        }
    }

    _getVisibleTickArray(tick_array) {
        return tick_array.filter(({ tick }) => isInHorizontalViewport(tick))
    }

    /*	Events
    ================================================== */


    /*	Private Methods
    ================================================== */
    _initLayout() {
        this._el.content_container = DOM.create("div", "tl-timeaxis-content-container", this._el.container);
        this._el.major = DOM.create("div", "tl-timeaxis-major", this._el.content_container);
        this._el.minor = DOM.create("div", "tl-timeaxis-minor", this._el.content_container);

        // Fire event that the slide is loaded
        this.onLoaded();
    }

    _initEvents() {

    }

    // Update Display
    _updateDisplay(width, height, layout) {

        if (width) {
            this.options.width = width;
        }

        if (height) {
            this.options.height = height;
        }

    }

}

classMixin(TimeAxis, Events, DOMMixins, I18NMixins)
