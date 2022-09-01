import { classMixin, mergeData, findNextGreater, findNextLesser, isEven, findArrayNumberByUniqueID, trace } from "../core/Util"
import Events from "../core/Events"
import { DOMMixins } from "../dom/DOMMixins"
import { DOMEvent } from "../dom/DOMEvent"
import * as DOM from "../dom/DOM"
import { easeInOutQuint } from "../animation/Ease";
import { TimeScale } from "./TimeScale"
import { TimeGroup } from "./TimeGroup"
import { TimeEra } from "./TimeEra"
import { TimeAxis } from "./TimeAxis"
import { TimeMarker } from "./TimeMarker"
import Swipable from "../ui/Swipable"
import { Animate } from "../animation/Animate"
import { I18NMixins } from "../language/I18NMixins"



export class TimeNav {

    constructor(elem, timeline_config, options, language) {
        this.language = language
            // DOM ELEMENTS
        this._el = {
            parent: {},
            container: {},
            slider: {},
            slider_background: {},
            line: {},
            marker_container_mask: {},
            marker_container: {},
            marker_item_container: {},
            timeaxis: {},
            timeaxis_background: {}
        };

        this.collapsed = false;

        if (typeof elem === 'object') {
            this._el.container = elem;
        } else {
            this._el.container = DOM.get(elem);
        }
        this._el.container.setAttribute('tabindex', '0');

        // 'application' role supports predictable control of keyboard input in a complex component
        this._el.container.setAttribute('role', 'application');
        this._el.container.setAttribute('aria-label', this._('aria_label_timeline_navigation'));
        this._el.container.setAttribute('aria-description',
            'Navigate between markers with arrow keys. Press "Home" for the first and "End" for the last markers'
        );

        this.config = timeline_config;

        //Options
        this.options = {
            width: 600,
            height: 600,
            duration: 1000,
            ease: easeInOutQuint,
            has_groups: false,
            optimal_tick_width: 50,
            scale_factor: 2, // How many screen widths wide should the timeline be
            marker_padding: 5,
            timenav_height_min: 150, // Minimum timenav height
            marker_height_min: 30, // Minimum Marker Height
            marker_width_min: 100, // Minimum Marker Width
            zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89] // Array of Fibonacci numbers for TimeNav zoom levels http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibtable.html
        };

        // Animation
        this.animator = null;

        // Ready state
        this.ready = false;

        // Markers Array
        this._markers = [];

        // Eras Array
        this._eras = [];
        this.has_eras = false;

        // Groups Array
        this._groups = [];

        // Row Height
        this._calculated_row_height = 100;

        // Current Marker
        this.current_id = "";

        // Current Focused Marker
        this.current_focused_id = "";

        // TimeScale
        this.timescale = {};

        // TimeAxis
        this.timeaxis = {};

        // Max Rows
        this.max_rows = 6;

        // Animate CSS
        this.animate_css = false;

        // Swipe Object
        this._swipable;

        // Merge Data and Options
        mergeData(this.options, options);

    }

    init() {
        this._initLayout();
        this._initEvents();
        this._initData();
        this.updateDisplay();

        this._onLoaded();
    }

    /*	Public
    ================================================== */
    positionMarkers(fast) {
        // POSITION X
        for (var i = 0; i < this._markers.length; i++) {
            var pos = this.timescale.getPositionInfo(i);
            if (fast) {
                this._markers[i].setClass("tl-timemarker tl-timemarker-fast");
            } else {
                this._markers[i].setClass("tl-timemarker");
            }
            this._markers[i].setPosition({ left: pos.start });
            this._markers[i].setWidth(pos.width);
        };
    }

    /*	Update Display
    ================================================== */
    updateDisplay(width, height, animate) {
        let reposition_markers = false;
        if (width) {
            if (this.options.width == 0 && width > 0) {
                reposition_markers = true;
            }
            this.options.width = width;
        }
        if (height && height != this.options.height) {
            this.options.height = height;
            this.timescale = this._getTimeScale();
        }

        // Size Markers
        this._assignRowsToMarkers();

        // Size swipable area
        this._el.slider_background.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
        this._el.slider_background.style.left = -(this.options.width / 2) + "px";
        this._el.slider.style.width = this.timescale.getPixelWidth() + this.options.width + "px";

        // Update Swipable constraint
        this._swipable.updateConstraint({ top: false, bottom: false, left: (this.options.width / 2), right: -(this.timescale.getPixelWidth() - (this.options.width / 2)) });

        if (reposition_markers) {
            this._drawTimeline()
        }
        // Go to the current slide
        this.goToId(this.current_id, true);
    }


    /*	TimeScale
    ================================================== */
    _getTimeScale() {
        /* maybe the establishing config values (marker_height_min and max_rows) should be
        separated from making a TimeScale object, which happens in another spot in this file with duplicate mapping of properties of this TimeNav into the TimeScale options object? */
        // Set Max Rows
        var marker_height_min = 0;
        try {
            marker_height_min = parseInt(this.options.marker_height_min);
        } catch (e) {
            trace("Invalid value for marker_height_min option.");
            marker_height_min = 30;
        }
        if (marker_height_min == 0) {
            trace("marker_height_min option must not be zero.")
            marker_height_min = 30;
        }
        this.max_rows = Math.round((this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)) / marker_height_min);
        if (this.max_rows < 1) {
            this.max_rows = 1;
        }
        return new TimeScale(this.config, {
            display_width: this._el.container.offsetWidth,
            screen_multiplier: this.options.scale_factor,
            max_rows: this.max_rows

        });
    }

    _updateTimeScale(new_scale) {
        this.options.scale_factor = new_scale;
        this._updateDrawTimeline();
    }

    zoomIn() { // move the the next "higher" scale factor
        var new_scale = findNextGreater(this.options.zoom_sequence, this.options.scale_factor);
        this.setZoomFactor(new_scale);
    }

    zoomOut() { // move the the next "lower" scale factor
        var new_scale = findNextLesser(this.options.zoom_sequence, this.options.scale_factor);
        this.setZoomFactor(new_scale);
    }

    setZoom(level) {
        var zoom_factor = this.options.zoom_sequence[level];
        if (typeof(zoom_factor) == 'number') {
            this.setZoomFactor(zoom_factor);
        } else {
            console.warn("Invalid zoom level. Please use an index number between 0 and " + (this.options.zoom_sequence.length - 1));
        }
    }

    setZoomFactor(factor) {
        if (factor <= this.options.zoom_sequence[0]) {
            this.fire("zoomtoggle", { zoom: "out", show: false });
        } else {
            this.fire("zoomtoggle", { zoom: "out", show: true });
        }

        if (factor >= this.options.zoom_sequence[this.options.zoom_sequence.length - 1]) {
            this.fire("zoomtoggle", { zoom: "in", show: false });
        } else {
            this.fire("zoomtoggle", { zoom: "in", show: true });
        }

        if (factor == 0) {
            console.warn("Zoom factor must be greater than zero. Using 0.1");
            factor = 0.1;
        }
        this.options.scale_factor = factor;
        //this._updateDrawTimeline(true);
        this.goToId(this.current_id, !this._updateDrawTimeline(true), true);
    }

    /*	Groups
    ================================================== */
    _createGroups() {
        this._groups = [];
        var group_labels = this.timescale.getGroupLabels();

        if (group_labels) {
            this.options.has_groups = true;
            for (var i = 0; i < group_labels.length; i++) {
                this._createGroup(group_labels[i]);
            }
        }

    }

    _createGroup(group_label) {
        var group = new TimeGroup(group_label);
        this._addGroup(group);
        this._groups.push(group);
    }

    _addGroup(group) {
        group.addTo(this._el.container);

    }

    _positionGroups() {
        if (this.options.has_groups) {
            var available_height = (this.options.height - this._el.timeaxis_background.offsetHeight),
                group_height = Math.floor((available_height / this.timescale.getNumberOfRows()) - this.options.marker_padding),
                group_labels = this.timescale.getGroupLabels();

            for (var i = 0, group_rows = 0; i < this._groups.length; i++) {
                var group_y = Math.floor(group_rows * (group_height + this.options.marker_padding));
                var group_hide = false;
                if (group_y > (available_height - this.options.marker_padding)) {
                    group_hide = true;
                }

                this._groups[i].setRowPosition(group_y, this._calculated_row_height + this.options.marker_padding / 2);
                this._groups[i].setAlternateRowColor(isEven(i), group_hide);

                group_rows += this._groups[i].data.rows; // account for groups spanning multiple rows
            }
        }
    }

    /*	Markers
    ================================================== */
    _addMarker(marker) {
        marker.addTo(this._el.marker_item_container);
        marker.on('markerclick', this._onMarkerClick, this);
        marker.on('added', this._onMarkerAdded, this);
    }

    _createMarker(data, n) {
        var marker = new TimeMarker(data, this.options);
        this._addMarker(marker);
        if (n < 0) {
            this._markers.push(marker);
        } else {
            this._markers.splice(n, 0, marker);
        }
    }

    _createMarkers(array) {
        for (var i = 0; i < array.length; i++) {
            this._createMarker(array[i], -1);
        }
    }

    _removeMarker(marker) {
        marker.removeFrom(this._el.marker_item_container);
        //marker.off('added', this._onMarkerRemoved, this);
    }

    _destroyMarker(n) {
        this._removeMarker(this._markers[n]);
        this._markers.splice(n, 1);
    }

    _calculateMarkerHeight(h) {
        return ((h / this.timescale.getNumberOfRows()) - this.options.marker_padding);
    }

    _calculateRowHeight(h) {
        return (h / this.timescale.getNumberOfRows());
    }

    _calculateAvailableHeight() {
        return (this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding));
    }

    _calculateMinimumTimeNavHeight() {
        return (this.timescale.getNumberOfRows() * this.options.marker_height_min) + this._el.timeaxis_background.offsetHeight + (this.options.marker_padding);

    }

    getMinimumHeight() {
        return this._calculateMinimumTimeNavHeight();
    }

    _assignRowsToMarkers() {
        var available_height = this._calculateAvailableHeight(),
            marker_height = this._calculateMarkerHeight(available_height);


        this._positionGroups();

        this._calculated_row_height = this._calculateRowHeight(available_height);

        for (var i = 0; i < this._markers.length; i++) {

            // Set Height
            this._markers[i].setHeight(marker_height);

            //Position by Row
            var row = this.timescale.getPositionInfo(i).row;

            var marker_y = Math.floor(row * (marker_height + this.options.marker_padding)) + this.options.marker_padding;

            var remainder_height = available_height - marker_y + this.options.marker_padding;
            this._markers[i].setRowPosition(marker_y, remainder_height);
        };

    }

    _resetMarkersActive() {
        for (var i = 0; i < this._markers.length; i++) {
            this._markers[i].setActive(false);
        }
    }

    _resetMarkersBlurListeners() {
        for (var i = 0; i < this._markers.length; i++) {
            this._markers[i].off('markerblur', this._onMarkerBlur, this);
        }
    }

    _findMarkerIndex(n) {
        var _n = -1;
        if (typeof n == 'string' || n instanceof String) {
            _n = findArrayNumberByUniqueID(n, this._markers, "unique_id", _n);
        }
        return _n;
    }

    /*	ERAS
    ================================================== */
    _createEras(array) {
        for (var i = 0; i < array.length; i++) {
            var data = array[i];
            var era = new TimeEra(data.start_date,
                data.end_date,
                data.headline,
                this.options);
            this._eras.push(era);
            era.addTo(this._el.marker_item_container);
            era.on('added', this._onEraAdded, this);
        }
    }

    _positionEras(fast) {

        var era_color = 0;
        // POSITION X
        for (var i = 0; i < this._eras.length; i++) {
            var pos = {
                start: 0,
                end: 0,
                width: 0
            };

            pos.start = this.timescale.getPosition(this._eras[i].start_date.getTime());
            pos.end = this.timescale.getPosition(this._eras[i].end_date.getTime());
            pos.width = pos.end - pos.start;

            if (fast) {
                this._eras[i].setClass("tl-timeera tl-timeera-fast");
            } else {
                this._eras[i].setClass("tl-timeera");
            }
            this._eras[i].setPosition({ left: pos.start });
            this._eras[i].setWidth(pos.width);

            era_color++;
            if (era_color > 5) {
                era_color = 0;
            }
            this._eras[i].setColor(era_color);
        };

    }

    /*	Public
    ================================================== */

    // Create a marker
    createMarker(d, n) {
        this._createMarker(d, n);
    }

    // Create many markers from an array
    createMarkers(array) {
        this._createMarkers(array);
    }

    // Destroy marker by index
    destroyMarker(n) {
        this._destroyMarker(n);
    }

    // Destroy marker by id
    destroyMarkerId(id) {
        this.destroyMarker(this._findMarkerIndex(id));
    }

    /*	Navigation
    ================================================== */
    goTo(n, fast, css_animation) {
        var self = this,
            _ease = this.options.ease,
            _duration = this.options.duration,
            _n = (n < 0) ? 0 : n;

        // Set Marker active state
        this._resetMarkersActive();
        if (n >= 0 && n < this._markers.length) {
            this._markers[n].setActive(true);
        }

        this.animateMovement(_n, fast, css_animation, _duration, _ease);

        if (n >= 0 && n < this._markers.length) {
            this.current_id = this.current_focused_id = this._markers[n].data.unique_id;
        } else {
            this.current_id = this.current_focused_id = '';
        }

        this._setLabelWithCurrentMarker();
    }

    goToId(id, fast, css_animation) {
        this.goTo(this._findMarkerIndex(id), fast, css_animation);
    }

    focusOn(n, fast, css_animation) {
        const _ease = this.options.ease,
            _duration = this.options.duration,
            _n = (n < 0) ? 0 : n;

        this.animateMovement(_n, fast, css_animation, _duration, _ease);

        this._resetMarkersBlurListeners();
        if (n >= 0 && n < this._markers.length) {
            this._markers[n].setFocus();
            this.current_focused_id = this._markers[n].data.unique_id;
            this._markers[n].on('markerblur', this._onMarkerBlur, this);
        }
    }

    focusNext() {
        const n = this._findMarkerIndex(this.current_focused_id);
        if ((n + 1) < this._markers.length) {
            this.focusOn(n + 1);
        } else {
            this.focusOn(n);
        }
    }

    focusPrevious() {
        const n = this._findMarkerIndex(this.current_focused_id);
        if (n - 1 >= 0) {
            this.focusOn(n - 1);
        } else {
            this.focusOn(n);
        }
    }

    animateMovement(n, fast, css_animation, duration, ease) {
        // Stop animation
        if (this.animator) {
            this.animator.stop();
        }

        if (fast) {
            this._el.slider.className = "tl-timenav-slider";
            this._el.slider.style.left = -this._markers[n].getLeft() +
                (this.options.width / 2) + "px";
        } else {
            if (css_animation) {
                this._el.slider.className = "tl-timenav-slider tl-timenav-slider-animate";
                this.animate_css = true;
                this._el.slider.style.left = -this._markers[n].getLeft() +
                    (this.options.width / 2) + "px";
            } else {
                this._el.slider.className = "tl-timenav-slider";
                this.animator = Animate(this._el.slider, {
                    left: -this._markers[n].getLeft() +
                        (this.options.width / 2) + "px",
                    duration: duration,
                    easing: ease
                });
            }
        }

        if (n >= 0 && n < this._markers.length) {
            this.current_id = this._markers[n].data.unique_id;
        } else {
            this.current_id = '';
        }

        this._dispatchVisibleTicksChange();
    }

    goToId(id, fast, css_animation) {
        this.goTo(this._findMarkerIndex(id), fast, css_animation);
    }

    _dispatchVisibleTicksChange() {
        /**
         * The timeout is required to wait till the end of the animation
         * and repositioning of the ticks on the screen
         */
        if (this.ticks_change_timeout) {
            clearTimeout(this.ticks_change_timeout);
            this.ticks_change_timeout = null;
        }
        this.ticks_change_timeout = setTimeout(() => {
            const visible_ticks = this.timeaxis.getVisibleTicks();
            this.fire("visible_ticks_change", { visible_ticks });
        }, this.options.duration);
    }

    /*	Events
    ================================================== */
    _onLoaded() {
        this.ready = true;
        this.fire("loaded", this.config);
    }

    _onMarkerAdded(e) {
        this.fire("dateAdded", this.config);
    }

    _onEraAdded(e) {
        this.fire("eraAdded", this.config);
    }

    _onMarkerRemoved(e) {
        this.fire("dateRemoved", this.config);
    }

    _onMarkerClick(e) {
        // Go to the clicked marker
        this.goToId(e.unique_id);
        this.fire("change", { unique_id: e.unique_id });
    }

    _onMarkerBlur(e) {
        // Reset the focused marked to the active marker after it lost the focus
        if (this.current_focused_id === this.current_id) return;
        this.focusOn(this._findMarkerIndex(this.current_id));
    }

    _onMouseScroll(e) {

        var delta = 0,
            scroll_to = 0,
            constraint = {
                right: -(this.timescale.getPixelWidth() - (this.options.width / 2)),
                left: this.options.width / 2
            };
        if (!e) {
            e = window.event;
        }
        if (e.originalEvent) {
            e = e.originalEvent;
        }

        // Webkit and browsers able to differntiate between up/down and left/right scrolling
        if (typeof e.wheelDeltaX != 'undefined') {
            delta = e.wheelDeltaY / 6;
            if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
                delta = e.wheelDeltaX / 6;
            } else {
                //delta = e.wheelDeltaY/6;
                delta = 0;
            }
        }
        if (delta) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }
        // Stop from scrolling too far
        scroll_to = parseInt(this._el.slider.style.left.replace("px", "")) + delta;


        if (scroll_to > constraint.left) {
            scroll_to = constraint.left;
        } else if (scroll_to < constraint.right) {
            scroll_to = constraint.right;
        }

        if (this.animate_css) {
            this._el.slider.className = "tl-timenav-slider";
            this.animate_css = false;
        }

        this._el.slider.style.left = scroll_to + "px";

    }

    _onDragMove(e) {
        if (this.animate_css) {
            this._el.slider.className = "tl-timenav-slider";
            this.animate_css = false;
        }

    }

    _onKeydown(e) {
        DOMEvent.stopPropagation(e);

        switch (e.key) {
            case "ArrowUp":
            case "ArrowRight":
                {
                    this.focusNext();
                    break;
                }
            case "ArrowDown":
            case "ArrowLeft":
                {
                    this.focusPrevious();
                    break;
                }
            case "Home":
                {
                    this.focusOn(0);
                    break;
                }
            case "End":
                {
                    this.focusOn(this._markers.length - 1);
                    break;
                }
        }
    }

    /*	Private Methods
    ================================================== */

    _drawTimeline(fast) {
        this.timescale = this._getTimeScale();
        this.timeaxis.drawTicks(this.timescale, this.options.optimal_tick_width);
        this.positionMarkers(fast);
        this._assignRowsToMarkers();
        this._createGroups();
        this._positionGroups();

        if (this.has_eras) {

            this._positionEras(fast);
        }
    }

    _updateDrawTimeline(check_update) {
        var do_update = false;

        // Check to see if redraw is needed
        if (check_update) {
            /* keep this aligned with _getTimeScale or reduce code duplication */
            var temp_timescale = new TimeScale(this.config, {
                display_width: this._el.container.offsetWidth,
                screen_multiplier: this.options.scale_factor,
                max_rows: this.max_rows

            });

            if (this.timescale.getMajorScale() == temp_timescale.getMajorScale() &&
                this.timescale.getMinorScale() == temp_timescale.getMinorScale()) {
                do_update = true;
            }
        } else {
            do_update = true;
        }

        // Perform update or redraw
        if (do_update) {
            this.timescale = this._getTimeScale();
            this.timeaxis.positionTicks(this.timescale, this.options.optimal_tick_width);
            this.positionMarkers();
            this._assignRowsToMarkers();
            this._positionGroups();
            if (this.has_eras) {
                this._positionEras();
            }
            this.updateDisplay();
        } else {
            this._drawTimeline(true);
        }

        return do_update;

    }

    _setLabelWithCurrentMarker() {
        const currentMarker = this._markers[this._findMarkerIndex(this.current_focused_id)];
        const currentMarkerText = currentMarker && currentMarker.ariaLabel ?
            `, ${currentMarker.ariaLabel}, shown` :
            '';
        this._el.container.setAttribute('aria-label', `Timeline navigation ${currentMarkerText}`);
    }

    /*	Init
    ================================================== */
    _initLayout() {
        // Create Layout
        this._el.line = DOM.create('div', 'tl-timenav-line', this._el.container);
        this._el.slider = DOM.create('div', 'tl-timenav-slider', this._el.container);
        this._el.slider_background = DOM.create('div', 'tl-timenav-slider-background', this._el.slider);
        this._el.marker_container_mask = DOM.create('div', 'tl-timenav-container-mask', this._el.slider);
        this._el.marker_container = DOM.create('div', 'tl-timenav-container', this._el.marker_container_mask);
        this._el.marker_item_container = DOM.create('div', 'tl-timenav-item-container', this._el.marker_container);
        this._el.timeaxis = DOM.create('div', 'tl-timeaxis', this._el.slider);
        this._el.timeaxis_background = DOM.create('div', 'tl-timeaxis-background', this._el.container);

        // Time Axis
        this.timeaxis = new TimeAxis(this._el.timeaxis, this.options, this.language);

        // Swipable
        this._swipable = new Swipable(this._el.slider_background, this._el.slider, {
            enable: { x: true, y: false },
            constraint: { top: false, bottom: false, left: (this.options.width / 2), right: false },
            snap: false
        });
        this._swipable.enable();

    }

    _initEvents() {
        // Drag Events
        this._swipable.on('dragmove', this._onDragMove, this);

        // Scroll Events
        DOMEvent.addListener(this._el.container, 'mousewheel', this._onMouseScroll, this);
        DOMEvent.addListener(this._el.container, 'DOMMouseScroll', this._onMouseScroll, this);
        DOMEvent.addListener(this._el.container, 'keydown', this._onKeydown, this);
    }

    _initData() {
        // Create Markers and then add them
        this._createMarkers(this.config.events);

        if (this.config.eras && this.config.eras.length > 0) {
            this.has_eras = true;
            this._createEras(this.config.eras);
        }

        this._drawTimeline();

    }
}

classMixin(TimeNav, Events, DOMMixins, I18NMixins)